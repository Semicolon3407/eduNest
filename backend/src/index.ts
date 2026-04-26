import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load env vars immediately
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db';
import swaggerSpec from './config/swagger';
import errorHandler from './middlewares/errorMiddleware';

// Routes
import authRoutes from './routes/authRoutes';
import superAdminRoutes from './routes/superAdminRoutes';
import tenantRoutes from './routes/tenantRoutes';
import hrRoutes from './routes/hrRoutes';
import adminRoutes from './routes/adminRoutes';
import tutorRoutes from './routes/tutorRoutes';
import studentRoutes from './routes/studentRoutes';
import chatRoutes from './routes/chatRoutes';
import paymentRoutes from './routes/paymentRoutes';
import uploadRoutes from './routes/uploadRoutes';
import { handleStripeWebhook } from './controllers/stripeController';

// Connect to database
connectDB();

// Ensure upload directories exist
const uploadDir = path.join(process.cwd(), 'uploads/submissions');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

// Stripe Webhook (Must be before express.json() for raw body)
app.post('/api/v1/payment/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Compress all responses
app.use(compression());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/super-admin', superAdminRoutes);
app.use('/api/v1/tenant', tenantRoutes);
app.use('/api/v1/hr', hrRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/tutor', tutorRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Static folder
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Fallback for missing files in submissions (helps with legacy/demo data)
app.use('/uploads/submissions', (req, res, next) => {
  const filePath = path.join(process.cwd(), 'uploads/submissions', req.path);
  if (!fs.existsSync(filePath)) {
    return res.redirect('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  }
  next();
});

// Error handler
app.use(errorHandler);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduNest API' });
});

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api/docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

