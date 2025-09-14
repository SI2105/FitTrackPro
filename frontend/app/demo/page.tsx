'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Activity, Target } from 'lucide-react';

// Mock data for demonstration
const mockWorkouts = [
  {
    id: 1,
    name: 'Morning Cardio Session',
    notes: 'High intensity interval training',
    scheduledAt: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-10T08:00:00Z',
    exercises: [
      { id: 1, exerciseId: 1, exercise: { name: 'Running', category: 'aerobic' } },
      { id: 2, exerciseId: 2, exercise: { name: 'Jumping Jacks', category: 'aerobic' } }
    ]
  },
  {
    id: 2,
    name: 'Upper Body Strength',
    notes: 'Focus on chest and shoulders',
    createdAt: '2024-01-08T10:00:00Z',
    exercises: [
      { id: 3, exerciseId: 3, exercise: { name: 'Push-ups', category: 'strength' } },
      { id: 4, exerciseId: 4, exercise: { name: 'Bench Press', category: 'strength' } }
    ]
  },
  {
    id: 3,
    name: 'Flexibility & Stretching',
    createdAt: '2024-01-05T18:00:00Z',
    exercises: [
      { id: 5, exerciseId: 5, exercise: { name: 'Yoga Flow', category: 'flexibility' } }
    ]
  }
];

export default function DashboardPage() {
  const [workouts] = useState(mockWorkouts);
  const [isLoading] = useState(false);
  const [error] = useState('');

  const recentWorkouts = workouts.slice(0, 5);
  const upcomingWorkouts = workouts
    .filter(w => w.scheduledAt && new Date(w.scheduledAt) > new Date())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Activity className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">FitTrackPro</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/workouts"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Workouts
                </Link>
                <Link
                  href="/exercises"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Exercises
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                      <dd className="text-lg font-medium text-gray-900">2</dd>
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
                      <dd className="text-lg font-medium text-gray-900">3</dd>
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
      </main>
    </div>
  );
}