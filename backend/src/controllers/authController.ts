import { Request, Response, NextFunction } from "express";

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        res.json({message: "Still working on this mate"})
    }
    catch(error){
        next(error);
    } 
}
