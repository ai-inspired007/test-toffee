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
      case "customer.subscription.created": {
        const subscription_data = event.data.object as Stripe.Subscription;
        const customer_id = subscription_data.customer as string;
        const user = await prismadb.userSettings.findFirst({ where: { customerId: customer_id } });
        if (user) {
          await prismadb.userSettings.update({
            where: { userId: user.userId },
            data: { plan: "PRO" }
          });
          console.log(`User settings updated for customer ID ${customer_id}`);
        } else {
          console.error("No matching user settings found for customer ID:", customer_id);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription_data = event.data.object as Stripe.Subscription;
        const customer_id = subscription_data.customer as string;
        const user = await prismadb.userSettings.findFirst({ where: { customerId: customer_id } });
        if (user) {
          await prismadb.userSettings.update({
            where: { userId: user.userId },
            data: { plan: "FREE" }
          });
          console.log(`User settings updated for cancellation of customer ID ${customer_id}`);
        } else {
          console.error("No matching user settings found for customer ID:", customer_id);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response("Webhook handled", {
      status: 200,
    });
  } catch (error) {
    console.error("Error in webhook handler", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  const { customerId } = await req.json();

  if (!customerId) {
    return new NextResponse('Customer ID is required', { status: 400 });
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === 'active'
    );

    if (activeSubscription) {
      await stripe.subscriptions.cancel(activeSubscription.id);
      return new NextResponse('Subscription scheduled for cancellation successfully', { status: 200 });
    } else {
      return new NextResponse('No active subscription found', { status: 404 });
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}