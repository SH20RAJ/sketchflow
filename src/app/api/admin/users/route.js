import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get users with their subscription status
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });

    // Transform the data to include subscription status
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      isPro: user.subscription?.status === 'ACTIVE',
      subscriptionStatus: user.subscription?.status || 'FREE',
      plan: user.subscription?.plan?.name || 'Free'
    }));

    return NextResponse.json({
      users: transformedUsers,
      count: transformedUsers.length
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
} 