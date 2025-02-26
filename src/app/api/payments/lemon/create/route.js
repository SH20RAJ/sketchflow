import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createCheckoutUrl } from '@/lib/lemonsqueezy';
import { PRICING_PLANS } from '@/lib/pricingconfig';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType } = await request.json();
    const plan = planType === 'yearly' ? PRICING_PLANS.PRO_YEARLY : PRICING_PLANS.PRO_MONTHLY;

    if (!plan.lemon_variant_id) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
    }

    const checkoutUrl = await createCheckoutUrl({
      variantId: plan.lemon_variant_id,
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || session.user.email,
    });

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Checkout creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout creation failed' },
      { status: 500 }
    );
  }
} 