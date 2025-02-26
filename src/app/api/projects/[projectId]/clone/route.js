import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
    let session;
    try {
        session = await auth();
        console.log('Clone request - Session:', { 
            userId: session?.user?.id,
            email: session?.user?.email 
        });
        
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { projectId } = params;
        console.log('Clone request - Project ID:', projectId);

        // Get the original project with all its content
        const originalProject = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                diagrams: true,
                markdowns: true,
            },
        });

        console.log('Clone request - Original project found:', !!originalProject);

        if (!originalProject) {
            console.log('Clone request - Project not found');
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        if (!originalProject.shared && originalProject.userId !== session.user.id) {
            console.log('Clone request - Unauthorized access attempt');
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get the main diagram and markdown
        const mainDiagram = originalProject.diagrams[0];
        const mainMarkdown = originalProject.markdowns[0];

        // Create a new project as a clone with all its related data
        const clonedProject = await prisma.project.create({
            data: {
                name: `${originalProject.name} (Clone)`,
                description: originalProject.description || '',
                userId: session.user.id,
                shared: false,
                diagrams: {
                    create: {
                        name: mainDiagram?.name || "Main",
                        content: mainDiagram?.content || { elements: [], appState: {} },
                    },
                },
                markdowns: {
                    create: {
                        name: mainMarkdown?.name || "Notes",
                        content: mainMarkdown?.content || '',
                    },
                },
            },
            include: {
                diagrams: true,
                markdowns: true,
            },
        });

        console.log('Clone request - Project cloned successfully:', clonedProject.id);

        return NextResponse.json({
            success: true,
            id: clonedProject.id,
            message: 'Project cloned successfully'
        });
    } catch (error) {
        console.error("Clone request error:", {
            error: error.message,
            stack: error.stack,
            projectId: params.projectId,
            userId: session?.user?.id
        });
        return NextResponse.json(
            { error: "Failed to clone project", details: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 