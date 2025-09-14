 import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';

// Temporarily disabled until Prisma is properly set up
// import exerciseRoutes from './routes/exerciseRoutes'
// import workoutRoutes from './routes/workoutRoutes'
// import workoutexerciseRoutes from './routes/workoutexerciseRoutes'
// import { limiter } from './middlewares/rateLimiter';
// import bodyParser from 'body-parser';
const app = express();

// Add CORS middleware for frontend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

//Adds a rate limiter to limit the rate of incoming requests
// app.use(limiter);
//Ensures API can take x-www-form-urlencoded requests
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/v1', authRoutes);
// Temporarily disabled until Prisma is properly set up
// app.use('/api/v1/exercises', exerciseRoutes);
// app.use('/api/v1/workouts', workoutRoutes);
// app.use('/api/v1/workoutexercises', workoutexerciseRoutes)

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;