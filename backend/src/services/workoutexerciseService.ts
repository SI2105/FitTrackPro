import { PrismaClient } from "@prisma/client";

// Enum definitions from schema  
export enum ExerciseCategory {
  strength = "strength",
  aerobic = "aerobic", 
  flexibility = "flexibility"
}
import { AppError } from "../middlewares/errorHandler";
const prisma = new PrismaClient();

export async function createWorkoutExerciseService(
    userId: number,
    workoutId: string,
    body: {
        exerciseId: number;
        sets?: number;
        reps?: number;
        weight?: number;
        duration?: number;
        distance?: number;
        comment?: string;
    }
) {
    const {
        exerciseId,
        sets,
        reps,
        weight,
        duration,
        distance,
        comment,
    } = body;

    if (!exerciseId) {
        throw new AppError(400, "exerciseId is required");
    }

    const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
        throw new AppError(403, "Unauthorized or workout not found");
    }

    const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
    });

    if (!exercise) {
        throw new AppError(404, "Exercise not found" );
    }

    const existing = await prisma.workoutExercise.findUnique({
        where: { workoutId_exerciseId: { workoutId: parseInt(workoutId), exerciseId } },
    });

    if (existing) {
        throw new AppError(400, "This exercise is already in the workout. Edit or remove it instead.");
    }

    if (exercise.category === ExerciseCategory.strength) {
        if (sets == null || reps == null || weight == null) {
            throw new AppError(400, "Strength exercises must include sets, reps, and weight.");
        }
    } else if (exercise.category === ExerciseCategory.aerobic) {
        if (duration == null && distance == null) {
            throw new AppError(400, "Aerobic exercises must include duration or distance.");
        }
    } else if (exercise.category === ExerciseCategory.flexibility) {
        if (sets == null || reps == null) {
            throw new AppError(400, "Flexibility exercises must include sets and reps.");
        }
    }

    const base = await prisma.workoutExercise.create({
        data: {
            workoutId: parseInt(workoutId),
            exerciseId,
            comment,
        },
    });

    switch (exercise.category) {
        case ExerciseCategory.strength:
            if(sets && reps && weight)
            {    await prisma.strengthWorkoutExercise.create({
                    data: {
                        id: base.id,
                        sets,
                        reps,
                        weight,
                    },
                });
            }
            break;
        case ExerciseCategory.flexibility:
            if(sets && reps)
                {    await prisma.flexibilityWorkoutExercise.create({
                    data: {
                        id: base.id,
                        sets,
                        reps,
                    },
                });
            }
            break;
        case ExerciseCategory.aerobic:
            await prisma.aerobicWorkoutExercise.create({
                data: {
                    id: base.id,
                    duration: duration ?? 0,
                    distance: distance ?? 0,
                },
            });
            break;
    }

    return { ...base, category: exercise.category };
}

export async function getWorkoutExerciseByIdService(
    userId: number,
    workoutId: string,
    id: string
) {
    const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
        throw new AppError(403, "Unauthorized or workout not found");
    }

    const workoutExercise = await prisma.workoutExercise.findUnique({
        where: { id: parseInt(id) },
        include: {
            exercise: true,
            strength: true,
            aerobic: true,
            flexibility: true,
        },
    });

    if (!workoutExercise || workoutExercise.workoutId !== parseInt(workoutId)) {
        throw new AppError(404, "WorkoutExercise not found");
    }

    let details: Record<string, unknown> = {
        id: workoutExercise.id,
        comment: workoutExercise.comment,
        exercise: {
            id: workoutExercise.exercise.id,
            name: workoutExercise.exercise.name,
            category: workoutExercise.exercise.category,
        },
    };

    if (workoutExercise.strength) {
        details = {
            ...details,
            sets: workoutExercise.strength.sets,
            reps: workoutExercise.strength.reps,
            weight: workoutExercise.strength.weight,
        };
    } else if (workoutExercise.aerobic) {
        details = {
            ...details,
            duration: workoutExercise.aerobic.duration,
            distance: workoutExercise.aerobic.distance,
        };
    } else if (workoutExercise.flexibility) {
        details = {
            ...details,
            sets: workoutExercise.flexibility.sets,
            reps: workoutExercise.flexibility.reps,
        };
    }

    return details;
}

export async function updateWorkoutExerciseService(
    userId: number,
    workoutId: string,
    id: string,
    body: {
        sets?: number;
        reps?: number;
        weight?: number;
        duration?: number;
        distance?: number;
        comment?: string;
    }
) {
    const {
        sets,
        reps,
        weight,
        duration,
        distance,
        comment,
    } = body;

    const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
        throw new AppError(403, "Unauthorized or workout not found");
    }

    const base = await prisma.workoutExercise.findUnique({
        where: { id: parseInt(id) },
        include: { exercise: true },
    });

    if (!base) {
        throw new AppError(404, "WorkoutExercise not found");
    }

    const { category } = base.exercise;
    const errors: string[] = [];

    if (category === ExerciseCategory.strength) {
        if (sets == null || reps == null || weight == null) {
            errors.push("Strength exercises must include sets, reps, and weight.");
        }
    } else if (category === ExerciseCategory.aerobic) {
        if (duration == null && distance == null) {
            errors.push("Aerobic exercises must include duration or distance.");
        }
    } else if (category === ExerciseCategory.flexibility) {
        if (sets == null || reps == null) {
            errors.push("Flexibility exercises must include sets and reps.");
        }
    }

    if (errors.length > 0) {
        throw new AppError(400, "Validation failed" + errors);
    }

    await prisma.workoutExercise.update({
        where: { id: parseInt(id) },
        data: { comment },
    });

    if (category === ExerciseCategory.strength) {
        await prisma.strengthWorkoutExercise.update({
            where: { id: parseInt(id) },
            data: { sets, reps, weight },
        });
    } else if (category === ExerciseCategory.flexibility) {
        await prisma.flexibilityWorkoutExercise.update({
            where: { id: parseInt(id) },
            data: { sets, reps },
        });
    } else if (category === ExerciseCategory.aerobic) {
        await prisma.aerobicWorkoutExercise.update({
            where: { id: parseInt(id) },
            data: {
                duration: duration ?? 0,
                distance: distance ?? 0,
            },
        });
    }

    return { message: "WorkoutExercise updated." };
}

export async function deleteWorkoutExerciseService(
    userId: number,
    workoutId: string,
    id: string
) {
    const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
        throw new AppError(403, "Unauthorized or workout not found");
    }

    await prisma.workoutExercise.delete({
        where: { id: parseInt(id) },
    });
}

export async function getWorkoutExercisesService(
    userId: number,
    workoutId: string
) {
    const workout = await prisma.workout.findUnique({
        where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
        throw new AppError(403, "Unauthorized or workout not found");
    }

    const workoutExercises = await prisma.workoutExercise.findMany({
        where: { workoutId: parseInt(workoutId) },
        include: {
            exercise: true,
            strength: true,
            aerobic: true,
            flexibility: true,
        },
    });

    return workoutExercises.map((we) => {
        let details: Record<string, unknown> = {
            id: we.id,
            comment: we.comment,
            exercise: {
                id: we.exercise.id,
                name: we.exercise.name,
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
    });
}
