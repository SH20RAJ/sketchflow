import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch various statistics
    const [
      totalUsers,
      totalProjects,
      totalSharedProjects,
      totalPayments,
      totalSubscriptions,
      proUsers,
      projectsLast30Days,
      usersLast30Days,
      paymentsLast30Days
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total projects
      prisma.project.count(),
      
      // Total shared projects
      prisma.project.count({
        where: { shared: true }
      }),
      
      // Total payments
      prisma.payment.count(),
      
      // Active subscriptions
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      
      // Pro users
      prisma.user.count({
        where: {
          subscription: {
            status: 'ACTIVE'
          }
        }
      }),
      
      // Projects created in last 30 days
      prisma.project.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Users joined in last 30 days
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      
      // Payments in last 30 days
      prisma.payment.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Calculate percentages and growth
    const proUserPercentage = (proUsers / totalUsers * 100).toFixed(1);
    const sharedProjectPercentage = (totalSharedProjects / totalProjects * 100).toFixed(1);

    return NextResponse.json({
      users: {
        total: totalUsers,
        pro: proUsers,
        proPercentage: proUserPercentage,
        newLast30Days: usersLast30Days
      },
      projects: {
        total: totalProjects,
        shared: totalSharedProjects,
        sharedPercentage: sharedProjectPercentage,
        newLast30Days: projectsLast30Days
      },
      payments: {
        total: totalPayments,
        newLast30Days: paymentsLast30Days
      },
      subscriptions: {
        active: totalSubscriptions
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
} 