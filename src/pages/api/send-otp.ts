import Stripe from "stripe";
import { authenticator } from "otplib";
import { Resend } from "resend";

export async function POST(context: any): Promise<Response> {
  const { email } = await context.request.json();
  if (!email)
    return new Response(JSON.stringify({ error: "メールアドレスが必要です" }), {
      status: 400,
    });

  // 環境変数を取得
  const { env } = context.locals.runtime;
  // データベースを取得
  const db = env.DB;

  // otplib の設定
  authenticator.options = {
    digits: 6, // 6桁のコードを生成
    epoch: Date.now(), // エポックは現在の時刻
    step: 300, // 有効期限は5分間（秒単位）
    window: 1, // 前後のウィンドウを許容する
  };

  // 既存のユーザーにメールアドレスが存在するか確認
  const user = await db
    .prepare("SELECT * FROM Users WHERE UserEmail = ?")
    .bind(email)
    .first();

  // 送信する OTP
  let sendOtp: string;

  // レスポンスで返すユーザー ID
  let responseId: string;

  if (!user) {
    // Stripeインスタンスを作成
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    // Stripe カスタマーを作成
    const customer = await stripe.customers.create({
      email: email as string,
    });

    // ID を生成
    const id = customer.id;
    responseId = id;
    // ランダムなシークレットキーを生成
    const secret = authenticator.generateSecret();
    // シークレットキーから OTP を生成
    const otp = authenticator.generate(secret);
    sendOtp = otp;

    // ユーザーが存在しない場合は新規ユーザーを作成
    await db
      .prepare(
        "INSERT INTO Users (UserId, UserEmail, OtpSecret, OtpValue) VALUES (?, ?, ?, ?)",
      )
      .bind(id, email, secret, otp)
      .run();
  } else {
    // ユーザーの ID を指定
    const id = user.UserId as string;
    responseId = id;
    // OTP を再生成
    const otp = authenticator.generate(user.OtpSecret as string);
    sendOtp = otp;

    // ユーザーが存在する場合は既存のユーザーを更新
    await db
      .prepare("UPDATE Users SET OtpValue = ? WHERE UserId = ?")
      .bind(otp, id)
      .run();
  }

  // Resend を使用してメール送信
  const resend = new Resend(env.AUTH_RESEND_KEY);

  const { data, error } = await resend.emails.send({
    from: `MsrNote <${env.AUTH_EMAIL_FROM}>`,
    to: [email],
    subject: "MsrNoteワンタイムコード",
    html: `<p>以下のワンタイムコードを入力してください。</p><p>ワンタイムコード: ${sendOtp}</p>`,
  });

  if (error) {
    const { message } = error;
    return new Response(JSON.stringify({ error: `OTP送信失敗: ${message}` }), {
      status: 500,
    });
  }

  return new Response(
    JSON.stringify({ message: `OTP送信成功: ${data}`, id: responseId }),
    {
      status: 200,
    },
  );
}
