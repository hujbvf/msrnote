export async function POST(): Promise<Response> {
  // クッキーを設定
  const headers = new Headers();

  // クッキーの有効期限を設定
  const expires = new Date();
  expires.setDate(expires.getDate() - 1); // 前日の日時を設定

  headers.append(
    "Set-Cookie",
    `token=; Expires=${expires.toUTCString()}; Path=/; HttpOnly; SameSite=Strict${import.meta.env.MODE === "production" ? "; Secure" : ""}`,
  );

  // リダイレクト先を指定
  headers.append("Location", "/login/");

  return new Response(null, {
    status: 302, // 302は一時的なリダイレクト
    headers,
  });
}
