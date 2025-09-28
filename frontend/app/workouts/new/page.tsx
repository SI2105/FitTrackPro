'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { workoutsApi } from '@/lib/api';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';

const workoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  notes: z.string().optional(),
  scheduledAt: z.string().optional(),
});

type WorkoutForm = z.infer<typeof workoutSchema>;

export default function NewWorkoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutForm>({
    resolver: zodResolver(workoutSchema),
  });

  const onSubmit = async (data: WorkoutForm) => {
    setIsLoading(true);
    setError('');

    try {
      const workoutData = {
        name: data.name,
        notes: data.notes || undefined,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString() : undefined,
      };

      const newWorkout = await workoutsApi.create(workoutData);
      router.push(`/workouts/${newWorkout.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to create workout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/workouts"
          className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Workouts
        </Link>
        
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
          Create New Workout
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Plan your next workout session with exercises and scheduling.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* Workout Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Workout Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('name')}
                type="text"
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., Morning Cardio, Upper Body Strength"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Scheduled Date/Time */}
          <div>
            <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
              Schedule Date & Time (Optional)
            </label>
            <div className="mt-1">
              <input
                {...register('scheduledAt')}
                type="datetime-local"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to create an unscheduled workout.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes (Optional)
            </label>
            <div className="mt-1 relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                {...register('notes')}
                rows={4}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Add any notes about this workout session..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Link
              href="/workouts"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Workout'}
            </button>
          </div>
        </form>
      </div>

      {/* Next Steps Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              What&apos;s next?
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                After creating your workout, you&apos;ll be able to add exercises, set repetitions, weights, and track your progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}