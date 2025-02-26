// src/lib/pricingconfig.js
export const PRICING_PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "Up to 100 Projects",
      "Basic Templates",
      "Core Features",
      "Community Support",
    ],
  },
  PRO_MONTHLY: {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: 2,
    period: "month",
    lemon_variant_id: process.env.LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID,
    features: [
      "Unlimited Projects",
      "Premium Templates",
      "Advanced Features",
      "Priority Support",
      "Team Collaboration",
    ],
  },
  PRO_YEARLY: {
    id: "pro-yearly",
    name: "Pro Yearly",
    price: 10,
    period: "year",
    lemon_variant_id: process.env.LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID,
    features: [
      "Everything in Pro Monthly",
      "6 Months Free",
      "Early Access Features",
    ],
  },
};

export const PAYPAL_CONFIG = {
  SANDBOX: {
    CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    API_URL: "https://api-m.sandbox.paypal.com",
  },
  PRODUCTION: {
    CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    API_URL: "https://api-m.paypal.com",
  },
};

export const LEMON_CONFIG = {
  ENABLED: process.env.PAYMENT_PROVIDER === 'lemonsqueezy',
  STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
  API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
};
