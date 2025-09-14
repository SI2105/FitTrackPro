import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class WorkoutService {
    async createWorkout(data: { name: string; notes?: string; scheduledAt?: string; userId: number }) {
        return await prisma.workout.create({
            data: {
                name: data.name,
                notes: data.notes,
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
                userId: data.userId,
            },
        });
    }

    async getUserWorkouts(userId: number) {
        return await prisma.workout.findMany({
            where: { userId },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });
    }

    async getWorkoutById(workoutId: number, userId: number) {
        return await prisma.workout.findFirst({
            where: {
                id: workoutId,
                userId,
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });
    }

    async updateWorkout(workoutId: number, userId: number, updateData: { name?: string; notes?: string; scheduledAt?: string }) {
        return await prisma.workout.updateManyAndReturn({
            where: {
                id: workoutId,
                userId,
            },
            data: {
                name: updateData.name,
                notes: updateData.notes,
                scheduledAt: updateData.scheduledAt ? new Date(updateData.scheduledAt) : undefined,
            },
        });
    }

    async deleteWorkout(workoutId: number, userId: number) {
        return await prisma.workout.deleteMany({
            where: {
                id: workoutId,
                userId,
            },
        });
    }
}

export const workoutService = new WorkoutService();