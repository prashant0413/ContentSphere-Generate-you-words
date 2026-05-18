import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import contentRoutes from './routes/contentRoutes.js';
import sequelize from './config/database.js';
import redisClient from './config/redis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware — order matters!
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

app.use(express.json());        // ✅ must be here before routes
app.use(express.urlencoded({ extended: true }));  // ✅ add this too

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Content Generator API is running!' 
  });
});

// Routes
app.use('/api/content', contentRoutes);

// Connect to all services and start server
const startServer = async () => {
  try {
    // Connect Redis
    await redisClient.connect();

    // Connect MySQL
    await sequelize.authenticate();
    console.log('✅ MySQL connected!');

    await sequelize.sync({ alter: true });
    console.log('✅ Tables synced!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Startup error:', error.message);
    process.exit(1);
  }
};

startServer();