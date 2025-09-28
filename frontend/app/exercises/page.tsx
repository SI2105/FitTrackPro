'use client';

import { useState, useEffect } from 'react';
import { exercisesApi } from '@/lib/api';
import { Exercise, ExerciseCategory, MuscleGroup } from '@/types';
import { Search, Filter, Activity, Target, Dumbbell } from 'lucide-react';

const categories: { value: ExerciseCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'strength', label: 'Strength', icon: Dumbbell },
  { value: 'aerobic', label: 'Aerobic', icon: Activity },
  { value: 'flexibility', label: 'Flexibility', icon: Target },
];

const muscleGroups: { value: MuscleGroup; label: string }[] = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'core', label: 'Core' },
  { value: 'glutes', label: 'Glutes' },
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'all'>('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | 'all'>('all');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesApi.getAll();
        setExercises(data);
        setFilteredExercises(data);
      } catch (err) {
        console.error('Failed to load exercises:', err);
        setError('Failed to load exercises');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
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
  }, [exercises, searchQuery, selectedCategory, selectedMuscleGroup]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const data = await exercisesApi.search(searchQuery);
      setFilteredExercises(data);
    } catch (err) {
      console.error('Failed to search exercises:', err);
      setError('Failed to search exercises');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              onChange={(e) => setSelectedCategory(e.target.value as ExerciseCategory | 'all')}
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
              onChange={(e) => setSelectedMuscleGroup(e.target.value as MuscleGroup | 'all')}
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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-lg">Loading exercises...</div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600">{error}</div>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No exercises found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or filters.
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}