import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function POST(req) {
  try {
    const event = await req.json();
    console.log('PayPal Webhook Event:', event);

    // Verify webhook signature (you should implement this)
    // const isValid = verifyPayPalWebhook(req);
    // if (!isValid) return new Response('Invalid signature', { status: 400 });

    const eventType = event.event_type;
    const resource = event.resource;

    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(resource);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(resource);
        break;
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(resource);
        break;
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await handleSubscriptionSuspended(resource);
        break;
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(resource);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleSubscriptionActivated(resource) {
  const subscriptionId = resource.id;
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: {
      status: 'active',
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionCancelled(resource) {
  const subscriptionId = resource.id;
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: {
      status: 'cancelled',
      endDate: new Date(),
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionExpired(resource) {
  const subscriptionId = resource.id;
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: {
      status: 'expired',
      endDate: new Date(),
      updatedAt: new Date()
    }
  });
}

async function handleSubscriptionSuspended(resource) {
  const subscriptionId = resource.id;
  
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: {
      status: 'inactive',
      updatedAt: new Date()
    }
  });
}

async function handlePaymentCompleted(resource) {
  const subscriptionId = resource.billing_agreement_id;
  
  if (!subscriptionId) return;

  // Update payment status
  await prisma.payment.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: {
      status: 'completed',
      updatedAt: new Date()
    }
  });

  // Verify subscription is active
  await prisma.subscription.updateMany({
    where: { paypalSubscriptionId: subscriptionId },
    data: {
      status: 'active',
      updatedAt: new Date()
    }
  });
} 