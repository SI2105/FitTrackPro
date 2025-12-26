import { AxiosHeaders } from "axios";

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ExerciseCategory = 'strength' | 'aerobic' | 'flexibility';

export type MuscleGroup = 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'glutes';

export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: ExerciseCategory;
  muscleGroups: MuscleGroup[];
}

export interface Workout {
  id: number;
  userId: number;
  name: string;
  notes?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: number;
  comment: string;
  exercise: Exercise;
  sets: number;
  reps: number;
  weight: number;
  duration: number; // seconds
  distance: number; // km/miles
}

export interface StrengthWorkoutExercise {
  id: number;
  sets: number;
  reps: number;
  weight: number;
  
}

export interface FlexibilityWorkoutExercise {
  id: number;
  sets: number;
  reps: number;
}

export interface AerobicWorkoutExercise {
  id: number;
  duration: number; // seconds
  distance: number; // km/miles
}

export interface AuthResponse {
  token: string;
}

export interface UserResponse{
  name: string;
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  
}
export interface errorResponse{
  config: object
  data: {message: string}
  status: number
  statusText: string
}

export interface ApiError {
  message: string;
  error?: string;
}