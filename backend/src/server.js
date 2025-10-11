import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

// Routes
import authRoutes from './routes/authRoutes.js';
import applicationsRoutes from './routes/applicationsRoutes.js';
import aiProcessingRoutes from './routes/aiProcessingRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // parses JSON body: req.body
app.use(rateLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/ai', aiProcessingRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'API running 🚀' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
