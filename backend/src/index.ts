// Загружаем переменные окружения
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { authRoutes } from './routes/auth.js';
import { userRoutes } from './routes/users.js';
import { postRoutes } from './routes/posts.js';
import { commentRoutes } from './routes/comments.js';
import { likeRoutes } from './routes/likes.js';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { testConnection } from './utils/database-hybrid.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100') // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Bailanysta backend server running on port ${PORT}`);
  
  // Проверяем подключение к базе данных
  if (process.env.NODE_ENV === 'production') {
    await testConnection();
  } else {
    console.log('🔧 Development mode: Using SQLite database');
  }
});
