# Building SketchFlow: A Technical Deep Dive into Our Modern Documentation Platform

![SketchFlow Technical Architecture](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.2&auto=format&fit=crop&w=1350&q=80)

Hey dev.to community! 👋

I'm excited to share the technical journey behind building **SketchFlow**, our collaborative visual documentation platform for development teams. In this article, I'll walk through the architecture decisions, technical challenges, and lessons learned while creating a real-time collaborative tool that combines diagramming with markdown documentation.

## The Technical Challenge

When we started building SketchFlow, we identified several key technical requirements:

1. **Real-time collaboration** with minimal latency
2. **Split-screen interface** combining diagrams and markdown
3. **Role-based access control** for team collaboration
4. **Offline capabilities** with import/export functionality
5. **Responsive design** that works across devices
6. **Scalable architecture** to support growing teams

Let's dive into how we addressed each of these challenges.

## Architecture Overview

SketchFlow is built on a modern stack:

```
Frontend:
- Next.js 14 (React framework)
- TailwindCSS (styling)
- ShadcnUI (component library)
- Excalidraw (diagram editor)
- CodeMirror (markdown editor)

Backend:
- Next.js API routes
- Prisma ORM
- PostgreSQL database
- NextAuth.js (authentication)
- Resend (email notifications)

Infrastructure:
- Vercel (hosting)
- Vercel Postgres (database)
- GitHub Actions (CI/CD)
```

## Real-Time Collaboration Implementation

One of our biggest challenges was implementing real-time collaboration. We explored several approaches:

1. **WebSockets**: Initially, we considered Socket.io for real-time updates
2. **CRDTs (Conflict-free Replicated Data Types)**: For handling concurrent edits
3. **Operational Transformation**: Another approach for managing concurrent edits

After evaluating these options, we implemented a hybrid approach:

```javascript
// Simplified collaboration setup
const setupCollaboration = (projectId, userId, role) => {
  // Connect to WebSocket
  const socket = new WebSocket(`wss://api.sketchflow.io/projects/${projectId}/collab`);
  
  // Handle incoming changes
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Apply changes to local state
    if (data.type === 'diagram_update') {
      updateDiagramState(data.content);
    } else if (data.type === 'markdown_update') {
      updateMarkdownState(data.content);
    }
    
    // Log activity for the activity feed
    logCollaborationActivity(data);
  };
  
  // Send local changes
  const sendChanges = debounce((changes) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(changes));
    }
  }, 100);
  
  return { sendChanges };
};
```

For the diagram editor, we integrated Excalidraw and extended it with custom collaboration features:

```javascript
// Excalidraw integration with collaboration
const DiagramEditor = ({ projectId, initialData, isCollaborator, role }) => {
  const [excalidrawData, setExcalidrawData] = useState(initialData);
  const { sendChanges } = useCollaboration(projectId);
  
  const handleChange = (elements, appState) => {
    setExcalidrawData({ elements, appState });
    
    // Only send changes if user has edit permissions
    if (isCollaborator && (role === 'EDITOR' || role === 'OWNER')) {
      sendChanges({
        type: 'diagram_update',
        content: { elements, appState },
        timestamp: new Date().toISOString()
      });
    }
  };
  
  return (
    <Excalidraw
      initialData={excalidrawData}
      onChange={handleChange}
      viewModeEnabled={!(isOwner || (isCollaborator && role === 'EDITOR'))}
    />
  );
};
```

## Database Schema Design

Our database schema was designed to support collaboration and project organization:

```prisma
model User {
  id                      String                  @id @default(cuid())
  name                    String?
  email                   String?                 @unique
  projects                Project[]
  projectTags             ProjectTag[]
  collaborations          ProjectCollaborator[]
  invitedCollaborations   ProjectCollaborator[]  @relation("InvitedBy")
  collaborationActivities CollaborationActivity[]
  projectComments         ProjectComment[]
}

model Project {
  id               String                  @id @default(cuid())
  name             String
  description      String?
  emoji            String?
  color            String?
  userId           String
  user             User                    @relation(fields: [userId], references: [id], onDelete: Cascade)
  diagrams         Diagram[]
  markdowns        Markdown[]
  shared           Boolean                 @default(false)
  projectTags      ProjectTag[]
  collaborators    ProjectCollaborator[]
  activities       CollaborationActivity[]
  comments         ProjectComment[]
  originalProjectId String?
  originalProject  Project?                @relation("ProjectClones", fields: [originalProjectId], references: [id], onDelete: SetNull)
  clones           Project[]               @relation("ProjectClones")
}

// Collaboration models
model ProjectCollaborator {
  id           String   @id @default(cuid())
  projectId    String
  userId       String
  role         Role     @default(VIEWER)
  inviteStatus Status   @default(PENDING)
  invitedBy    String
  invitedAt    DateTime @default(now())
  acceptedAt   DateTime?
  project      Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  inviter      User     @relation("InvitedBy", fields: [invitedBy], references: [id])
}
```

## API Design

We implemented a RESTful API for most operations, with WebSockets for real-time updates:

```
GET /api/projects - List user's projects
POST /api/projects - Create a new project
GET /api/projects/:id - Get project details
PUT /api/projects/:id - Update project
DELETE /api/projects/:id - Delete project

GET /api/projects/:id/collaborators - List collaborators
POST /api/projects/:id/collaborators - Invite collaborator
PUT /api/projects/:id/collaborators/:userId - Update collaborator role
DELETE /api/projects/:id/collaborators/:userId - Remove collaborator

GET /api/projects/:id/activities - Get activity feed
GET /api/projects/:id/comments - Get comments
POST /api/projects/:id/comments - Add comment
```

## Performance Optimization

Performance was a key focus, especially for the real-time collaboration features:

1. **Debounced Updates**: We implemented debouncing to prevent excessive API calls during rapid editing
2. **Selective Rendering**: Components only re-render when their specific data changes
3. **Pagination**: For projects, comments, and activity feeds to reduce initial load time
4. **Lazy Loading**: Components and data are loaded only when needed

```javascript
// Example of optimized data fetching with SWR
const useProjectData = (projectId) => {
  const { data, error, mutate } = useSWR(
    projectId ? `/api/projects/${projectId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  
  return {
    project: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
};
```

## Authentication and Authorization

We implemented a robust auth system using NextAuth.js with custom role-based access control:

```javascript
// Middleware to check project access
export async function checkProjectAccess(req, res, projectId) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return { hasAccess: false, error: "Unauthorized" };
  }
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      userId: true,
      shared: true,
    },
  });
  
  if (!project) {
    return { hasAccess: false, error: "Project not found" };
  }
  
  // Check if user is a collaborator
  const collaborator = await prisma.projectCollaborator.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: session.user.id
      }
    },
    select: {
      role: true,
      inviteStatus: true
    }
  });
  
  const isOwner = project.userId === session.user.id;
  const isCollaborator = collaborator && collaborator.inviteStatus === "ACCEPTED";
  
  return {
    hasAccess: isOwner || project.shared || isCollaborator,
    isOwner,
    isCollaborator,
    role: isCollaborator ? collaborator.role : null
  };
}
```

## Challenges and Lessons Learned

Building SketchFlow wasn't without its challenges:

1. **Concurrent Editing Conflicts**: We had to carefully design our collaboration system to handle concurrent edits without conflicts
2. **Performance with Large Diagrams**: Rendering and synchronizing large diagrams required optimization
3. **Cross-Browser Compatibility**: Ensuring consistent behavior across browsers was challenging
4. **Mobile Responsiveness**: Adapting a complex split-screen interface for mobile devices required creative solutions

Key lessons learned:

1. **Start with a Solid Data Model**: Our investment in a well-designed database schema paid off as we added features
2. **Incremental Feature Rollout**: We released core features first, then added collaboration capabilities
3. **User Feedback is Gold**: Early user testing helped us identify and fix usability issues
4. **Performance Matters**: Optimizing from the start is easier than retrofitting performance improvements

## What's Next for SketchFlow

We're continuing to evolve SketchFlow with exciting features on our roadmap:

1. **AI-Assisted Documentation**: Generating documentation suggestions based on diagrams
2. **Version History**: Tracking changes and allowing rollback to previous versions
3. **Advanced Permissions**: More granular access controls for enterprise teams
4. **Integration Ecosystem**: Connecting with popular development tools and platforms

## Open Source Contributions

We've benefited tremendously from open source, and we're giving back by open-sourcing several components:

1. **react-markdown-editor**: Our enhanced markdown editor with real-time preview
2. **collaboration-utils**: Utilities for implementing real-time collaboration
3. **nextjs-prisma-auth**: Our authentication and authorization patterns

## Conclusion

Building SketchFlow has been an exciting technical journey. By combining modern web technologies with thoughtful UX design, we've created a platform that's transforming how development teams document and collaborate.

I hope this technical deep dive provides some insights that you can apply to your own projects. If you have questions about our implementation or want to discuss any aspect in more detail, drop a comment below!

Would you like to see more articles about specific aspects of SketchFlow's architecture? Let me know what you're most interested in.

Happy coding! 🚀

---

*Follow SketchFlow on [GitHub](https://github.com/sketchflow), [Twitter](https://twitter.com/sketchflowapp), and check out our platform at [sketchflow.io](https://sketchflow.io).*
