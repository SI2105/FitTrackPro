import request from 'supertest';
import app from '../src/app';
import { PrismaClient, ExerciseCategory } from '../generated/prisma';

const prisma = new PrismaClient();
let token: string;
let workoutId: number;
let strengthExerciseId: number;
let flexibilityExerciseId: number;  

beforeAll(async () => {
  await prisma.strengthWorkoutExercise.deleteMany();
  await prisma.flexibilityWorkoutExercise.deleteMany();
  await prisma.aerobicWorkoutExercise.deleteMany();
  await prisma.workoutExercise.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.user.deleteMany();

  // Seed user
  await request(app).post('/api/v1/register').send({
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
  });

  const loginRes = await request(app).post('/api/v1/login').send({
    email: 'test@example.com',
    password: 'password123',
  });
  token = loginRes.body.token;

  // Seed workout
  const workoutRes = await request(app)
    .post('/api/v1/workouts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Test Workout',
      notes: 'Test notes',
    });

  workoutId = workoutRes.body.id;

  // Seed exercise
  const strength = await prisma.exercise.create({
    data: {
      name: 'Bench Press',
      description: "A chest-strengthening exercise using a barbell or dumbbells.",
      category: ExerciseCategory.strength,
    },
  });

  const flexibility = await prisma.exercise.create({
    data: {
      name: 'Hamstring Stretch',
      description: "A static stretch for hamstring muscles.",
      category: ExerciseCategory.flexibility,
    },
  });

  flexibilityExerciseId = flexibility.id;

  strengthExerciseId = strength.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('WorkoutExercise API', () => {
  let workoutExerciseId: number;

  it('Add a strength exercise to the workout successfully', async () => {
    const res = await request(app)
      .post(`/api/v1/workoutexercises/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        exerciseId: strengthExerciseId,
        sets: 4,
        reps: 10,
        weight: 100,
        comment: 'Warm-up',
      });

    console.log(res.body.errors)
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.category).toBe('strength');
    
    workoutExerciseId = res.body.id;
  });

  it('Add a strength exercise to the workout unsuccessfully(No sets, reps, weight)', async () => {
    const res = await request(app)
      .post(`/api/v1/workoutexercises/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        exerciseId: flexibilityExerciseId,
        // missing sets, reps, weight
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toContain('Flexibility exercises must include sets and reps.');
  });

  it('should fetch all exercises in the workout', async () => {
    const res = await request(app)
      .get(`/api/v1/workoutexercises/${workoutId}/exercises`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('exercise');
    expect(res.body[0].exercise.name).toBe('Bench Press');
  });

  it('should update a workout exercise', async () => {
    const res = await request(app)
      .put(`/api/v1/workoutexercises/${workoutId}/exercises/${workoutExerciseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        sets: 5,
        reps: 12,
        weight: 110,
        comment: 'Updated set',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('WorkoutExercise updated.');
  });

  it('should delete the workout exercise', async () => {
    const res = await request(app)
      .delete(`/api/v1/workoutexercises/${workoutId}/exercises/${workoutExerciseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  it('should return 404 when updating non-existent workoutExercise', async () => {
    const res = await request(app)
      .put(`/api/v1/workoutexercises/${workoutId}/exercises/99999`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        sets: 3,
        reps: 10,
        weight: 80,
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('WorkoutExercise not found');
  });
});
