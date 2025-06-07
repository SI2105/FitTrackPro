import { Router } from "express";
import { getAllExercises } from "../controllers/exerciseController";
import { authenticateJWT } from "../middlewares/authenticateJWT";
const router = Router();

router.get('/', authenticateJWT,getAllExercises);

export default router; 