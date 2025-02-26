import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

// Get settings
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all settings
    const settings = await prisma.setting.findMany();

    // Transform into sections
    const transformedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.section]) {
        acc[setting.section] = {};
      }
      acc[setting.section][setting.key] = setting.value;
      return acc;
    }, {});

    return NextResponse.json(transformedSettings);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// Update settings
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== 'sh20raj@gmail.com') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { section, settings } = await request.json();

    // Update settings in transaction
    await prisma.$transaction(
      Object.entries(settings).map(([key, value]) =>
        prisma.setting.upsert({
          where: {
            section_key: {
              section,
              key
            }
          },
          update: { value: JSON.stringify(value) },
          create: {
            section,
            key,
            value: JSON.stringify(value)
          }
        })
      )
    );

    // Log the change
    await prisma.adminLog.create({
      data: {
        action: 'UPDATE_SETTINGS',
        section,
        details: JSON.stringify(settings),
        userId: session.user.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
} 