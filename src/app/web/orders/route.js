import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all payments/orders for the user
    const orders = await prisma.payment.findMany({
      where: { userId: session.user.id },
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

    // Transform the orders data to include formatted dates and amounts
    const formattedOrders = orders.map(order => ({
      id: order.id,
      cfOrderId: order.cfOrderId,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      customer: {
        name: order.user.name,
        email: order.user.email
      }
    }));

    return NextResponse.json({
      orders: formattedOrders,
      count: formattedOrders.length
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 