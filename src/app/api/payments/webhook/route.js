import { NextResponse } from 'next/server';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      payload: {
        payment: { entity },
      },
    } = body;

    const { 
      order_id: orderId,
      id: razorpayId,
      status,
    } = entity;

    // Verify payment signature
    const isValidSignature = verifyPaymentSignature(
      orderId,
      razorpayId,
      req.headers.get('x-razorpay-signature')
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Update payment status in database
    const payment = await db.payment.update({
      where: { orderId },
      data: {
        status,
        razorpayId,
      },
    });

    if (status === 'captured') {
      // Get the plan details
      const subscription = await db.subscription.findFirst({
        where: { userId: payment.userId },
        include: { plan: true },
      });

      if (subscription) {
        // Update subscription status
        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'active',
            startDate: new Date(),
            endDate: new Date(Date.now() + subscription.plan.duration * 24 * 60 * 60 * 1000),
            razorpayId,
          },
        });
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
