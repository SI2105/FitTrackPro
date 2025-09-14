'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { workoutsApi } from '@/lib/api';
import { Workout } from '@/types';
import { Plus, Calendar, Clock, Edit2, Trash2, FileText } from 'lucide-react';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await workoutsApi.getAll();
        setWorkouts(data);
      } catch (err) {
        console.error('Failed to load workouts:', err);
        setError('Failed to load workouts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await workoutsApi.delete(id);
      setWorkouts(workouts.filter(w => w.id !== id));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete workout:', err);
      setError('Failed to delete workout');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            My Workouts
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your workout plans and track your progress.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/workouts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Workout
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Workouts List */}
      <div className="bg-white shadow rounded-lg">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-lg">Loading workouts...</div>
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first workout plan.
            </p>
            <div className="mt-6">
              <Link
                href="/workouts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Workout
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {workouts.map((workout) => (
              <div key={workout.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {workout.name}
                      </h3>
                      {workout.scheduledAt && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Scheduled
                        </span>
                      )}
                    </div>
                    
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

                      {workout.exercises && workout.exercises.length > 0 && (
                        <span>
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {workout.notes && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <FileText className="h-4 w-4 mr-1" />
                        <p className="truncate">{workout.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    
                    <button
                      onClick={() => setDeleteId(workout.id)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Workout</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this workout? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 px-4 py-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
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