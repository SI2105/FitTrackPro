import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../config/config"

const prisma = new PrismaClient();
export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const {email,name, password} = req.body;
        
        if(!email || !name || !password ){
          res.status(400).json({"message":"Email, Name or Password fields are missing"});
          return;
        }

        const existing = await prisma.user.findFirst({
          where: {
            email: email,
          }
        });

        if(existing){
          res.status(409).json({"message": "Account with this email already exists" })
          // or 409 if you handle duplicate error explicitly
          return;
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPassword
            }
        })
        res.status(201).json({"message": "User created successfully"});
    }
    catch(error){
        next(error);
    } 
}


export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {email, password} = req.body;
    if(!email || !password ){
          res.status(400).json({"message":"Email or Password fields are missing"});
          return;
        }
    
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    })

    if(!user){
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Authentication failed' });
      return;
    }
   
    const token = jwt.sign({ user_id: user.id }, config.secret, {
    expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};