import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyWebhookSignature, getSubscription, getOrder } from '@/lib/lemonsqueezy';

const prisma = new PrismaClient();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Signature',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const signature = request.headers.get('X-Signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Get the raw request body
    const rawBody = await request.text();
    
    // Verify the webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401, headers: corsHeaders }
      );
    }

    const payload = JSON.parse(rawBody);
    const { meta, data } = payload;
    
    switch (meta.event_name) {
      case 'subscription_created':
      case 'subscription_updated': {
        const subscription = await getSubscription(data.id);
        const order = await getOrder(subscription.data.attributes.order_id);
        const userId = order.data.attributes.custom_data.user_id;

        // Update or create subscription in database
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            status: subscription.data.attributes.status,
            planId: subscription.data.attributes.product_id,
            startDate: new Date(subscription.data.attributes.created_at),
            endDate: new Date(subscription.data.attributes.renews_at),
            lemonSubscriptionId: subscription.data.id,
          },
          update: {
            status: subscription.data.attributes.status,
            endDate: new Date(subscription.data.attributes.renews_at),
          },
        });
        break;
      }

      case 'subscription_cancelled': {
        const subscription = await getSubscription(data.id);
        const order = await getOrder(subscription.data.attributes.order_id);
        const userId = order.data.attributes.custom_data.user_id;

        // Update subscription status
        await prisma.subscription.update({
          where: { userId },
          data: {
            status: 'cancelled',
            endDate: new Date(subscription.data.attributes.ends_at),
          },
        });
        break;
      }

      case 'order_created': {
        const order = await getOrder(data.id);
        const userId = order.data.attributes.custom_data.user_id;

        // Create payment record
        await prisma.payment.create({
          data: {
            id: `lemon_${order.data.id}`,
            lemonOrderId: order.data.id,
            amount: order.data.attributes.total,
            currency: order.data.attributes.currency,
            status: order.data.attributes.status,
            userId,
          },
        });
        break;
      }
    }

    return NextResponse.json(
      { status: 'ok' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500, headers: corsHeaders }
    );
  } finally {
    await prisma.$disconnect();
  }
} 