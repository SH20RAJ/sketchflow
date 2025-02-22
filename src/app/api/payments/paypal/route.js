import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planType } = await req.json();
    
    // Get plan details based on type
    const planAmount = planType === "yearly" 
      ? process.env.PRO_YEARLY_PLAN_AMOUNT 
      : process.env.PRO_MONTHLY_PLAN_AMOUNT;

    const planId = planType === "yearly"
      ? process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID
      : process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID;

    if (!planId) {
      return NextResponse.json(
        { error: "PayPal plan ID not configured" },
        { status: 500 }
      );
    }

    // Create a payment record
    const payment = await prisma.payment.create({
      data: {
        id: `pp_${Date.now()}`,
        amount: parseInt(planAmount),
        currency: "USD",
        status: "pending",
        userId: session.user.id,
        gatewayData: {
          planId,
          planType
        }
      }
    });

    return NextResponse.json({
      success: true,
      planId,
      paymentId: payment.id
    });

  } catch (error) {
    console.error("PayPal payment error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
} 