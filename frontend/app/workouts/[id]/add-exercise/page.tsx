'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { workoutsApi, exercisesApi, workoutExercisesApi } from '@/lib/api';
import Link from 'next/link';
import { Plus, ArrowLeft } from 'lucide-react';

export default function AddExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  // @ts-ignore
  const workoutId = use(params).id; /* This is to avoid accessing params.id directly which is being deprecated, currently TS compiler does not handle this well */
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [category, setCategory] = useState('');
  const [form, setForm] = useState({ sets: '', reps: '', weight: '', duration: '', distance: '', comment: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exercisesApi.getAll();
        setExercises(data);
      } catch (err) {
        setError('Failed to load exercises');
      }
    };
    fetchExercises();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleExerciseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedExerciseId(val);
    // reset form when exercise changes
    setForm({ sets: '', reps: '', weight: '', duration: '', distance: '', comment: '' });
    if (!val) {
      setCategory('');
      return;
    }
    const id = Number(val);
    const found = exercises.find((ex: any) => ex.id === id || String(ex.id) === val);
    if (found && found.category) {
      setCategory(found.category);
    } else {
      setCategory('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload: any = {
        exerciseId: parseInt(selectedExerciseId),
      };
  // Add category derived from selected exercise
  if (category) payload.category = category;
  // Only add fields that are filled and relevant
      if (form.sets) payload.sets = Number(form.sets);
      if (form.reps) payload.reps = Number(form.reps);
      if (form.weight) payload.weight = Number(form.weight);
      if (form.duration) payload.duration = Number(form.duration);
      if (form.distance) payload.distance = Number(form.distance);
      if (form.comment) payload.comment = form.comment;
      await workoutExercisesApi.create(workoutId, payload);
      router.push(`/workouts/${workoutId}`);
    } catch (err) {
      setError('Failed to add exercise');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href={`/workouts/${workoutId}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Workout
      </Link>
      <h1 className="text-2xl font-bold mb-6">Add Exercise to Workout</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
          <select
            name="exerciseId"
            value={selectedExerciseId}
            onChange={handleExerciseSelect}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select an exercise</option>
            {exercises.map((ex: any) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="w-full border rounded px-3 py-2 text-gray-700">{category ? capitaliseFirstChar(category) : 'Select an exercise to determine category'}</div>
        </div>
        {category === 'strength' && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
              <input type="number" name="sets" value={form.sets} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
              <input type="number" name="reps" value={form.reps} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" name="weight" value={form.weight} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
        )}
        {category === 'aerobic' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
              <input type="number" name="distance" value={form.distance} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
        )}
        {category === 'flexibility' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
              <input type="number" name="sets" value={form.sets} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
              <input type="number" name="reps" value={form.reps} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional)</label>
          <textarea name="comment" value={form.comment} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={2} />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          {loading ? 'Adding...' : 'Add Exercise'}
        </button>
      </form>
    </div>
  );
}

function capitaliseFirstChar(string: String){
  return string.charAt(0).toUpperCase() + string.slice(1)
  
}
