import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // @ts-ignore
    apiVersion: null,
    appInfo: {
      name: 'Toffee',
      version: '0.0.0',
      url: 'https://localhost:3000/'
    }
  }
);
