import { Router } from "express";

import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createWorkoutExercise, getWorkoutExercises, updateWorkoutExercise, deleteWorkoutExercise} from "../controllers/workoutexerciseController";
const router = Router();

router.post("/:workoutId/exercises", authenticateJWT, createWorkoutExercise);
router.get("/:workoutId/exercises", authenticateJWT, getWorkoutExercises);
router.put("/:workoutId/exercises/:id", authenticateJWT, updateWorkoutExercise);
router.delete("/:workoutId/exercises/:id", authenticateJWT, deleteWorkoutExercise);


export default router; 