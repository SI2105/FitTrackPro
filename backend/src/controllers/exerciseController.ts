import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";



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


