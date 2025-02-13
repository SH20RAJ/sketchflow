import axios from 'axios';

const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/pg';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2022-09-01';

// Validate environment variables
function validateConfig() {
  if (!CASHFREE_APP_ID) {
    throw new Error('CASHFREE_APP_ID is not configured');
  }
  if (!CASHFREE_SECRET_KEY) {
    throw new Error('CASHFREE_SECRET_KEY is not configured');
  }
}

export async function createOrder({
  orderId,
  amount,
  currency = 'INR',
  customerDetails,
  orderMeta
}) {
  try {
    validateConfig();

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount');
    }

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    if (!customerDetails?.customer_id || !customerDetails?.customer_email) {
      throw new Error('Customer details are incomplete');
    }

    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: currency,
        customer_details: {
          customer_id: customerDetails.customer_id,
          customer_email: customerDetails.customer_email,
          customer_name: customerDetails.customer_name || customerDetails.customer_email,
          customer_phone: customerDetails.customer_phone || '9999999999'
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
      console.error('Invalid Cashfree response:', response.data);
      throw new Error('Invalid response from Cashfree');
    }

    return response.data;
  } catch (error) {
    console.error('Cashfree order creation failed:', {
      message: error.message,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: {
          ...error.config?.headers,
          'x-client-secret': '***' // Hide sensitive data
        }
      }
    });
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || 'Payment initialization failed');
  }
}

export async function verifyPaymentSignature(orderId, orderAmount, referenceId, signature) {
  try {
    validateConfig();

    if (!orderId || !orderAmount || !referenceId || !signature) {
      throw new Error('Missing required parameters for payment verification');
    }

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
    console.error('Payment verification failed:', {
      message: error.message,
      response: error.response?.data
    });
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
}

export function getPaymentConfig() {
  validateConfig();
  
  return {
    appId: CASHFREE_APP_ID,
    apiVersion: CASHFREE_API_VERSION,
    isSandbox: CASHFREE_BASE_URL.includes('sandbox'),
  };
} 