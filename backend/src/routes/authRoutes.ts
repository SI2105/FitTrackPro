/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints for user registration and login
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 *       409:
 *         description: Account with the supplied email already exists
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns authentication token
 *       400:
 *         description: Invalid input or fields are missing
 *       401:
 *         description: Invalid credentials
 */
/**
 * @swagger
 * /me:
 *   post:
 *     summary: Get the current authenticated user's details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the authenticated user's details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 */

import { Router } from "express";
import { getCurrentUser, loginUser, registerUser } from "../controllers/authController";
import { authenticateJWT } from "../middlewares/authenticateJWT"; 


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/me',authenticateJWT, getCurrentUser)
export default router; 