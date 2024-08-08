import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { headers } from "next/headers";
import prismadb from "@/lib/prismadb";
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
    const sig = headers().get("stripe-signature") as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      return new Response(`Webhook Error: ${err}`, {
        status: 400,
      });
    }
    switch (event.type) {
      case "customer.subscription.created":
        const subscription_data = event.data.object;
        const customer_id = subscription_data.customer as string;
        const user = await prismadb.userSettings.findFirst({where: {customerId: customer_id}})
        if(user) {
          await prismadb.userSettings.update({
            where: {userId: user.userId},
            data: {plan: "PRO"}
          })
          console.log(`User settings updated for customer ID ${customer_id}`);
        } else {
          console.error("No matching user settings found for customer ID:", customer_id);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return new Response("RESPONSE EXECUTE", {
      status: 200,
    });
  } catch (error) {

  }
}