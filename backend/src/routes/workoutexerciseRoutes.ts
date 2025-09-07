
/**
 * @swagger
 * tags:
 *   name: WorkoutExercises
 *   description: API endpoints for managing and retrieving exercises associated with specific workouts for authenticated users.
 */

/**
 * @swagger
 * /workoutexercises/{workoutId}/exercises:
 *   post:
 *     summary: Create a new exercise for a workout
 *     description: Adds a new exercise to the specified workout for the authenticated user.
 *     tags:
 *       - WorkoutExercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout to add the exercise to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutExerciseInput'
 *     responses:
 *       201:
 *         description: Exercise created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutExercise'
 *       401:
 *         description: Unauthorized.
 *       400:
 *         description: Bad request.
 */

/**
 * @swagger
 * /workoutexercises/{workoutId}/exercises:
 *   get:
 *     summary: Get all exercises for a workout
 *     description: Retrieves all exercises associated with the specified workout for the authenticated user.
 *     tags:
 *       - WorkoutExercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout to retrieve exercises for.
 *     responses:
 *       200:
 *         description: List of workout exercises.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkoutExercise'
 *       403:
 *         description: Unauthorized or workout not found
 */

/**
 * @swagger
 * /workoutexercises/{workoutId}/exercises/{id}:
 *   put:
 *     summary: Update an exercise for a workout
 *     description: Updates the specified exercise for the workout belonging to the authenticated user.
 *     tags:
 *       - WorkoutExercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout exercise to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkoutExerciseInput'
 *     responses:
 *       200:
 *         description: Exercise updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkoutExercise'
 *       404:
 *         description: WorkoutExercise not found.
 *       401:
 *         description: Unauthorized.
 *       400:
 *         description: Bad request.
 */

/**
 * @swagger
 * /workoutexercises/{workoutId}/exercises/{id}:
 *   delete:
 *     summary: Delete an exercise from a workout
 *     description: Deletes the specified exercise from the workout for the authenticated user.
 *     tags:
 *       - WorkoutExercises
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout.
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the workout exercise to delete.
 *     responses:
 *       204:
 *         description: Exercise deleted successfully.
 *       404:
 *         description: WorkoutExercise not found.
 *       401:
 *         description: Unauthorized.
 */
import { Router } from "express";

import { authenticateJWT } from "../middlewares/authenticateJWT";
import { createWorkoutExercise, getWorkoutExercises, updateWorkoutExercise, deleteWorkoutExercise} from "../controllers/workoutexerciseController";
const router = Router();

router.post("/:workoutId/exercises", authenticateJWT, createWorkoutExercise);
router.get("/:workoutId/exercises", authenticateJWT, getWorkoutExercises);
router.put("/:workoutId/exercises/:id", authenticateJWT, updateWorkoutExercise);
router.delete("/:workoutId/exercises/:id", authenticateJWT, deleteWorkoutExercise);


export default router; 