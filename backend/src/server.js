import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

dotenv.config();

// Routes
import userRoutes from './routes/userRoutes.js';
import applicationsRoutes from './routes/applicationsRoutes.js';
import aiProcessingRoutes from './routes/aiProcessingRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, '../../frontend/dist');

// Middleware
app.use(cors());
app.use(express.text({ type: 'text/plain' }));
app.use(express.json());
app.use(rateLimiter);

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/ai', aiProcessingRoutes);

// Serve frontend static files
app.use(express.static(frontendDist));

// SPA catch-all — return index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
