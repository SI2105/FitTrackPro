

/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: API endpoints for managing and retrieving workouts for authenticated users.
 */

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Create a new workout for the authenticated user
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the workout
 *               notes:
 *                 type: string
 *                 description: Optional notes for the workout
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled date and time for the workout
 *     responses:
 *       201:
 *         description: Workout created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Missing user ID or workout name
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts for the authenticated user
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Missing user ID
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Get a workout by ID for the authenticated user
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the workout
 *     responses:
 *       200:
 *         description: Workout details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       404:
 *         description: Workout not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /workouts/{id}:
 *   put:
 *     summary: Update a workout by ID for the authenticated user
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the workout
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the workout
 *               notes:
 *                 type: string
 *                 description: Updated notes for the workout
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *                 description: Updated scheduled date and time
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout'
 *       400:
 *         description: Empty Update Error or invalid input
 *       404:
 *         description: Workout not found or does not belong to user
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /workouts/{id}:
 *   delete:
 *     summary: Delete a workout by ID for the authenticated user
 *     tags:
 *       - Workouts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the workout
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Workout deleted
 *       404:
 *         description: Workout not found or does not belong to user
 *       401:
 *         description: Unauthorized
 */
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