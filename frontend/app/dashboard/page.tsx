'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { workoutsApi } from '@/lib/api';
import { Workout } from '@/types';
import { Plus, Calendar, Activity, Target } from 'lucide-react';

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  const recentWorkouts = workouts.slice(0, 5);
  const upcomingWorkouts = workouts
    .filter(w => w.scheduledAt && new Date(w.scheduledAt) > new Date())
    .slice(0, 3);

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here&apos;s your fitness overview.
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Workouts
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {workouts.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Week
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {workouts.filter(w => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(w.createdAt) > weekAgo;
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {upcomingWorkouts.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {workouts.filter(w => {
                      const monthAgo = new Date();
                      monthAgo.setMonth(monthAgo.getMonth() - 1);
                      return new Date(w.createdAt) > monthAgo;
                    }).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Workouts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Workouts
            </h3>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">{error}</div>
            ) : recentWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first workout.
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
              <div className="space-y-3">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{workout.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                ))}
                <div className="mt-4">
                  <Link
                    href="/workouts"
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View all workouts →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upcoming Workouts
            </h3>
            {upcomingWorkouts.length === 0 ? (
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming workouts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Schedule your next workout to stay on track.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingWorkouts.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{workout.name}</h4>
                      <p className="text-sm text-gray-500">
                        {workout.scheduledAt && new Date(workout.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}