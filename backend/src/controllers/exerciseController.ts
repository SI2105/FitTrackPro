import { Request, Response, NextFunction } from "express";
import { ExerciseCategory, MuscleGroup, PrismaClient } from "../../generated/prisma";



const prisma = new PrismaClient();
export const getAllExercises = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const exercises = await prisma.exercise.findMany();
        res.status(201).json(exercises);
    }
    catch(error){
        next(error);
    } 
}

export const getExerciseByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        let { category } = req.params;

        category = category.toLowerCase();

         //Handling invalid category passed as param
        if (!Object.values(ExerciseCategory).includes(category as ExerciseCategory)){
            res.status(400).json({message: "Invalid Category"})
            return;
        }

        const exercises = await prisma.exercise.findMany({
            where: {
                     category: category as ExerciseCategory ,
            }
        });
        
        res.status(200).json(exercises);
        
    }
    catch(error){
        next(error);
    } 
}


export const getExercisesByMuscleGroup = async (
    req: Request, 
    res: Response, 
    next: NextFunction

) => {
    
    try {
        let { muscleGroup } = req.params;

        muscleGroup = muscleGroup.toLowerCase();

        if(!Object.values(MuscleGroup).includes(muscleGroup as MuscleGroup)){
            res.status(400).json({message: "Invalid Muscle Group"})
            return;
        }
        const exercises = await prisma.exercise.findMany({
            where: {
                muscleGroups: {
                    has: muscleGroup as MuscleGroup,
                },
            },
        });
        res.status(200).json(exercises);
    } catch (error) {
        next(error);
    }
};

export const searchExercises = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const { query } = req.query;
        if(!query){
            res.status(400).json({error: 'No query parameter was passed'})
            return;
        }
        const exercises = await prisma.exercise.findMany({
            where: {
                name: {
                    contains: String(query),
                    mode: "insensitive",
                },
            },
        });
        res.status(200).json(exercises);
    } catch (error) {
        next(error);
    }
};

export const getExerciseById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const exercise = await prisma.exercise.findUnique({
            where: { id: Number(id) },
        });
        if (!exercise) {
           res.status(404).json({ message: 'Exercise not found' });
           return 
        }
        res.status(200).json(exercise);
    } catch (error) {
        next(error);
    }
};


