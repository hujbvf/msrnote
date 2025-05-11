import Stripe from "stripe";

export async function POST(context: any): Promise<Response> {
  // 環境変数を取得
  const { env } = context.locals.runtime;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY as string);
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  const body = await context.request.text();
  const sig = context.request.headers.get("stripe-signature");
  console.log(`body: ${body}`);

  let event = body;

  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook シグネチャの検証に失敗しました: ${err}`);
      return new Response("Webhook エラー", { status: 400 });
    }
  }

  // データベースを取得
  const db = env.DB;

  // プランのリスト
  const planList = {
    free: "price_1RLIin03X1TtY8CFon4AaIwB",
    standard: "price_1RLIin03X1TtY8CFgCHgZI3j",
    pro: "price_1RLIin03X1TtY8CFNT7halsD",
  };

  // イベントごとの処理
  switch (event.type) {
    case "checkout.session.completed":
      // チェックアウトセッションが完了したときの処理
      const session = event.data.object;
      console.log("チェックアウトセッションが完了しました:", session);
      break;
    case "invoice.payment_succeeded":
      // 請求書の支払いが成功したときの処理
      const invoice = event.data.object;
      console.log("請求書の支払いが成功しました:", invoice);

      const invoiceCustomer = invoice.customer as string;
      const invoicePrice = invoice.lines.data[0].price.id as string;

      const planNew = Object.keys(planList).find(
        (key) => planList[key] === invoicePrice,
      );

      await db
        .prepare("UPDATE Users SET StripePlan = ? WHERE UserId = ?")
        .bind(planNew, invoiceCustomer)
        .run();
      break;
    case "invoice.payment_failed":
      // 請求書の支払いが失敗したときの処理
      const failedInvoice = event.data.object;
      console.log("請求書の支払いが失敗しました:", failedInvoice);

      const failedInvoiceCustomer = failedInvoice.customer as string;

      await db
        .prepare("UPDATE Users SET StripePlan = ? WHERE UserId = ?")
        .bind("free", failedInvoiceCustomer)
        .run();
      break;
    case "customer.subscription.updated":
      // サブスクリプションが更新されたときの処理
      const subscription = event.data.object;
      console.log("サブスクリプションが更新されました:", subscription);

      const prev = event.data.previous_attributes;

      // price ID の比較でプラン変更を検知
      const oldPriceId = prev?.items?.data?.[0]?.price?.id;
      const newPriceId = subscription.items?.data?.[0]?.price?.id;

      if (oldPriceId && newPriceId && oldPriceId !== newPriceId) {
        const subscriptionCustomer = subscription.customer as string;
        const subscriptionPrice = subscription.items.data[0].price.id as string;

        const planUpdate = Object.keys(planList).find(
          (key) => planList[key] === subscriptionPrice,
        );

        await db
          .prepare("UPDATE Users SET StripePlan = ? WHERE UserId = ?")
          .bind(planUpdate, subscriptionCustomer)
          .run();
      }
      break;
    case "customer.subscription.deleted":
      // サブスクリプションが削除されたときの処理
      const deletedSubscription = event.data.object;
      console.log("サブスクリプションが削除されました:", deletedSubscription);

      const deletedSubscriptionCustomer =
        deletedSubscription.customer as string;

      await db
        .prepare("UPDATE Users SET StripePlan = ? WHERE UserId = ?")
        .bind("free", deletedSubscriptionCustomer)
        .run();
      break;
    default:
      // その他のイベントタイプの処理
      console.log(`未処理のイベントタイプ: ${event.type}`);
  }

  return new Response("Webhook を受信しました", { status: 200 });
}
