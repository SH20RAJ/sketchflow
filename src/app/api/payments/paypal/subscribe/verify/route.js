import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { PAYPAL_CONFIG } from '@/lib/pricingconfig';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId, planType } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    // Get access token
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET_KEY}`
    ).toString('base64');

    const tokenRes = await fetch(`${PAYPAL_CONFIG.PRODUCTION.API_URL}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = await tokenRes.json();

    // Verify subscription with PayPal
    const subscriptionRes = await fetch(
      `${PAYPAL_CONFIG.PRODUCTION.API_URL}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const subscriptionDetails = await subscriptionRes.json();

    if (subscriptionDetails.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Subscription is not active' },
        { status: 400 }
      );
    }

    // Get the Pro plan from database
    const proPlan = await prisma.plan.findFirst({
      where: { name: 'Pro' }
    });

    if (!proPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 500 });
    }

    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date();
    if (planType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create or update subscription
    const subscription = await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        status: 'ACTIVE',
        planId: proPlan.id,
        startDate,
        endDate,
        paypalSubscriptionId: subscriptionId,
      },
      update: {
        status: 'ACTIVE',
        startDate,
        endDate,
        paypalSubscriptionId: subscriptionId,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        id: `pp_${subscriptionId}_${Date.now()}`,
        paypalSubscriptionId: subscriptionId,
        amount: planType === 'yearly' ? 10 : 2,
        currency: 'USD',
        status: 'COMPLETED',
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: 'success',
      subscription,
    });
  } catch (error) {
    console.error('Subscription verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify subscription' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 