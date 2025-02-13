import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPaymentSignature } from '@/lib/cashfree';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get payment details from database
    const payment = await prisma.payment.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // If payment is already marked as successful, return success
    if (payment.status === 'SUCCESS' || payment.status === 'PAID') {
      return NextResponse.json({ status: 'PAID', message: 'Payment already verified' });
    }

    try {
      // Verify payment status with Cashfree
      const verificationResponse = await fetch(
        `${process.env.CASHFREE_BASE_URL}/orders/${payment.cfOrderId}`,
        {
          headers: {
            'x-client-id': process.env.CASHFREE_APP_ID,
            'x-client-secret': process.env.CASHFREE_SECRET_KEY,
            'x-api-version': '2022-09-01'
          }
        }
      );

      const orderData = await verificationResponse.json();

      if (orderData.order_status === 'PAID') {
        // Update payment status
        await prisma.payment.update({
          where: { id: orderId },
          data: { status: 'PAID' }
        });

        // Get the Pro plan from database
        const proPlan = await prisma.plan.findFirst({
          where: { name: 'Pro' }
        });

        if (!proPlan) {
          console.error('Pro plan not found in database');
          return NextResponse.json({ error: 'Plan not found' }, { status: 500 });
        }

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
            planId: proPlan.id,
            startDate: new Date(),
            endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000)
          }
        });

        return NextResponse.json({ status: 'PAID', message: 'Payment successful' });
      }

      return NextResponse.json({ 
        status: orderData.order_status,
        message: 'Payment pending or failed' 
      });

    } catch (error) {
      console.error('Cashfree verification error:', error);
      return NextResponse.json({ 
        error: 'Failed to verify payment with Cashfree'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ 
      error: 'Payment verification failed'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 