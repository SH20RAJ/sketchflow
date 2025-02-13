import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { createOrder } from '@/lib/cashfree';
import { nanoid } from 'nanoid';

// Initialize Prisma Client directly
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    console.log('Starting payment creation process...');
    
    const session = await auth();
    console.log('Auth session:', { userId: session?.user?.id });
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await request.json();
    console.log('Plan type:', planType);
    
    // Get plan amount based on type
    const amount = planType === 'yearly' 
      ? process.env.PRO_YEARLY_PLAN_AMOUNT 
      : process.env.PRO_MONTHLY_PLAN_AMOUNT;
    console.log('Amount:', amount);

    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { subscription: true }
      });
      console.log('Found user:', { id: user?.id, email: user?.email });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Create unique order ID
      const orderId = `order_${nanoid(16)}`;
      console.log('Generated order ID:', orderId);

      // Create order with Cashfree
      console.log('Creating Cashfree order...');
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
      console.log('Cashfree order created:', { 
        orderId: order.order_id,
        status: order.order_status 
      });

      // Store payment record in database
      console.log('Creating payment record...');
      try {
        const payment = await prisma.payment.create({
          data: {
            id: orderId,
            cfOrderId: order.cf_order_id.toString(),
            amount: Number(amount),
            currency: 'INR',
            status: 'PENDING',
            userId: user.id
          }
        });
        console.log('Payment record created:', { id: payment.id });
      } catch (dbError) {
        console.error('Database error creating payment:', {
          error: dbError.message,
          code: dbError.code,
          meta: dbError.meta
        });
        throw dbError;
      }

      // Return the required fields for Cashfree SDK
      return NextResponse.json({
        order_token: order.order_token,
        order_id: orderId,
        order_status: order.order_status,
        order_currency: order.order_currency,
        order_amount: order.order_amount
      });
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw new Error(`Database operation failed: ${dbError.message}`);
    }
  } catch (error) {
    console.error('Payment creation failed:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
} 