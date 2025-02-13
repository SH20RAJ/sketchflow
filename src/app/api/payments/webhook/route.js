import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Configure CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-webhook-signature',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function verifyWebhookSignature(payload, signature) {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY)
      .update(JSON.stringify(payload))
      .digest('base64');
    
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
    if (!signature) {
      console.error('No signature found in webhook request');
      return NextResponse.json({ error: 'No signature provided' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid signature in webhook request');
      return NextResponse.json({ error: 'Invalid signature' }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    const { order } = payload;
    if (!order?.order_id) {
      console.error('Invalid payload structure:', payload);
      return NextResponse.json({ error: 'Invalid payload' }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    console.log('Webhook received:', {
      orderId: order.order_id,
      status: order.order_status,
      payment: order.payment
    });

    // Find payment in database
    const payment = await prisma.payment.findUnique({
      where: { id: order.order_id },
      include: { user: true }
    });

    if (!payment) {
      console.error('Payment not found:', order.order_id);
      return NextResponse.json({ error: 'Payment not found' }, { 
        status: 404,
        headers: corsHeaders
      });
    }

    // Update payment status
    if (order.order_status === 'PAID') {
      await prisma.payment.update({
        where: { id: order.order_id },
        data: { status: 'PAID' }
      });

      // Create or update subscription
      const planDuration = payment.amount === Number(process.env.PRO_YEARLY_PLAN_AMOUNT) ? 365 : 30;
      
      await prisma.subscription.upsert({
        where: { userId: payment.userId },
        update: {
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000)
        },
        create: {
          userId: payment.userId,
          status: 'active',
          planId: 'pro',
          startDate: new Date(),
          endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000)
        }
      });

      console.log('Payment marked as successful:', order.order_id);
    } else if (['EXPIRED', 'FAILED', 'CANCELLED'].includes(order.order_status)) {
      await prisma.payment.update({
        where: { id: order.order_id },
        data: { status: order.order_status }
      });
      console.log('Payment marked as failed:', order.order_id);
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
