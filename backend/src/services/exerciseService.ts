import { PrismaClient } from "@prisma/client";

// Enum definitions from schema
export enum ExerciseCategory {
  strength = "strength",
  aerobic = "aerobic", 
  flexibility = "flexibility"
}

export enum MuscleGroup {
  chest = "chest",
  back = "back",
  legs = "legs", 
  arms = "arms",
  shoulders = "shoulders",
  core = "core",
  glutes = "glutes"
}

const prisma = new PrismaClient();

export const exerciseService = {
    async getAllExercises() {
        return prisma.exercise.findMany();
    },

    async getExerciseByCategory(category: string) {
        const normalizedCategory = category.toLowerCase();
        if (!Object.values(ExerciseCategory).includes(normalizedCategory as ExerciseCategory)) {
            throw new Error("Invalid Category");
        }
        return prisma.exercise.findMany({
            where: {
                category: normalizedCategory as ExerciseCategory,
            },
        });
    },

    async getExercisesByMuscleGroup(muscleGroup: string) {
        const normalizedMuscleGroup = muscleGroup.toLowerCase();
        if (!Object.values(MuscleGroup).includes(normalizedMuscleGroup as MuscleGroup)) {
            throw new Error("Invalid Muscle Group");
        }
        return prisma.exercise.findMany({
            where: {
                muscleGroups: {
                    has: normalizedMuscleGroup as MuscleGroup,
                },
            },
        });
    },

    async searchExercises(query: string) {
        return prisma.exercise.findMany({
            where: {
                name: {
                    contains: String(query),
                    mode: "insensitive",
                },
            },
        });
    },

    async getExerciseById(id: number) {
        const exercise = await prisma.exercise.findUnique({
            where: { id: id },
        });
        if (!exercise) {
            throw new Error("Exercise not found");
        }
        return exercise;
    },
};