import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/prisma';
import { createOrder } from '@/lib/cashfree';
import { nanoid } from 'nanoid';

export async function POST(req) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await req.json();
    
    // Get plan amount based on type
    const amount = planType === 'yearly' 
      ? process.env.PRO_YEARLY_PLAN_AMOUNT 
      : process.env.PRO_MONTHLY_PLAN_AMOUNT;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create unique order ID
    const orderId = `order_${nanoid(16)}`;

    // Create order with Cashfree
    const order = await createOrder({
      orderId,
      amount: Number(amount),
      customerDetails: {
        customer_id: user.id,
        customer_email: user.email,
        customer_name: user.name || user.email,
        customer_phone: '9999999999'
      },
      orderMeta: {
        return_url: `${process.env.NEXTAUTH_URL}/payment/status?order_id={order_id}`,
        notify_url: `${process.env.NEXTAUTH_URL}/api/payments/webhook`
      }
    });

    // Store payment record in database
    await prisma.payment.create({
      data: {
        id: orderId,
        razorpayId: order.cf_order_id,
        amount: Number(amount),
        status: 'PENDING',
        userId: user.id
      }
    });

    // Return the required fields for Cashfree SDK
    return NextResponse.json({
      order_token: order.order_token,
      order_id: orderId,
      order_status: order.order_status,
      order_currency: order.order_currency,
      order_amount: order.order_amount
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
} 