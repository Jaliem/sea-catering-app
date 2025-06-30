// Plain JS seed script for meal plans
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.mealPlan.createMany({
    data: [
      {
        name: "Diet Plan",
        description: "Perfect for weight management and healthy lifestyle.",
        price: 30000,
        image: "/dietplan.jpg",
      },
      {
        name: 'Protein Plan',
        description: 'High-protein meals for muscle building and active lifestyles.',
        price: 40000,
        image: "/proteinplan.jpg",
      },
      {
        name: 'Royal Plan',
        description: 'Premium meals with gourmet ingredients and extra variety.',
        price: 60000,
        image: "/royalplan.png",
      },
    ],
    skipDuplicates: true,
  });
  console.log('Meal plans seeded!');
}

main().finally(() => prisma.$disconnect());
