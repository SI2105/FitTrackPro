import { PrismaClient } from "../../generated/prisma";
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
        const workout = await prisma.workout.findFirst({
            where: {
                id: workoutId,
                userId,
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                        strength: true,
                        aerobic: true,
                        flexibility: true,
                    },
                },
            },
        });
        
        if (!workout) {
            return null;
        }

        return {
            ...workout,
            exercises: workout.exercises.map((we) => {
                let details: Record<string, unknown> = {
                    id: we.id,
                    comment: we.comment,
                    exercise: {
                        id: we.exercise.id,
                        name: we.exercise.name,
                        description: we.exercise.description,
                        muscleGroups: we.exercise.muscleGroups,
                        category: we.exercise.category,

                    },
                };

                if (we.strength) {
                    details = {
                        ...details,
                        sets: we.strength.sets,
                        reps: we.strength.reps,
                        weight: we.strength.weight,
                    };
                } else if (we.aerobic) {
                    details = {
                        ...details,
                        duration: we.aerobic.duration,
                        distance: we.aerobic.distance,
                    };
                } else if (we.flexibility) {
                    details = {
                        ...details,
                        sets: we.flexibility.sets,
                        reps: we.flexibility.reps,
                    };
                }

                return details;
            }),
        };
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