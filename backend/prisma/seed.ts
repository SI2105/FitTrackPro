import { PrismaClient, ExerciseCategory, MuscleGroup} from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const exercises = [
    {
      name: 'Bench Press',
      description: 'A chest-strengthening exercise using a barbell or dumbbells.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.chest, MuscleGroup.arms, MuscleGroup.shoulders],
    },
    {
      name: 'Deadlift',
      description: 'A compound lift targeting the entire posterior chain.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.back, MuscleGroup.legs, MuscleGroup.glutes, MuscleGroup.core],
    },
    {
      name: 'Lat Pulldown',
      description: 'A back exercise performed on a cable machine.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.back, MuscleGroup.arms],
    },
    {
      name: 'Shoulder Press',
      description: 'An overhead press that targets shoulders and arms.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.shoulders, MuscleGroup.arms],
    },
    {
      name: 'Seated Row',
      description: 'Back strengthening exercise using cable row machine.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.back, MuscleGroup.arms],
    },
    {
      name: 'Bicep Curl',
      description: 'An isolation movement for the biceps.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.arms],
    },
    {
      name: 'Leg Curl',
      description: 'Hamstring isolation exercise using a curl machine.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.legs],
    },
    {
      name: 'Romanian Deadlift (RDL)',
      description: 'Focuses on hamstrings and glutes using a hip hinge motion.',
      category: ExerciseCategory.strength,
      muscleGroups: [MuscleGroup.legs, MuscleGroup.glutes, MuscleGroup.back],
    },
    {
      name: 'Running',
      description: 'Aerobic cardiovascular endurance activity.',
      category: ExerciseCategory.aerobic,
      muscleGroups: [],
    },
    {
      name: 'Cycling',
      description: 'Low-impact aerobic exercise done on a stationary or road bike.',
      category: ExerciseCategory.aerobic,
      muscleGroups: [],
    },
    {
      name: 'Jump Rope',
      description: 'Cardio workout involving skipping over a rope.',
      category: ExerciseCategory.aerobic,
      muscleGroups: [],
    },
    {
      name: 'Yoga',
      description: 'A flexibility-focused practice involving poses and breathing.',
      category: ExerciseCategory.flexibility,
      muscleGroups: [],
    },
    {
      name: 'Hamstring Stretch',
      description: 'A static stretch for hamstring muscles.',
      category: ExerciseCategory.flexibility,
      muscleGroups: [],
    },
    {
    name: 'Downward Dog',
    description: 'A yoga pose that stretches the hamstrings, calves, and spine.',
    category: ExerciseCategory.flexibility,
    muscleGroups: [],
  },
  {
    name: 'Butterfly Stretch',
    description: 'A seated stretch that targets the inner thighs and hips.',
    category: ExerciseCategory.flexibility,
    muscleGroups: [],
  },
  {
    name: 'Neck Rolls',
    description: 'Slow, controlled neck stretches to improve neck flexibility.',
    category: ExerciseCategory.flexibility,
    muscleGroups: [],
  },
  {
    name: 'Standing Quad Stretch',
    description: 'A balance-based stretch that targets the quadriceps.',
    category: ExerciseCategory.flexibility,
    muscleGroups: [],
  },
  ];

  //Delete all existing exercises before seeding new ones
  await prisma.exercise.deleteMany();
  await prisma.$queryRaw`ALTER Sequence "Exercise_id_seq" RESTART WITH 1`
  
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
