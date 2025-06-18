import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";



const prisma = new PrismaClient();
export const createWorkout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const { name, notes, scheduledAt } = req.body;
        const userId : number|undefined = req.user_id;

        if (!userId || !name) {
            res.status(400).json({ message: "Missing user ID or workout name" });
            return; 
        }

        const workout = await prisma.workout.create({
            data: {
                name,
                notes,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined, //undefined means it wasn't scheduled but added
                userId,
            },
        });

        res.status(201).json(workout);
    }
    catch(error){
        next(error);
    } 
}

export const getUserWorkouts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const userId = req.user_id;
        if (!userId) {
            res.status(400).json({ message: "Missing user ID" });
            return;
        }

        const workouts = await prisma.workout.findMany({
        where: { userId },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });

        res.status(200).json(workouts);
        
    }
    catch(error){
        next(error);
    } 
}


export const getWorkoutById = async (
    req: Request, 
    res: Response, 
    next: NextFunction

) => {
    
    try{
        const workoutId = parseInt(req.params.id);
        const userId = req.user_id;

        const workout = await prisma.workout.findFirst({
            where: {
                id: workoutId,
                userId,
            },
            include: {
                exercises: {
                    include: {
                        exercise: true,
                    },
                },
            },
        });

        if (!workout) {
        
            res.status(404).json({ message: "Workout not found" });
            return;
        }

        res.status(200).json(workout);
    }
    
    
    catch (error) {
        next(error);
    }
};

export const updateWorkout = async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        const workoutId = parseInt(req.params.id);
        const userId = req.user_id;
        const { name, notes, scheduledAt } = req.body;

        if (!name && !notes && !scheduledAt){
            res.status(400).json({message: "Empty Update Error: At least one field should be included in update"})
            return;
        }

        const workout = await prisma.workout.updateManyAndReturn({
            where: {
                id: workoutId,
                userId,
            },
            data: {
                name,
                notes,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
            },
        });

        if (workout.length === 0) {
            res.status(404).json({ message: "Workout not found or does not belong to user" });
            return;
        }

        res.status(200).json(workout[0]);
    } catch (error) {
        next(error);
    }
};

export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workoutId = parseInt(req.params.id);
        const userId = req.user_id;

        const deleted = await prisma.workout.deleteMany({
            where: {
                id: workoutId,
                userId,
            },
        });

        if (deleted.count === 0) {
            res.status(404).json({ message: "Workout not found or does not belong to user" });
            return;
        }

        res.status(200).json({ message: "Workout deleted" });
    } catch (error) {
        next(error);
    }
};


