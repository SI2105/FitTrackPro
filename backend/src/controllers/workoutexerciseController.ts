import { Request, Response, NextFunction } from "express";
import { PrismaClient, ExerciseCategory } from "../../generated/prisma";

const prisma = new PrismaClient();

// POST /workoutsexercises/:workoutId/exercises
export const createWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workoutId } = req.params;
    const {
      exerciseId,
      sets,
      reps,
      weight,
      duration,
      distance,
      comment,
    } = req.body;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== req.user_id) {
      res.status(403).json({ message: "Unauthorized or workout not found" });
      return;
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      res.status(404).json({ message: "Exercise not found" });
      return;
    }

    // Check duplicate
    const existing = await prisma.workoutExercise.findUnique({
      where: { workoutId_exerciseId: { workoutId: parseInt(workoutId), exerciseId } },
    });

    if (existing) {
      res.status(400).json({
        message: "This exercise is already in the workout. Edit or remove it instead.",
      });
      return;
    }

    // Validate based on category
    const errors: string[] = [];

    if (exercise.category === ExerciseCategory.strength) {
      if (sets == null || reps == null || weight == null) {
        errors.push("Strength exercises must include sets, reps, and weight.");
      }
    } else if (exercise.category === ExerciseCategory.aerobic) {
      if (duration == null && distance == null) {
        errors.push("Aerobic exercises must include duration or distance.");
      }
    } else if (exercise.category === ExerciseCategory.flexibility) {
      if (sets == null || reps == null) {
        errors.push("Flexibility exercises must include sets and reps.");
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    // Create base WorkoutExercise first
    const base = await prisma.workoutExercise.create({
      data: {
        workoutId: parseInt(workoutId),
        exerciseId,
        comment,
      },
    });

    // Then create the subtype
    switch (exercise.category) {
      case ExerciseCategory.strength:
        await prisma.strengthWorkoutExercise.create({
          data: {
            id: base.id,
            sets,
            reps,
            weight,
          },
        });
        break;
      case ExerciseCategory.flexibility:
        await prisma.flexibilityWorkoutExercise.create({
          data: {
            id: base.id,
            sets,
            reps,
          },
        });
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

    res.status(201).json({ ...base, category: exercise.category });
  } catch (error) {
    next(error);
  }
};

// PUT /workouts/:workoutId/exercises/:id
export const updateWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workoutId, id } = req.params;
    const {
      sets,
      reps,
      weight,
      duration,
      distance,
      comment,
    } = req.body;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== req.user_id) {
      res.status(403).json({ message: "Unauthorized or workout not found" });
      return;
    }

    const base = await prisma.workoutExercise.findUnique({
      where: { id: parseInt(id) },
      include: { exercise: true },
    });

    if (!base) {
      res.status(404).json({ message: "WorkoutExercise not found" });
      return;
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
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    // Update base
    await prisma.workoutExercise.update({
      where: { id: parseInt(id) },
      data: { comment },
    });

    // Update subtype
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

    res.status(200).json({ message: "WorkoutExercise updated." });
  } catch (error) {
    next(error);
  }
};

// DELETE /workouts/:workoutId/exercises/:id
export const deleteWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workoutId, id } = req.params;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== req.user_id) {
      res.status(403).json({ message: "Unauthorized or workout not found" });
      return;
    }

    await prisma.workoutExercise.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// GET /workouts/:workoutId/exercises
export const getWorkoutExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workoutId } = req.params;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== req.user_id) {
      res.status(403).json({ message: "Unauthorized or workout not found" });
      return;
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

    const simplified = workoutExercises.map((we) => {
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

    res.status(200).json(simplified);
  } catch (error) {
    next(error);
  }
};
