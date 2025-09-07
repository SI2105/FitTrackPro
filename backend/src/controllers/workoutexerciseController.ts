import { Request, Response, NextFunction } from "express";
import {
  createWorkoutExerciseService,
  updateWorkoutExerciseService,
  deleteWorkoutExerciseService,
  getWorkoutExercisesService,
  getWorkoutExerciseByIdService,
} from "../services/workoutexerciseService";

export const createWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user_id;
    const workoutId = req.params.workoutId;
    if (userId) {
      const result = await createWorkoutExerciseService(
        userId,
        workoutId,
        req.body
      );
      res.status(201).json(result);
    }
  } catch (error) {
    next(error);
  }
};

export const updateWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user_id;
    const workoutId = req.params.workoutId;
    const id = req.params.id;
    if(userId){
      const workoutExercise = await getWorkoutExerciseByIdService(userId, workoutId, id);
      if (Object.keys(workoutExercise).length === 0) {
        res.status(404).json({ message: "WorkoutExercise not found" });
        return;
      }
      if (userId) {
        const result = await updateWorkoutExerciseService(
          userId,
          workoutId,
          id,
          req.body
        );
        res.status(200).json(result);
      }
    }
    
  } catch (error) {
    next(error);
  }
};

export const deleteWorkoutExercise = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user_id;
    const workoutId = req.params.workoutId;
    const id = req.params.id;
    if (userId) {
      await deleteWorkoutExerciseService(
        userId,
        workoutId,
        id
      );
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
};

export const getWorkoutExercises = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user_id;
    const workoutId = req.params.workoutId;
    
    if(userId){
      const result = await getWorkoutExercisesService(
        userId,
        workoutId
      );
      res.status(200).json(result);
  }
  } catch (error) {
      next(error);
  }
};
