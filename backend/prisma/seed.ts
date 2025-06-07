import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const exercises = [
    {
      name: 'Push-Up',
      description: 'A basic upper body strength exercise.',
      category: 'strength',
      muscleGroup: 'chest',
    },
    {
      name: 'Squat',
      description: 'Lower body exercise to strengthen legs and glutes.',
      category: 'strength',
      muscleGroup: 'legs',
    },
    {
      name: 'Jumping Jacks',
      description: 'Full body cardio exercise.',
      category: 'cardio',
      muscleGroup: "full-body",
    },
  ];

  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log('Seeded exercises successfully');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
