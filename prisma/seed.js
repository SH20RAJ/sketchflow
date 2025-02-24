const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create sample tags
  const tags = await Promise.all([
    prisma.projectTag.create({
      data: {
        name: 'Work',
        emoji: '💼',
        color: '#4F46E5',
        userId: 'cm7a40d760000m8k01lti3i1y' // Replace with your test user ID
      }
    }),
    prisma.projectTag.create({
      data: {
        name: 'Personal',
        emoji: '🏠',
        color: '#10B981',
        userId: 'cm7a40d760000m8k01lti3i1y'
      }
    }),
    prisma.projectTag.create({
      data: {
        name: 'Ideas',
        emoji: '💡',
        color: '#F59E0B',
        userId: 'cm7a40d760000m8k01lti3i1y'
      }
    })
  ]);

  console.log('Created sample tags:', tags);

  // Create sample projects with tags
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: 'Project Planning',
        description: 'Planning for Q2 2024',
        emoji: '📊',
        color: '#4F46E5',
        userId: 'cm7a40d760000m8k01lti3i1y',
        projectTags: {
          connect: [{ id: tags[0].id }] // Work tag
        },
        diagrams: {
          create: {
            name: 'Main',
            content: { elements: [], appState: {} }
          }
        }
      }
    }),
    prisma.project.create({
      data: {
        name: 'Home Renovation',
        description: 'Ideas for home improvement',
        emoji: '🏡',
        color: '#10B981',
        userId: 'cm7a40d760000m8k01lti3i1y',
        projectTags: {
          connect: [{ id: tags[1].id }] // Personal tag
        },
        diagrams: {
          create: {
            name: 'Main',
            content: { elements: [], appState: {} }
          }
        }
      }
    }),
    prisma.project.create({
      data: {
        name: 'Startup Ideas',
        description: 'Collection of potential startup ideas',
        emoji: '🚀',
        color: '#F59E0B',
        userId: 'cm7a40d760000m8k01lti3i1y',
        projectTags: {
          connect: [{ id: tags[2].id }] // Ideas tag
        },
        diagrams: {
          create: {
            name: 'Main',
            content: { elements: [], appState: {} }
          }
        }
      }
    })
  ]);

  console.log('Created sample projects:', projects);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
