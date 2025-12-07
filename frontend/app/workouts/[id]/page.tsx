'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { workoutsApi } from '@/lib/api';
import { Workout } from '@/types';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  Edit2, 
  Trash2,
  Plus,
  Activity,
  Target,
  Dumbbell
} from 'lucide-react';

interface WorkoutDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const resolvedParams = await params;
        const workoutId = parseInt(resolvedParams.id);
        const data = await workoutsApi.getById(workoutId);
        setWorkout(data);
      } catch (err) {
        console.error('Failed to load workout:', err);
        setError('Failed to load workout');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkout();
  }, [params]);

  const handleDelete = async () => {
    if (!workout) return;
    
    try {
      await workoutsApi.delete(workout.id);
      router.push('/workouts');
    } catch (err) {
      console.error('Failed to delete workout:', err);
      setError('Failed to delete workout');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'strength':
        return Dumbbell;
      case 'aerobic':
        return Activity;
      case 'flexibility':
        return Target;
      default:
        return Activity;
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="text-lg">Loading workout...</div>
        </div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center py-8">
          <div className="text-red-600">{error || 'Workout not found'}</div>
          <Link
            href="/workouts"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Workouts
          </Link>
        </div>
      </div>
    );
  }

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
        
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              {workout.name}
            </h1>
            <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Created {formatDate(workout.createdAt)}
              </span>
              
              {workout.scheduledAt && (
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Scheduled for {formatDateTime(workout.scheduledAt)}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workout Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Workout Details</h2>
            
            {workout.notes && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Notes</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{workout.notes}</p>
              </div>
            )}

            {workout.scheduledAt && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Scheduled Time</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">{formatDateTime(workout.scheduledAt)}</p>
              </div>
            )}
          </div>

          {/* Exercises */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Exercises</h2>
              <button className="">
                <Link
                    href={`/workouts/${workout.id}/add-exercise`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                  Add Exercise
                    </Link>
                
              </button>
            </div>

            {workout.exercises && workout.exercises.length > 0 ? (
              <div className="space-y-4">
                {workout.exercises.map((workoutExercise) => {
                  const CategoryIcon = getCategoryIcon(workoutExercise.exercise.category);
                  
                  return (
                    <div key={workoutExercise.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <CategoryIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">
                              {workoutExercise.exercise.name}
                            </h3>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3">
                            {workoutExercise.exercise.description}
                          </p>

                          {/* Exercise Details */}
                          <div className="space-y-2">
                            {workoutExercise.strength && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Strength: </span>
                                <span className="text-gray-600">
                                  {workoutExercise.strength.sets} sets × {workoutExercise.strength.reps} reps @ {workoutExercise.strength.weight}kg
                                </span>
                              </div>
                            )}
                            
                            {workoutExercise.aerobic && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Aerobic: </span>
                                <span className="text-gray-600">
                                  {Math.floor(workoutExercise.aerobic.duration / 60)}:{(workoutExercise.aerobic.duration % 60).toString().padStart(2, '0')} minutes, {workoutExercise.aerobic.distance}km
                                </span>
                              </div>
                            )}
                            
                            {workoutExercise.flexibility && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Flexibility: </span>
                                <span className="text-gray-600">
                                  {workoutExercise.flexibility.sets} sets × {workoutExercise.flexibility.reps} reps
                                </span>
                              </div>
                            )}

                            {workoutExercise.comment && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Comment: </span>
                                <span className="text-gray-600">{workoutExercise.comment}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="text-indigo-600 hover:text-indigo-700">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No exercises yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add exercises to build your workout plan.
                </p>
                <div className="mt-6">
                    <Link
                    href={`/workouts/${workout.id}/add-exercise`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Exercise
                    </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Workout Summary</h3>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Exercises</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {workout.exercises?.length || 0}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  {workout.scheduledAt ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Scheduled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Draft
                    </span>
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{formatDate(workout.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Workout</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete &quot;{workout.name}&quot;? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}