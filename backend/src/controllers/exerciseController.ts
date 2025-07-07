import { Request, Response, NextFunction } from "express";

import { exerciseService } from "../services/exerciseService";



export const getAllExercises = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const exercises = await exerciseService.getAllExercises();
        res.status(201).json(exercises);
    } catch (error) {
        next(error);
    }
};

export const getExerciseByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { category } = req.params;
        const exercises = await exerciseService.getExerciseByCategory(category);
        res.status(200).json(exercises);
    } catch (error: unknown) {
        if (error instanceof Error){
            if (error.message === "Invalid Category") {
            res.status(400).json({ message: error.message });
            } 
        }   
        else {
            next(error);
        }
    }
};

export const getExercisesByMuscleGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { muscleGroup } = req.params;
        const exercises = await exerciseService.getExercisesByMuscleGroup(muscleGroup);
        res.status(200).json(exercises);
    } catch (error: unknown) {
        if (error instanceof Error){
            if (error.message === "Invalid Muscle Group") {
                res.status(400).json({ message: error.message });
            } 
        }   
        else {
            next(error);
        }
    }
};

export const searchExercises = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { query } = req.query;
        const exercises = await exerciseService.searchExercises(String(query));
        res.status(200).json(exercises);
    } catch (error: unknown) {
        if( error instanceof Error){
            if (error.message === "No query parameter was passed") {
                res.status(400).json({ error: error.message });
            } 
        }
        else {
            next(error);
        }
    }
};

export const getExerciseById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;
        const exercise = await exerciseService.getExerciseById(Number(id));
        res.status(200).json(exercise);
    } catch (error: unknown) {
        if (error instanceof Error){
            
            if (error.message === "Exercise not found") {
                res.status(404).json({ message: error.message });
            } 
        }
        else {
            next(error);
        }
    }
};
