'use client';

import { useState } from 'react';
import { Search, Filter, Activity, Target, Dumbbell } from 'lucide-react';

const categories = [
  { value: 'strength', label: 'Strength', icon: Dumbbell },
  { value: 'aerobic', label: 'Aerobic', icon: Activity },
  { value: 'flexibility', label: 'Flexibility', icon: Target },
];

const muscleGroups = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'core', label: 'Core' },
  { value: 'glutes', label: 'Glutes' },
];

// Mock exercise data
const mockExercises = [
  {
    id: 1,
    name: 'Push-ups',
    description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps',
    category: 'strength',
    muscleGroups: ['chest', 'arms', 'shoulders']
  },
  {
    id: 2,
    name: 'Running',
    description: 'Cardiovascular exercise for endurance and leg strength',
    category: 'aerobic',
    muscleGroups: ['legs', 'core']
  },
  {
    id: 3,
    name: 'Yoga Flow',
    description: 'Dynamic stretching sequence to improve flexibility and balance',
    category: 'flexibility',
    muscleGroups: ['core', 'legs', 'arms']
  },
  {
    id: 4,
    name: 'Bench Press',
    description: 'Compound strength exercise for chest and triceps development',
    category: 'strength',
    muscleGroups: ['chest', 'arms', 'shoulders']
  },
  {
    id: 5,
    name: 'Squats',
    description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings',
    category: 'strength',
    muscleGroups: ['legs', 'glutes', 'core']
  },
  {
    id: 6,
    name: 'Cycling',
    description: 'Low-impact cardio exercise great for leg strength and endurance',
    category: 'aerobic',
    muscleGroups: ['legs', 'glutes']
  },
  {
    id: 7,
    name: 'Plank Hold',
    description: 'Isometric core exercise for building stability and strength',
    category: 'strength',
    muscleGroups: ['core', 'shoulders']
  },
  {
    id: 8,
    name: 'Hamstring Stretch',
    description: 'Static stretch to improve hamstring flexibility and reduce tightness',
    category: 'flexibility',
    muscleGroups: ['legs']
  }
];

export default function ExercisesDemo() {
  const [exercises] = useState(mockExercises);
  const [filteredExercises, setFilteredExercises] = useState(mockExercises);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');

  const handleSearch = () => {
    let filtered = exercises;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    // Filter by muscle group
    if (selectedMuscleGroup !== 'all') {
      filtered = filtered.filter(exercise => exercise.muscleGroups.includes(selectedMuscleGroup));
    }

    setFilteredExercises(filtered);
  };

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
                <a
                  href="/demo"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                >
                  Workouts
                </a>
                <a
                  href="/demo-exercises"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
                >
                  Exercises
                </a>
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Exercise Library
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse and search through our comprehensive exercise database.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search exercises..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Search
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters:</span>
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>

                {/* Muscle Group Filter */}
                <select
                  value={selectedMuscleGroup}
                  onChange={(e) => setSelectedMuscleGroup(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Muscle Groups</option>
                  {muscleGroups.map((group) => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>

                {/* Clear Filters */}
                {(selectedCategory !== 'all' || selectedMuscleGroup !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedMuscleGroup('all');
                      setSearchQuery('');
                      setFilteredExercises(exercises);
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((exercise) => {
                  const categoryData = categories.find(c => c.value === exercise.category);
                  const CategoryIcon = categoryData?.icon || Activity;
                  
                  return (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{exercise.name}</h3>
                        <CategoryIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Category:</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {categoryData?.label || exercise.category}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Muscle Groups:</span>
                          <div className="flex flex-wrap gap-1">
                            {exercise.muscleGroups.map((group) => (
                              <span
                                key={group}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {muscleGroups.find(mg => mg.value === group)?.label || group}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}