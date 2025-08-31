import config from "../config/config";
const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FitTrackPro',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        WorkoutExerciseInput: {
          type: 'object',
          required: ['name', 'sets', 'reps'],
          properties: {
            exerciseId: {
              type: 'integer',
              description: 'Exercise Id',
              example: '1', 
            },
            sets: {
              type: 'integer',
              description: 'Number of sets',
              example: 3,
            },
            reps: {
              type: 'integer',
              description: 'Number of repetitions per set',
              example: 10,
            },
            weight: {
              type: 'number',
              description: 'Weight used for the exercise (kg)',
              example: 60,
            },
            notes: {
              type: 'string',
              description: 'Additional notes for the exercise',
              example: 'Increase weight next session',
            },
          },
        },
        WorkoutExercise: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the workout exercise',
              example: '64b7f2d1c2a1e2b3c4d5e6f7',
            },
            workoutId: {
              type: 'string',
              description: 'ID of the workout this exercise belongs to',
              example: '64b7f2d1c2a1e2b3c4d5e6f0',
            },
            name: {
              type: 'string',
              description: 'Name of the exercise',
              example: 'Bench Press',
            },
            sets: {
              type: 'integer',
              description: 'Number of sets',
              example: 3,
            },
            reps: {
              type: 'integer',
              description: 'Number of repetitions per set',
              example: 10,
            },
            weight: {
              type: 'number',
              description: 'Weight used for the exercise (kg)',
              example: 60,
            },
            notes: {
              type: 'string',
              description: 'Additional notes for the exercise',
              example: 'Increase weight next session',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-06-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-06-01T12:30:00.000Z',
            },
          },
        },
        Workout: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier for the workout',
              example: '64b7f2d1c2a1e2b3c4d5e6f0',
            },
            userId: {
              type: 'string',
              description: 'ID of the user who owns the workout',
              example: '64b7f2d1c2a1e2b3c4d5e6ff',
            },
            name: {
              type: 'string',
              description: 'Name of the workout',
              example: 'Push Day',
            },
            notes: {
              type: 'string',
              description: 'Optional notes for the workout',
              example: 'Focus on chest and triceps',
            },
            scheduledAt: {
              type: 'string',
              format: 'date-time',
              description: 'Scheduled date and time for the workout',
              example: '2024-06-10T18:00:00.000Z',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-06-01T12:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-06-01T12:30:00.000Z',
            },
            exercises: {
              type: 'array',
              description: 'List of exercises in the workout',
              items: {
                $ref: '#/components/schemas/WorkoutExercise',
              },
            },
          },
          required: ['name'],
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:' + config.port + '/api/v1',
        description: 'Development server',
      },
    ],
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ['./src/routes/*.ts'],
};

export default options;