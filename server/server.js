const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend development requests
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check / welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SpendTrack REST API',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      expenses: '/api/expenses',
    },
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[SpendTrack API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
