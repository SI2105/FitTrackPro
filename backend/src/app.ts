import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());

//Ensures API can take x-www-form-urlencoded requests
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/', authRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;