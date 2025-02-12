import axios from 'axios';

const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL;
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION;

export async function createOrder({
  orderId,
  amount,
  currency = 'INR',
  customerDetails,
  orderMeta
}) {
  try {
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: customerDetails.customer_id,
          customer_email: customerDetails.customer_email,
          customer_name: customerDetails.customer_name,
          customer_phone: customerDetails.customer_phone
        },
        order_meta: orderMeta,
        order_tags: {
          type: 'subscription'
        }
      },
      {
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': CASHFREE_API_VERSION,
          'Content-Type': 'application/json'
        },
      }
    );

    if (!response.data.order_token) {
      throw new Error('Invalid response from Cashfree');
    }

    return response.data;
  } catch (error) {
    console.error('Cashfree order creation failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Payment initialization failed');
  }
}

export async function verifyPaymentSignature(orderId, orderAmount, referenceId, signature) {
  try {
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders/verify`,
      {
        order_id: orderId,
        order_amount: orderAmount,
        reference_id: referenceId,
        signature: signature,
      },
      {
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': CASHFREE_API_VERSION,
          'Content-Type': 'application/json'
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Payment verification failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
}

export function getPaymentConfig() {
  return {
    appId: CASHFREE_APP_ID,
    apiVersion: CASHFREE_API_VERSION,
    isSandbox: CASHFREE_BASE_URL.includes('sandbox'),
  };
} 