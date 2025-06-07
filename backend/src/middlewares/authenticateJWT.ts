import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
     const header = req.header('Authorization');

     const token = header && header.split(' ')[1];
     
    if (!token){
        res.status(401).json({ error: 'Access denied' });
        return;
     } 
     try {
        const decoded = jwt.verify(token, config.secret) as JwtPayload;
        
        req.user_id = decoded.user_id;
      
        next();
        } 
        catch (error) {
            next(error);
        }

}