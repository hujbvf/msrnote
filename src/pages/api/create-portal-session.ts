import Stripe from "stripe";
import jwt from "jsonwebtoken";

export async function POST(context: any) {
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
      // JWTを検証してユーザーIDを取得
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

  // Stripeインスタンスを作成
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const baseUrl = new URL(context.request.url).origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: id,
    return_url: `${baseUrl}/user`,
  });

  console.log(session);

  return new Response(JSON.stringify({ url: session.url }), {
    status: 302,
  });
}
