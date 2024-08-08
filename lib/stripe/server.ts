"use server";
import { auth } from "@/auth";
import { getURL, calculateTrialEndUnixTimestamp } from "../utils";
import { Price } from "./type";
import prismadb from "../prismadb";
import { stripe } from "./config";
import Stripe from "stripe";
import { UserSettings } from "@prisma/client";
export async function getUser(user_id: string) {
  const user = await prismadb.userSettings.findUnique({
    where: { userId: user_id }
  })
  console.log(user)
  return user
}
export async function updateUser(user_id: string, data: { customerId: string }) {
  const updatedUser = await prismadb.userSettings.update({
    where: { userId: user_id },
    data: { customerId: data.customerId }
  })
  if (updatedUser) {
    return updatedUser
  } else {
    return null
  }
}
export async function createCustomerInStripe(email: string) {
  const customer = await stripe.customers.create({ email: email });
  if (!customer) throw new Error("Stripe customer creation failed.");
  return customer.id;
}
export async function createOrRetrieveCustomer(
  user: UserSettings
) {
  const email = user.email
  const customer_id = user.customerId
  const user_id = user.userId
  if (user && email) {
    if (user?.plan === "PRO") throw new Error("You already have subscription.");
    let stripeCustomerId: string | undefined;
    if (customer_id) {
      const existingCustomer = await stripe.customers.retrieve(customer_id);
      stripeCustomerId = existingCustomer.id;
    } else {
      const stripeCustomers = await stripe.customers.list({ email: email });
      stripeCustomerId =
        stripeCustomers.data.length > 0
          ? stripeCustomers.data[0].id
          : undefined;
    }
    const stripeIdToInsert = stripeCustomerId
      ? stripeCustomerId
      : await createCustomerInStripe(email);
    if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");
    if (user.customerId !== stripeCustomerId && stripeCustomerId) {
      const res = await updateUser(user_id, {
        customerId: stripeCustomerId
      })
      if (res === null) {
        throw new Error(`Customer record update failed`);
      }
      console.warn(`Customer record was missing. A new record was created.`);
    }
    return stripeCustomerId;
  } else {
    return null
  }

}

export async function checkoutWithStripe(price: Price, userId: string, redirectPath: string = "/") {
  try {
    const user = await getUser(userId);
    if (!user) {
      throw new Error("Could not get user session.");
    } else {
      const customer = await createOrRetrieveCustomer(user);
      if (customer) {
        let params: Stripe.Checkout.SessionCreateParams = {
          allow_promotion_codes: true,
          billing_address_collection: "required",
          customer,
          customer_update: {
            address: "auto",
          },
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          cancel_url: getURL(),
          success_url: getURL(redirectPath),
        };
        console.log(
          "Trial end:",
          calculateTrialEndUnixTimestamp(price.trial_period_days)
        );
        if (price.type === "recurring") {
          params = {
            ...params,
            mode: "subscription",
            subscription_data: {
              trial_end: calculateTrialEndUnixTimestamp(
                price.trial_period_days
              ),
            },
          };
        } else if (price.type === "one_time") {
          params = {
            ...params,
            mode: "payment",
          };
        }
        let session;
        try {
          session = await stripe.checkout.sessions.create(params);
        } catch (err) {
          console.error(err);
          throw new Error("Unable to create checkout session.");
        }

        // Instead of returning a Response, just return the data or error.
        if (session) {
          return { sessionId: session.id };
        } else {
          throw new Error("Unable to create checkout session.");
        }
      } else {
        return null;
      }
    }
  } catch (error) {
    return null
  }
}