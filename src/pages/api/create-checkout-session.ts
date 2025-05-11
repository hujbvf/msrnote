import Stripe from "stripe";
import jwt from "jsonwebtoken";

export async function POST(context: any) {
  const { priceId } = await context.request.json();

  // 環境変数を取得
  const { env } = context.locals.runtime;

  // ヘッダーからクッキーを取得
  const cookieHeader = context.request.headers.get("cookie");
  const cookie = cookieHeader
    ?.split("; ")
    .find((cookie: string) => cookie.startsWith("token="))
    ?.split("=")[1];

  const jwtSecret = env.AUTH_SECRET;

  let id: string;

  if (cookie) {
    try {
      // JWT を検証してユーザーIDを取得
      const decoded = jwt.verify(cookie, jwtSecret);
      if (!decoded) return;

      id = (decoded as jwt.JwtPayload).id;
    } catch (error) {
      // クッキーの検証に失敗した場合はエラーを返す
      console.error(error);
      return new Response("ログインされていません。", { status: 401 });
    }
  } else {
    // クッキーが存在しない場合はエラーを返す
    return new Response("ログインされていません。", { status: 401 });
  }

  // Stripe インスタンスを作成
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  // 顧客のサブスクリプションステータス
  let status: string;

  const subscriptions = await stripe.subscriptions.list({
    customer: id,
    status: "all",
  });

  const activeSubscription = subscriptions.data.find((sub) =>
    ["active", "trialing", "past_due", "unpaid"].includes(sub.status),
  );

  if (!activeSubscription) {
    status = "none"; // プラン未加入
  }

  if (activeSubscription) {
    const currendPriceId = activeSubscription?.items.data[0].price.id;

    if (currendPriceId === priceId) {
      status = "same"; // 同じプランに加入済み
    } else {
      status = "different"; // 別のプランに加入済み
    }
  }

  const baseUrl = new URL(context.request.url).origin;

  switch (status) {
    case "same": // 同じプラン
      return new Response("同じプランに加入済みです", { status: 200 });
      break;
    case "different": // プラン変更
      const subscriptionId = activeSubscription?.id;

      const updated = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false, // 即時更新
        proration_behavior: "create_prorations", // プロレート計算
        items: [
          {
            id: activeSubscription?.items.data[0].id,
            price: priceId,
          },
        ],
      });

      // プランのリスト
      const planList = {
        free: "price_1RLIin03X1TtY8CFon4AaIwB",
        standard: "price_1RLIin03X1TtY8CFgCHgZI3j",
        pro: "price_1RLIin03X1TtY8CFNT7halsD",
      };

      const planNew = Object.keys(planList).find(
        (key) => planList[key] === priceId,
      );

      return new Response(JSON.stringify({ plan: planNew }), {
        status: 302,
      });
      break;
    default: // 未加入
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: id,
        line_items: [
          {
            price: priceId, // 値段
            quantity: 1, // 数量
          },
        ],
        ui_mode: "hosted",
        success_url: `${baseUrl}/stripe-success`,
        cancel_url: `${baseUrl}/stripe-cancel`,
      });

      return new Response(JSON.stringify({ url: session.url }), {
        status: 302,
      });
      break;
  }
}
