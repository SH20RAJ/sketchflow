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

function verifyWebhookSignature(payload, signature, timestamp) {
  try {
    // Get the raw request body as a string
    const data = JSON.stringify(payload);
    
    // Concatenate timestamp and data
    const signatureData = timestamp + data;
    
    // Create HMAC using your secret key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(signatureData)
      .digest('base64');
    
    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', signature);
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

export async function POST(request) {
  try {
    console.log('Webhook called - headers:', Object.fromEntries(request.headers.entries()));
    
    const payload = await request.json();
    console.log('Webhook payload:', payload);
    
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');

    if (!signature || !timestamp) {
      console.error('Missing signature or timestamp in webhook request');
      return NextResponse.json({ error: 'Missing signature or timestamp' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature, timestamp)) {
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

        // Create or update subscription
        const planDuration = dbPayment.amount === Number(process.env.PRO_YEARLY_PLAN_AMOUNT) ? 365 : 30;
        
        await prisma.subscription.upsert({
          where: { userId: dbPayment.userId },
          update: {
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000)
          },
          create: {
            userId: dbPayment.userId,
            status: 'active',
            planId: 'pro',
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
