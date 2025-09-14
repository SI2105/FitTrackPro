import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Routes', () => {
  const testUser = {
    email: 'authuser@example.com',
    name: 'Auth Test User',
    password: 'testpassword123',
  };

  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v1/register', () => {
    it('Registers a user successfully', async () => {
      const res = await request(app).post('/api/v1/register').send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User created successfully');
    });

    it('Fails to register the same user again (duplicate)', async () => {
      const res = await request(app).post('/api/v1/register').send(testUser);

      expect(res.statusCode).toBe(409); 
    });

    it('Fails to register with missing fields', async () => {
      const res = await request(app).post('/api/v1/register').send({
        email: 'missing@example.com',
      });

      expect(res.statusCode).toBe(400); // or 400 if you add validation
    });
  });

  describe('POST /api/v1/login', () => {
    it('Logs in with correct credentials', async () => {
      const res = await request(app).post('/api/v1/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it('Fails login with incorrect password', async () => {
      const res = await request(app).post('/api/v1/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Authentication failed');
    });

    it('Fails login with non-existent email', async () => {
      const res = await request(app).post('/api/v1/login').send({
        email: 'nonexistent@example.com',
        password: 'any',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Authentication failed');
    });

    it('Fails login with missing fields', async () => {
      const res = await request(app).post('/api/v1/login').send({
        email: testUser.email,
      });

      expect(res.statusCode).toBe(400); // or 400 with validation
    });
  });
});
