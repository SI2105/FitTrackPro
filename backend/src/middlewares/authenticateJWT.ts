/* eslint-disable  @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import jwt, { JwtPayload } from "jsonwebtoken";


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
     
     try {
        const header = req.header('Authorization');

        const token = header && header.split(' ')[1];
        
        if (!token){
            res.status(401).json({ error: 'Access denied' });
            return;
        } 
    
        const decoded = jwt.verify(token, config.secret) as JwtPayload;

        req.user_id = decoded.user_id;

      
        next();
        } 
        catch (error:any) {

            if (error.name === "TokenExpiredError") {
                
                res.status(401).json({ error: "Token expired" });
                return;
            }

            else if (error.name === "JsonWebTokenError"){
                res.status(401).json({ error: "Invalid Token" });
                return;
            }
            

            next(error);
        }

}