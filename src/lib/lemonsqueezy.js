// LemonSqueezy Configuration
export const LEMON_CONFIG = {
  API_KEY: process.env.LEMON_SQUEEZY_API_KEY,
  STORE_ID: process.env.LEMON_SQUEEZY_STORE_ID,
  WEBHOOK_SECRET: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
  API_URL: 'https://api.lemonsqueezy.com/v1',
};

// Product and variant IDs from your LemonSqueezy store
export const LEMON_PRODUCTS = {
  PRO_MONTHLY: {
    variant_id: process.env.LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID,
    product_id: process.env.LEMON_SQUEEZY_PRO_MONTHLY_PRODUCT_ID,
  },
  PRO_YEARLY: {
    variant_id: process.env.LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID,
    product_id: process.env.LEMON_SQUEEZY_PRO_YEARLY_PRODUCT_ID,
  },
};

// Helper function to create a checkout URL
export async function createCheckoutUrl({
  variantId,
  userId,
  userEmail,
  userName,
  custom_price
}) {
  const response = await fetch(`${LEMON_CONFIG.API_URL}/checkouts`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${LEMON_CONFIG.API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          store_id: parseInt(LEMON_CONFIG.STORE_ID),
          variant_id: parseInt(variantId),
          custom_price: custom_price ? parseInt(custom_price) : undefined,
          checkout_data: {
            email: userEmail,
            name: userName,
            custom: {
              user_id: userId,
            },
          },
          success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={checkout_session_id}`,
          cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
        },
      },
    }),
  });

  const data = await response.json();
  return data?.data?.attributes?.url;
}

// Helper function to verify webhook signature
export function verifyWebhookSignature(
  payload,
  signature,
  secret = LEMON_CONFIG.WEBHOOK_SECRET
) {
  const hmac = require('crypto')
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return hmac === signature;
}

// Helper function to get subscription details
export async function getSubscription(subscriptionId) {
  const response = await fetch(
    `${LEMON_CONFIG.API_URL}/subscriptions/${subscriptionId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${LEMON_CONFIG.API_KEY}`,
      },
    }
  );
  
  return response.json();
}

// Helper function to get order details
export async function getOrder(orderId) {
  const response = await fetch(
    `${LEMON_CONFIG.API_URL}/orders/${orderId}`,
    {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${LEMON_CONFIG.API_KEY}`,
      },
    }
  );
  
  return response.json();
} 