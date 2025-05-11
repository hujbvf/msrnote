import Stripe from "stripe";

export async function GET(context: any) {
  const { env } = context.locals.runtime;

  const stripe = new Stripe(env.STRIPE_SECRET_KEY as string);

  const customer = await stripe.customers.create({
    email: "hujbvf@icloud.com",
  });
  return new Response(`Customer ID: ${customer.id}`, { status: 200 });
}
