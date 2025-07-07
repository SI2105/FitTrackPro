import request from 'supertest';
import app from '../src/app';
import { PrismaClient, ExerciseCategory, MuscleGroup, Exercise } from '../generated/prisma';

const prisma = new PrismaClient();
let token: string;

const exercises = [
  {
    name: 'Bench Press',
    description: 'A chest-strengthening exercise using a barbell or dumbbells.',
    category: ExerciseCategory.strength,
    muscleGroups: [MuscleGroup.chest, MuscleGroup.arms, MuscleGroup.shoulders],
  },
  {
    name: 'Running',
    description: 'Aerobic cardiovascular endurance activity.',
    category: ExerciseCategory.aerobic,
    muscleGroups: [],
  },
  {
    name: 'Yoga',
    description: 'A flexibility-focused practice involving poses and breathing.',
    category: ExerciseCategory.flexibility,
    muscleGroups: [],
  },
  {
    name: 'Bicep Curl',
    description: 'An isolation movement for the biceps.',
    category: ExerciseCategory.strength,
    muscleGroups: [MuscleGroup.arms],
  },
];

beforeAll(async () => {
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();

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

  for (const ex of exercises) {
    await prisma.exercise.create({ data: ex });
  }
});

afterAll(async () => {

  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();
  
  await prisma.$disconnect();
});

describe('Exercise Routes', () => {
  let exerciseId: number;

  it('Fetch all exercises successfully', async () => {
    const res = await request(app)
      .get('/api/v1/exercises')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    exerciseId = res.body[0].id;
  });

  it('Fetch all exercises unsuccessfully (no token)', async () => {
    const res = await request(app).get('/api/v1/exercises');
    expect(res.statusCode).toBe(401);
  });

  it('Fetch exercise by ID successfully', async () => {
    const res = await request(app)
      .get(`/api/v1/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Bench Press');
  });

  it('Fetch exercise by ID unsuccessfully (not found)', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Exercise not found');
  });

  it('Search exercises successfully', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/search?query=curl')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name).toMatch(/curl/i);
  });

  it('Search exercises sucessfully with no query returning all exercise', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/search')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it('Get exercises by valid category', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/category/strength')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.every((e : Exercise) => e.category === 'strength')).toBe(true);
  });

  it('Get exercises by invalid category', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/category/invalid')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid Category');
  });

  it('Get exercises by valid muscle group', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/muscleGroup/arms')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((e: Exercise) => e.muscleGroups.includes('arms'))).toBe(true);
  });

  it('Get exercises by invalid muscle group', async () => {
    const res = await request(app)
      .get('/api/v1/exercises/muscleGroup/invalid')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Invalid Muscle Group');
  });
});
