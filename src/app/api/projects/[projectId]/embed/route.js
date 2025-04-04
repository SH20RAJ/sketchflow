import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";
import crypto from 'crypto';

// Initialize Prisma client
const prisma = new PrismaClient();

// Generate a secure embed token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// POST: Generate a new embed token
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.projectId;
    const { accessControl, allowedDomains, expirationDays } = await request.json();

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        userId: true,
        shared: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if user is owner or collaborator with appropriate permissions
    const isOwner = project.userId === session.user.id;

    if (!isOwner) {
      // Check if user is a collaborator with at least EDITOR role
      const collaborator = await prisma.projectCollaborator.findUnique({
        where: {
          projectId_userId: {
            projectId,
            userId: session.user.id,
          },
        },
        select: {
          role: true,
          inviteStatus: true,
        },
      });

      const isAuthorizedCollaborator =
        collaborator &&
        collaborator.inviteStatus === "ACCEPTED" &&
        ["EDITOR", "OWNER"].includes(collaborator.role);

      if (!isAuthorizedCollaborator) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Calculate expiration date if provided
    let expiresAt = null;
    if (expirationDays && expirationDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expirationDays);
    }

    // Generate a new token
    const token = generateToken();

    // Create or update embed configuration
    const embedConfig = await prisma.projectEmbed.upsert({
      where: {
        projectId,
      },
      update: {
        token,
        accessControl,
        allowedDomains: Array.isArray(allowedDomains) ? allowedDomains.join(',') : (allowedDomains || ''),
        expiresAt,
        updatedAt: new Date(),
      },
      create: {
        projectId,
        token,
        accessControl,
        allowedDomains: Array.isArray(allowedDomains) ? allowedDomains.join(',') : (allowedDomains || ''),
        expiresAt,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({
      token: embedConfig.token,
      accessControl: embedConfig.accessControl,
      allowedDomains: embedConfig.allowedDomains || '',
      expiresAt: embedConfig.expiresAt,
    });
  } catch (error) {
    console.error("Error generating embed token:", error);
    return NextResponse.json({ error: "Failed to generate embed token" }, { status: 500 });
  }
}

// GET: Retrieve embed configuration
export async function GET(request, { params }) {
  try {
    const session = await auth();
    const projectId = params.projectId;

    // Get the token from query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const origin = searchParams.get('origin');

    // Fetch the project and embed configuration
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        userId: true,
        shared: true,
        name: true,
        description: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const embedConfig = await prisma.projectEmbed.findUnique({
      where: {
        projectId,
      },
    });

    // If no embed configuration exists, check if project is public
    if (!embedConfig) {
      if (!project.shared) {
        return NextResponse.json({ error: "Embed not configured" }, { status: 403 });
      }

      // Public projects can be embedded without configuration
      return NextResponse.json({
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
        },
        embedConfig: {
          accessControl: "public",
          allowedDomains: "",
          expiresAt: null,
        },
      });
    }

    // Check if embed has expired
    if (embedConfig.expiresAt && new Date() > new Date(embedConfig.expiresAt)) {
      return NextResponse.json({ error: "Embed token has expired" }, { status: 403 });
    }

    // Validate based on access control type
    switch (embedConfig.accessControl) {
      case "public":
        // Public embeds are always accessible
        break;

      case "token":
        // Token-based embeds require a valid token
        if (!token || token !== embedConfig.token) {
          return NextResponse.json({ error: "Invalid embed token" }, { status: 403 });
        }
        break;

      case "domain":
        // Domain-restricted embeds require a valid origin
        if (!origin) {
          return NextResponse.json({ error: "Origin required for domain validation" }, { status: 403 });
        }

        try {
          const originDomain = new URL(origin).hostname;
          const allowedDomainsList = embedConfig.allowedDomains.split(',').map(d => d.trim()).filter(Boolean);

          const isAllowedDomain = allowedDomainsList.some(domain =>
            originDomain === domain || originDomain.endsWith(`.${domain}`)
          );

          if (!isAllowedDomain) {
            return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
          }
        } catch (error) {
          return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid access control type" }, { status: 400 });
    }

    // If all checks pass, return the embed configuration
    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description,
      },
      embedConfig: {
        accessControl: embedConfig.accessControl,
        allowedDomains: embedConfig.allowedDomains || '',
        expiresAt: embedConfig.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error validating embed:", error);
    return NextResponse.json({ error: "Failed to validate embed" }, { status: 500 });
  }
}
