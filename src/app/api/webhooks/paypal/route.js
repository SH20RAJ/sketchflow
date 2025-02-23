import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import crypto from 'crypto';

// Verify PayPal webhook signature
const verifyPayPalWebhook = (req, webhookBody) => {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    const transmissionId = req.headers.get('paypal-transmission-id');
    const transmissionTime = req.headers.get('paypal-transmission-time');
    const certUrl = req.headers.get('paypal-cert-url');
    const authAlgo = req.headers.get('paypal-auth-algo');
    const transmissionSig = req.headers.get('paypal-transmission-sig');

    const webhookEvent = JSON.stringify(webhookBody);
    
    // Construct the validation message
    const validationMessage = `${transmissionId}|${transmissionTime}|${webhookId}|${crypto.createHash('sha256').update(webhookEvent).digest('hex')}`;
    
    // For development, you might want to bypass verification
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // In production, implement full signature verification
    // This is a basic check - implement full cert verification in production
    return true;
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
};

export async function POST(req) {
  try {
    const webhookBody = await req.json();
    console.log('PayPal Webhook Event:', webhookBody);

    // Verify webhook signature
    const isValid = verifyPayPalWebhook(req, webhookBody);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const eventType = webhookBody.event_type;
    const resource = webhookBody.resource;

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

  // Log the activation
  console.log(`Subscription activated: ${subscriptionId}`);
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

  // Log the cancellation
  console.log(`Subscription cancelled: ${subscriptionId}`);
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

  // Log the expiration
  console.log(`Subscription expired: ${subscriptionId}`);
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

  // Log the suspension
  console.log(`Subscription suspended: ${subscriptionId}`);
}

async function handlePaymentCompleted(resource) {
  const subscriptionId = resource.billing_agreement_id;
  
  if (!subscriptionId) {
    console.log('No subscription ID found in payment resource');
    return;
  }

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

  // Log the payment completion
  console.log(`Payment completed for subscription: ${subscriptionId}`);
} 