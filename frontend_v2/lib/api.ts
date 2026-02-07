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

// ...existing code...

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(path: string, method: HttpMethod, body?: unknown): Promise<T> {
  const token = Cookies.get('token');

  const res = await fetch(`${API_BASE_URL}/api/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const statusCode = res.status;

    if (statusCode === 403) {
      Cookies.remove('token');
      window.location.href = '/auth/login';
    }

    const message = errorData?.message || `Error ${statusCode}`;
    throw new Error(message);
  }

  return res.json();
}

// Auth API
export const authApi = {
  register: async (email: string, name: string, password: string): Promise<{ message: string }> =>
    request('/register', 'POST', { email, name, password }),

  login: async (email: string, password: string): Promise<AuthResponse> =>
    request('/login', 'POST', { email, password }),

  me: async (): Promise<UserResponse> =>
    request('/me', 'POST'),
};

// Exercises API
export const exercisesApi = {
  getAll: async (): Promise<Exercise[]> =>
    request('/exercises', 'GET'),

  getById: async (id: number): Promise<Exercise> =>
    request(`/exercises/${id}`, 'GET'),

  getByCategory: async (category: ExerciseCategory): Promise<Exercise[]> =>
    request(`/exercises/category/${category}`, 'GET'),

  getByMuscleGroup: async (muscleGroup: MuscleGroup): Promise<Exercise[]> =>
    request(`/exercises/muscle-group/${muscleGroup}`, 'GET'),

  search: async (query: string): Promise<Exercise[]> =>
    request(`/exercises/search?query=${encodeURIComponent(query)}`, 'GET'),
};

// Workouts API
export const workoutsApi = {
  getAll: async (): Promise<Workout[]> =>
    request('/workouts', 'GET'),

  getById: async (id: number): Promise<Workout> =>
    request(`/workouts/${id}`, 'GET'),

  create: async (workout: Partial<Workout>): Promise<Workout> =>
    request('/workouts', 'POST', workout),

  update: async (id: number, workout: Partial<Workout>): Promise<Workout> =>
    request(`/workouts/${id}`, 'PUT', workout),

  delete: async (id: number): Promise<{ message: string }> =>
    request(`/workouts/${id}`, 'DELETE'),
};

// Workout Exercises API
export const workoutExercisesApi = {
  create: async (id: number, workoutExercise: Partial<WorkoutExercise>): Promise<WorkoutExercise> =>
    request(`/workoutexercises/${id}/exercises`, 'POST', workoutExercise),

  get: async (id: number): Promise<WorkoutExercise> =>
    request(`/workoutexercises/${id}/exercises`, 'GET'),

  update: async (id: number, workoutExercise: Partial<WorkoutExercise>): Promise<WorkoutExercise> =>
    request(`/workoutexercises/${id}`, 'PUT', workoutExercise),

  delete: async (id: number): Promise<{ message: string }> =>
    request(`/workoutexercises/${id}`, 'DELETE'),
};

export default { authApi, exercisesApi, workoutsApi, workoutExercisesApi };