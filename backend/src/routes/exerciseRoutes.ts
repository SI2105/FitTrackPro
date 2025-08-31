/**
 * @swagger
 * tags:
 *   name: Exercises
 *   description: API endpoints for managing and retrieving exercises
 */

/**
 * @swagger
 * /exercises:
 *   get:
 *     summary: Retrieve all exercises
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: List of all exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /exercises/category/{category}:
 *   get:
 *     summary: Retrieve exercises by category
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category(strength, aerobic, flexibility) of the exercises
 *     responses:
 *       200:
 *         description: List of exercises in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Invalid category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /exercises/muscle-group/{muscleGroup}:
 *   get:
 *     summary: Retrieve exercises by muscle group
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: muscleGroup
 *         required: true
 *         schema:
 *           type: string
 *         description: Muscle group (chest,back,legs, arms, shoulders, core, glutes) to filter exercises
 *     responses:
 *       200:
 *         description: List of exercises for the specified muscle group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Invalid muscle group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /exercises/search:
 *   get:
 *     summary: Search exercises by query
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for exercises
 *     responses:
 *       200:
 *         description: List of exercises matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *       400:
 *         description: No query parameter was passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /exercises/{id}:
 *   get:
 *     summary: Retrieve exercise by ID
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Unique ID of the exercise
 *     responses:
 *       200:
 *         description: Exercise details
 *         content:
 *           application/json:
 *             schema:
 *                  type: object
 *       404:
 *         description: Exercise not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import { getAllExercises, getExerciseByCategory, getExerciseById, getExercisesByMuscleGroup, searchExercises } from "../controllers/exerciseController";
import { authenticateJWT } from "../middlewares/authenticateJWT";
const router = Router();

router.get('/', authenticateJWT,getAllExercises);

router.get('/category/:category', authenticateJWT,getExerciseByCategory);
router.get('/muscleGroup/:muscleGroup', authenticateJWT, getExercisesByMuscleGroup);
router.get("/search", authenticateJWT, searchExercises); //Query param e.g /search?query=bench
router.get("/:id", authenticateJWT, getExerciseById);


export default router; 