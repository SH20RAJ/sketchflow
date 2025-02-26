import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    // Get current user and subscription status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isCurrentlyPro = user.subscription?.status === 'ACTIVE';

    if (isCurrentlyPro) {
      // Deactivate subscription
      await prisma.subscription.updateMany({
        where: { userId },
        data: { status: 'INACTIVE' }
      });
    } else {
      // Find or create Pro plan
      let proPlan = await prisma.plan.findFirst({
        where: { name: 'Pro' }
      });

      if (!proPlan) {
        proPlan = await prisma.plan.create({
          data: {
            name: 'Pro',
            description: 'Pro Plan',
            price: 1999,
            duration: 30,
            features: JSON.stringify([
              "Unlimited Projects",
              "Premium Templates",
              "Advanced Features",
              "Priority Support"
            ]),
            billingCycle: "MONTHLY"
          }
        });
      }

      // Create or update subscription
      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          planId: proPlan.id,
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        update: {
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });

      // Create a payment record for admin-granted pro status
      await prisma.payment.create({
        data: {
          userId,
          amount: 1999,
          currency: 'USD',
          status: 'COMPLETED',
          provider: 'ADMIN',
          description: 'Pro status granted by admin'
        }
      });
    }

    return NextResponse.json({
      success: true,
      isPro: !isCurrentlyPro
    });
  } catch (error) {
    console.error('Toggle pro status error:', error);
    return NextResponse.json(
      { error: "Failed to toggle pro status" },
      { status: 500 }
    );
  }
} 