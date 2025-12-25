import axios from 'axios';
import Cookies from 'js-cookie';
import type { 
  Exercise, 
  Workout, 
  WorkoutExercise,
  AuthResponse,
  ExerciseCategory,
  MuscleGroup, 
  UserResponse
} from '@/types';
import { email } from 'zod';


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
//source: https://dev.to/shieldstring/how-to-use-axios-interceptors-to-handle-api-error-responses-2gn1
//modified to handle token 
api.interceptors.response.use(
  (response) => {
    // If the response is successful (status code 2xx), return the response data
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with a status code out of 2xx range
      const statusCode = error.response.status;
      const errorMessage = error.response.data.message || 'An error occurred';

      // Handle different status codes accordingly
      if (statusCode === 403) {
         // Clear token from cookies
        Cookies.remove('token');
        
        window.location.href = '/auth/login'
        
      } 
       else {
        // Handle other types of errors
        console.log(`Error ${statusCode}: ${errorMessage}`);
      }
    } else if (error.request) {
      // No response received (network error, timeout, etc.)
      console.log('Network error - check your internet connection');
    } else {
      // Something else happened during the request
      console.log('Request error:', error.message);
    }

    // Optionally, return a rejected promise to ensure `.catch` is triggered in individual requests
    return Promise.reject(error);
  }
);

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

  me: async (): Promise<UserResponse> =>{
    const response = await api.post('/me')
    return response.data;
  } 
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
  create: async (id: number, workoutExercise: Partial<WorkoutExercise>): Promise<WorkoutExercise> => {
    const response = await api.post(`/workoutexercises/${id}/exercises`, workoutExercise);
    return response.data;
  },
  
  get: async (id: number): Promise<WorkoutExercise> => {
    const response = await api.get(`/workoutexercises/${id}/exercises`);
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