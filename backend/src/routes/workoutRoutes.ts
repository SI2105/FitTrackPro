import { Router } from "express";

import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createWorkout, deleteWorkout, getUserWorkouts, getWorkoutById, updateWorkout } from "../controllers/workoutController";
const router = Router();
router.post("/", authenticateJWT, createWorkout);
router.get("/", authenticateJWT, getUserWorkouts);
router.get("/:id", authenticateJWT, getWorkoutById);
router.put("/:id", authenticateJWT, updateWorkout);
router.delete("/:id", authenticateJWT, deleteWorkout);


export default router; 