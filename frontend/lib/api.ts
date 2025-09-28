import axios from 'axios';
import Cookies from 'js-cookie';
import type { 
  Exercise, 
  Workout, 
  WorkoutExercise,
  AuthResponse,
  ExerciseCategory,
  MuscleGroup 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (email: string, name: string, password: string): Promise<{ message: string }> => {
    const response = await api.post('/register', { email, name, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
};

// Exercises API
export const exercisesApi = {
  getAll: async (): Promise<Exercise[]> => {
    const response = await api.get('/exercises');
    return response.data;
  },

  getById: async (id: number): Promise<Exercise> => {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  getByCategory: async (category: ExerciseCategory): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/category/${category}`);
    return response.data;
  },

  getByMuscleGroup: async (muscleGroup: MuscleGroup): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/muscle-group/${muscleGroup}`);
    return response.data;
  },

  search: async (query: string): Promise<Exercise[]> => {
    const response = await api.get(`/exercises/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Workouts API
export const workoutsApi = {
  getAll: async (): Promise<Workout[]> => {
    const response = await api.get('/workouts');
    return response.data;
  },

  getById: async (id: number): Promise<Workout> => {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  create: async (workout: Partial<Workout>): Promise<Workout> => {
    const response = await api.post('/workouts', workout);
    return response.data;
  },

  update: async (id: number, workout: Partial<Workout>): Promise<Workout> => {
    const response = await api.put(`/workouts/${id}`, workout);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/workouts/${id}`);
    return response.data;
  },
};

// Workout Exercises API
export const workoutExercisesApi = {
  create: async (workoutExercise: Partial<WorkoutExercise>): Promise<WorkoutExercise> => {
    const response = await api.post('/workoutexercises', workoutExercise);
    return response.data;
  },

  update: async (id: number, workoutExercise: Partial<WorkoutExercise>): Promise<WorkoutExercise> => {
    const response = await api.put(`/workoutexercises/${id}`, workoutExercise);
    return response.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/workoutexercises/${id}`);
    return response.data;
  },
};

export default api;