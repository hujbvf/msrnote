import { authenticator } from "otplib";
import jwt from "jsonwebtoken";

export async function POST(context: any): Promise<Response> {
  const { id, otp } = await context.request.json();
  if (!id || !otp)
    return new Response(JSON.stringify({ error: "IDとOTPが必要です" }), {
      status: 400,
    });

  // 環境変数を取得
  const { env } = context.locals.runtime;
  // データベースを取得
  const db = env.DB;

  // 既存のユーザーにメールアドレスが存在するか確認
  const user = await db
    .prepare("SELECT * FROM Users WHERE UserId = ?")
    .bind(id)
    .first();

  if (!user)
    return new Response(JSON.stringify({ error: "ユーザーが見つかりません" }), {
      status: 404,
    });

  // authenticator.verifyを使ってOTPの有効性を確認
  const token = otp;
  const secret = user.OtpSecret as string;
  if (!secret) {
    return new Response(
      JSON.stringify({ error: "OTPシークレットが設定されていません" }),
      {
        status: 400,
      },
    );
  }
  const validOtp = authenticator.verify({ token, secret });
  if (!validOtp)
    return new Response(JSON.stringify({ error: "OTPが正しくありません" }), {
      status: 400,
    });

  // JWTを生成
  const jwtId = { id: id };
  const jwtSecret = env.AUTH_SECRET as string;
  const jwtOptions = {
    expiresIn: 7 * 24 * 60 * 60, // 7日間有効
  };
  const jwtToken = jwt.sign(jwtId, jwtSecret, jwtOptions);

  const headers = new Headers();

  // クッキーの有効期限を設定
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7日後の日時を設定

  headers.append(
    "Set-Cookie",
    `token=${jwtToken}; Expires=${expires.toUTCString()}; Path=/; HttpOnly; SameSite=Strict${import.meta.env.MODE === "production" ? "; Secure" : ""}`,
  );

  // OTPが正しい場合はログイン成功
  return new Response(JSON.stringify({ message: "ログイン成功", id: id }), {
    status: 200,
    headers,
  });
}
