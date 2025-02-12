import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/razorpay';
import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { planId } = body;

    // Get plan details from database
    const plan = await db.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create Razorpay order
    const { success, data: order, error } = await createOrder(plan.price);
    
    if (!success) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Create payment record in database
    const payment = await db.payment.create({
      data: {
        amount: plan.price,
        currency: 'INR',
        status: 'pending',
        orderId: order.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
