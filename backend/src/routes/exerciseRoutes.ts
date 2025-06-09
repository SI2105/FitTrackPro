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