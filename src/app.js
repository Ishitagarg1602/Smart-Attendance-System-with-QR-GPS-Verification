import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth.routes.js';
import qrRouter from './routes/qr.routes.js';
import attendanceRouter from './routes/attendance.routes.js';
import locationZoneRouter from './routes/locationZone.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import reportRouter from './routes/report.routes.js';

import globalErrorHandler from './middlewares/errorHandler.js';
import AppError from './utils/appError.js';
import { HTTP_STATUS } from './constants/index.js';
import logger from './config/logger.js';

const app = express();

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS setup
app.use(cors({
  origin: true, // Allow all origins for dev simplicity (or map custom domains)
  credentials: true
}));

// 3. Request Logging via Morgan (Pipes requests details to Winston logs)
const morganFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
  stream: {
    write: (message) => logger.http(message.trim())
  }
}));

// 4. Rate Limiting (Prevents Brute-force & DOS attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// 5. Parse request body JSON & Cookies
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 6. Healthy Check Route
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Smart Attendance System API is healthy and operational'
  });
});

app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Welcome to the Smart Attendance System API! Please use Postman to interact with the /api endpoints.'
  });
});

// 7. Mount Module Routes
app.use('/api/auth', authRouter);
app.use('/api/qr', qrRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/zones', locationZoneRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportRouter);

// 8. 404 Route Catch Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS.NOT_FOUND));
});

// 9. Global Custom Error Handler Middleware
app.use(globalErrorHandler);

export default app;
