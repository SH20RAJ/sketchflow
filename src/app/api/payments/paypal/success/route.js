import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subscriptionId, planType } = await req.json();

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        id: `pp_${Date.now()}`,
        amount: planType === "yearly" 
          ? parseInt(process.env.PRO_YEARLY_PLAN_AMOUNT) 
          : parseInt(process.env.PRO_MONTHLY_PLAN_AMOUNT),
        currency: "USD",
        status: "completed",
        paypalSubscriptionId: subscriptionId,
        userId: session.user.id,
        gatewayData: {
          planType,
          subscriptionId
        }
      }
    });

    const planDuration = planType === "yearly" ? 365 : 30;

    // Find or create plan
    let plan = await prisma.plan.findFirst({
      where: {
        name: planType === "yearly" ? "Pro Yearly" : "Pro Monthly"
      }
    });

    if (!plan) {
      // Create plan if it doesn't exist
      plan = await prisma.plan.create({
        data: {
          name: planType === "yearly" ? "Pro Yearly" : "Pro Monthly",
          description: planType === "yearly" ? "Yearly Pro Plan" : "Monthly Pro Plan",
          price: planType === "yearly" 
            ? parseInt(process.env.PRO_YEARLY_PLAN_AMOUNT) 
            : parseInt(process.env.PRO_MONTHLY_PLAN_AMOUNT),
          duration: planDuration,
          features: JSON.stringify([
            "Unlimited Projects",
            "Premium Templates",
            "Advanced Features",
            "Priority Support",
            "100GB Storage",
            "Team Collaboration",
            "API Access",
            "Custom Branding"
          ]),
          billingCycle: planType === "yearly" ? "YEARLY" : "MONTHLY"
        }
      });
    }

    // Create or update subscription
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        planId: plan.id,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000),
        paypalSubscriptionId: subscriptionId
      },
      update: {
        planId: plan.id,
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000),
        paypalSubscriptionId: subscriptionId
      }
    });

    return NextResponse.json({ 
      success: true,
      payment: {
        id: payment.id,
        status: payment.status
      }
    });

  } catch (error) {
    console.error("PayPal success webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
} 