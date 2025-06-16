import { Request, Response, NextFunction } from "express";
import { PrismaClient, ExerciseCategory } from "../../generated/prisma";

const prisma = new PrismaClient();

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

    const existingAssociation = await prisma.workoutExercise.findFirst({
      where: {
        workoutId: parseInt(workoutId),
        exerciseId,
      },
    });

    if (existingAssociation) {
      res.status(400).json({ message: "This exercise is already in the specified workout. You can remove or edit it, alternatively choose another exercise" });
      return;
    }

    const user_id = req.user_id
    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== user_id) {
      res.status(403).json({ message: "Unauthorized or workout not found" });
      return 
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      res.status(404).json({ message: "Exercise not found" });
      return;
    }

    const { category } = exercise;
    const errors: string[] = [];

    // Inline validation depending on exercise category
    if (category === ExerciseCategory.strength) {
      if (sets == null || reps == null || weight == null) {
        errors.push("Strength exercises must include sets, reps, and weight.");
      }
      if (duration != null || distance != null) {
        errors.push("Strength exercises should not include duration or distance.");
      }
    }

    if (category === ExerciseCategory.aerobic) {
      if (duration == null && distance == null) {
        errors.push("Aerobic exercises must include at least duration or distance.");
      }
      if (sets != null || reps != null || weight != null) {
        errors.push("Aerobic exercises should not include sets, reps, or weight.");
      }
    }

    if (category === ExerciseCategory.flexibility) {
      if (sets == null || reps == null) {
        errors.push("Flexibility exercises must include sets and reps.");
      }
      if (weight != null || duration != null || distance != null) {
        errors.push("Flexibility exercises should not include weight, duration, or distance.");
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const newWorkoutExercise = await prisma.workoutExercise.create({
      data: {
        workoutId: parseInt(workoutId),
        exerciseId,
        sets,
        reps,
        weight,
        duration,
        distance,
        comment,
      },
    });

    res.status(201).json(newWorkoutExercise);
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
    const userId = req.user_id
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

    if (!workout || workout.userId !== userId) {
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


    const { category } = exercise;
    const errors: string[] = [];

    if (category === ExerciseCategory.strength) {
      if (sets == null || reps == null || weight == null) {
        errors.push("Strength exercises must include sets, reps, and weight.");
      }
      if (duration != null || distance != null) {
        errors.push("Strength exercises should not include duration or distance.");
      }
    }

    if (category === ExerciseCategory.aerobic) {
      if (duration == null && distance == null) {
        errors.push("Aerobic exercises must include at least duration or distance.");
      }
      if (sets != null || reps != null || weight != null) {
        errors.push("Aerobic exercises should not include sets, reps, or weight.");
      }
    }

    if (category === ExerciseCategory.flexibility) {
      if (sets == null || reps == null) {
        errors.push("Flexibility exercises must include sets and reps.");
      }
      if (weight != null || duration != null || distance != null) {
        errors.push("Flexibility exercises should not include weight, duration, or distance.");
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ message: "Validation failed", errors });
      return;
    }

    const updatedExercise = await prisma.workoutExercise.update({
      where: { id: parseInt(id) },
      data: {
        workoutId: parseInt(workoutId),
        exerciseId,
        sets,
        reps,
        weight,
        duration,
        distance,
        comment,}
    });

    res.status(200).json(updatedExercise);
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
    const userId = req.user_id;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
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
    const userId = req.user_id;

    const workout = await prisma.workout.findUnique({
      where: { id: parseInt(workoutId) },
    });

    if (!workout || workout.userId !== userId) {
      res.status(403).json({ message: "Unauthorized or workout not found" });
      return;
    }

    const exercises = await prisma.workoutExercise.findMany({
      where: { workoutId: parseInt(workoutId) },
      include: { exercise: true },
    });

    res.status(200).json(exercises);
  } catch (error) {
    next(error);
  }
};

