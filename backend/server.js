import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'QuickBite Full-Stack Server is running smoothly',
    timestamp: new Date()
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\x1b[35m[Server]\x1b[0m Running in development mode on port ${PORT}`);
});
