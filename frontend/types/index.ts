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
  workoutId: number;
  exerciseId: number;
  comment?: string;
  strength?: StrengthWorkoutExercise;
  aerobic?: AerobicWorkoutExercise;
  flexibility?: FlexibilityWorkoutExercise;
  exercise: Exercise;
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

export interface ApiError {
  message: string;
  error?: string;
}