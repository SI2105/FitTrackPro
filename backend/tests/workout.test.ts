import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
let token: string;

beforeAll(async () => {
  await prisma.workoutExercise.deleteMany();
  await prisma.workout.deleteMany();
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
});

afterAll(async () => {

  
  await prisma.$disconnect();
});

describe('Workout Routes', () => {
  let workoutId: number;

  // Create Tests
  it('Create a workout successfully', async () => {
    const res = await request(app)
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Leg Day',
        notes: 'Heavy squats today',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Leg Day');
    expect(res.body.notes).toBe('Heavy squats today');
    workoutId = res.body.id;
  });

  it('Create a workout unsuccessfully (missing name)', async () => {
    const res = await request(app)
      .post('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing user ID or workout name");
  });

  // Retrieve Tests
  it('Fetch all workouts successfully', async () => {
    const res = await request(app)
      .get('/api/v1/workouts')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
  });

  it('Fetch all workouts unsuccessfully (no token)', async () => {
    const res = await request(app).get('/api/v1/workouts');
    expect(res.statusCode).toBe(401);
  });

  it('Fetch a specific workout successfully', async () => {
    const res = await request(app)
      .get(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(workoutId);
  });

  it('Fetch a specific workout unsuccessfully (not found)', async () => {
    const res = await request(app)
      .get('/api/v1/workouts/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Workout not found");
  });

  // Update Tests
  it('Update a workout successfully', async () => {
    const res = await request(app)
      .put(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Updated notes' });

    expect(res.statusCode).toBe(200);
    expect(res.body.notes).toBe('Updated notes');
  });

  it('Update a workout unsuccessfully (not found)', async () => {
    const res = await request(app)
      .put('/api/v1/workouts/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ghost Workout' });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Workout not found or does not belong to user');
  });

  it('Update a workout unsuccessfully (no body data)', async () => {
    const res = await request(app)
      .put(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Empty Update Error: At least one field should be included in update')
  });

  // Delete Tests
  it('Delete a workout successfully', async () => {
    const res = await request(app)
      .delete(`/api/v1/workouts/${workoutId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Workout deleted');
  });

  it('Delete a workout unsuccessfully (not found)', async () => {
    const res = await request(app)
      .delete('/api/v1/workouts/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Workout not found or does not belong to user');
  });

  it('Delete a workout unsuccessfully (no token)', async () => {
    const res = await request(app).delete(`/api/v1/workouts/${workoutId}`);
    expect(res.statusCode).toBe(401);
  });
});
