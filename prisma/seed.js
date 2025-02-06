const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create subscription plans
  await prisma.plan.createMany({
    data: [
      {
        name: 'Free',
        description: 'Perfect for getting started',
        price: 0,
        interval: 'MONTHLY',
        features: {
          projectLimit: 100,
          templates: 'basic',
          support: 'community',
          features: ['core']
        }
      },
      {
        name: 'Pro',
        description: 'For power users',
        price: 19,
        interval: 'MONTHLY',
        features: {
          projectLimit: -1, // unlimited
          templates: 'premium',
          support: 'priority',
          features: ['core', 'advanced']
        }
      }
    ]
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
