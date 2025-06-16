// src/types/express/index.d.ts
import {  Exercise } from '../../../generated/prisma'

export type StrengthExercise = Omit<Exercise, 'Duration' | 'Distance'> & { type: 'strength' }
export type AerobicExercise = Omit<Exercise, 'Sets' | 'Reps' | 'Weight'> & { type: 'aerobic' }
export type FlexibilityExercise = Omit<Exercise, 'Sets' | 'Reps' > & { type: 'flexibility' }

export{};

declare global {
  namespace Express {
    export interface Request {
      user_id?: number
    }
  }
}
