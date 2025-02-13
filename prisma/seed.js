const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to seed plans...');
    
    // Check if Pro plan exists
    let proPlan = await prisma.plan.findFirst({
      where: { name: 'Pro' }
    });

    // Create Pro plan if it doesn't exist
    if (!proPlan) {
      proPlan = await prisma.plan.create({
        data: {
          name: 'Pro',
          description: 'For power users',
          price: 1999,
          duration: 30,
          features: JSON.stringify({
            projectLimit: -1, // unlimited
            templates: 'premium',
            support: 'priority',
            features: ['core', 'advanced']
          })
        }
      });
      console.log('Created Pro plan:', proPlan.id);
    }

    // Check if Pro Yearly plan exists
    let proYearlyPlan = await prisma.plan.findFirst({
      where: { name: 'Pro Yearly' }
    });

    // Create Pro Yearly plan if it doesn't exist
    if (!proYearlyPlan) {
      proYearlyPlan = await prisma.plan.create({
        data: {
          name: 'Pro Yearly',
          description: 'Best value for professionals',
          price: 19999,
          duration: 365,
          features: JSON.stringify({
            projectLimit: -1,
            templates: 'premium',
            support: 'priority',
            features: ['core', 'advanced', 'early_access']
          })
        }
      });
      console.log('Created Pro Yearly plan:', proYearlyPlan.id);
    }

    console.log('Plans seeded successfully:', {
      pro: { id: proPlan.id, name: proPlan.name },
      proYearly: { id: proYearlyPlan.id, name: proYearlyPlan.name }
    });
  } catch (error) {
    console.error('Error seeding plans:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
