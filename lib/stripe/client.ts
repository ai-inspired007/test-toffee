import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Price } from "@/lib/stripe/type";
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ??
        ''
    );
  }

  return stripePromise;
};

export const toffeePrice: Price = {
  id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
  active: true,
  currency: "usd",
  interval: "month",
  interval_count: 1,
  product_id: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID!,
  trial_period_days: 0,
  type: "recurring",
  unit_amount: 999
}