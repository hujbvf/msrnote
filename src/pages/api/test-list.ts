import Stripe from "stripe";

export async function GET(context: any) {
  const { env } = context.locals.runtime;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  const list = await stripe.customers.list({ limit: 10 });
  console.log("顧客リスト： ", list);

  return new Response("Customer list", { status: 200 });
}
