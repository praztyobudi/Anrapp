import express from 'express';
import cors from 'cors';
import userRoute from './routes/user_routes.js'
import ideRoute from './routes/ide_routes.js';
import krisarRoute from './routes/krisar_routes.js';
import fraudRoute from './routes/fraud_routes.js';
import cookieParser from 'cookie-parser';

const app = express();

// Deteksi environment
const isProduction = process.env.NODE_ENV === 'production';

// Set CORS origin berdasarkan environment
const corsOptions = {
  origin: isProduction
    ? 'https://app.prazelab.my.id'   // domain frontend saat production
    : 'http://192.168.1.10:3000',   // domain frontend saat development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use('/', krisarRoute);
app.use('/', ideRoute);
app.use('/', fraudRoute);
// user authentication routes
app.use('/', userRoute);
// app.use('/users', userRoute);
// Krisar routes

export default app;
