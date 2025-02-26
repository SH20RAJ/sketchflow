import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Configure CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature, x-webhook-timestamp',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function verifyWebhookSignature(rawBody, signature, timestamp) {
  try {
    // According to Cashfree's documentation, we need to:
    // 1. Use timestamp first, then body
    const signatureData = timestamp + rawBody;
    
    // Get the webhook secret key
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY;
    
    // Compute HMAC with SHA256
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signatureData)
      .digest('base64');
    
    console.log('Signature debug:', {
      timestamp,
      signatureData: signatureData.slice(0, 50) + '...',
      webhookSecretLength: webhookSecret.length,
      computed: computedSignature,
      received: signature
    });
    
    return computedSignature === signature;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Webhook called - headers:', headers);
    
    // Get the raw request body as text first
    const rawBody = await request.text();
    console.log('Raw webhook body:', rawBody);

    // Parse the payload after getting raw body
    const payload = JSON.parse(rawBody);
    console.log('Parsed webhook payload:', payload);
    
    const signature = headers['x-webhook-signature'];
    const timestamp = headers['x-webhook-timestamp'];

    if (!signature || !timestamp) {
      console.error('Missing signature or timestamp in webhook request');
      return NextResponse.json({ error: 'Missing signature or timestamp' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify webhook signature using raw body
    const isValid = verifyWebhookSignature(rawBody, signature, timestamp);
    console.log('Signature verification result:', isValid);

    if (!isValid) {
      console.error('Invalid signature in webhook request');
      return NextResponse.json({ error: 'Invalid signature' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Handle different webhook types
    if (payload.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { data } = payload;
      const { order, payment } = data;

      if (!order?.order_id) {
        console.error('Invalid payload structure:', payload);
        return NextResponse.json({ error: 'Invalid payload' }, { 
          status: 400,
          headers: corsHeaders
        });
      }

      console.log('Payment success webhook received:', {
        orderId: order.order_id,
        amount: order.order_amount,
        status: payment.payment_status
      });

      // Find payment in database
      const dbPayment = await prisma.payment.findUnique({
        where: { id: order.order_id },
        include: { user: true }
      });

      if (!dbPayment) {
        console.error('Payment not found:', order.order_id);
        return NextResponse.json({ error: 'Payment not found' }, { 
          status: 404,
          headers: corsHeaders
        });
      }

      // Update payment status if payment is successful
      if (payment.payment_status === 'SUCCESS') {
        await prisma.payment.update({
          where: { id: order.order_id },
          data: { 
            status: 'PAID',
            cfOrderId: data.payment_gateway_details.gateway_order_id
          }
        });

        // Get the Pro plan from database
        const proPlan = await prisma.plan.findFirst({
          where: { name: 'Pro' }
        });

        if (!proPlan) {
          console.error('Pro plan not found in database');
          return NextResponse.json({ error: 'Plan not found' }, { 
            status: 500,
            headers: corsHeaders
          });
        }

        // Create or update subscription
        const planDuration = dbPayment.amount === Number(process.env.PRO_YEARLY_PLAN_AMOUNT) ? 365 : 30;
        
        await prisma.subscription.upsert({
          where: { userId: dbPayment.userId },
          update: {
            status: 'ACTIVE',
            startDate: new Date(),
            endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000)
          },
          create: {
            userId: dbPayment.userId,
            status: 'ACTIVE',
            planId: proPlan.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000)
          }
        });

        console.log('Payment marked as successful:', order.order_id);
      }
    }

    return NextResponse.json({ status: 'ok' }, { 
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { 
      status: 500,
      headers: corsHeaders
    });
  } finally {
    await prisma.$disconnect();
  }
}
