import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/cashfree';
import prisma from '@/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    const signature = req.headers.get('x-webhook-signature');

    // Verify webhook signature
    const isValid = await verifyPaymentSignature(
      data.order_id,
      data.order_amount,
      data.reference_id,
      signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update payment status
    const payment = await prisma.payment.findUnique({
      where: { id: data.order_id }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: data.order_id },
      data: { status: data.order_status }
    });

    // If payment is successful, update subscription
    if (data.order_status === 'PAID') {
      const amount = Number(data.order_amount);
      const planType = amount === Number(process.env.PRO_YEARLY_PLAN_AMOUNT) ? 'yearly' : 'monthly';
      const durationDays = planType === 'yearly' ? 365 : 30;

      // Find or create plan
      let plan = await prisma.plan.findFirst({
        where: {
          price: amount,
          duration: durationDays
        }
      });

      if (!plan) {
        // Create plan if it doesn't exist
        plan = await prisma.plan.create({
          data: {
            name: `Pro ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
            description: `Pro plan with ${planType} billing`,
            price: amount,
            duration: durationDays,
            features: JSON.stringify([
              'Unlimited projects',
              'Advanced collaboration',
              'Priority support',
              'Custom templates'
            ])
          }
        });
      }

      // Update or create subscription
      await prisma.subscription.upsert({
        where: { userId: payment.userId },
        update: {
          status: 'active',
          planId: plan.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        },
        create: {
          userId: payment.userId,
          status: 'active',
          planId: plan.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
