import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// Update user
export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;
    const data = await request.json();

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
      }
    });

    // Update subscription status if changed
    if (data.isPro) {
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
    } else {
      // Deactivate subscription if exists
      await prisma.subscription.updateMany({
        where: { userId },
        data: { status: 'INACTIVE' }
      });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = params;

    // Delete user's data
    await prisma.$transaction([
      // Delete user's subscriptions
      prisma.subscription.deleteMany({
        where: { userId }
      }),
      // Delete user's payments
      prisma.payment.deleteMany({
        where: { userId }
      }),
      // Delete user's projects
      prisma.project.deleteMany({
        where: { userId }
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id: userId }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
} 