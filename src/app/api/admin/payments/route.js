import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get payments with user details
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Transform the data
    const transformedPayments = payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
      user: {
        name: payment.user.name,
        email: payment.user.email
      },
      paymentMethod: payment.paypalSubscriptionId ? 'PayPal' : 'Other',
      subscriptionId: payment.paypalSubscriptionId || null
    }));

    return NextResponse.json({
      payments: transformedPayments,
      count: transformedPayments.length
    });
  } catch (error) {
    console.error('Admin payments fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
} 