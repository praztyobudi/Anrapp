import express from 'express';
import cors from 'cors';
import userRoute from './routes/user_routes.js'
import ideRoute from './routes/ide_routes.js';
import krisarRoute from './routes/krisar_routes.js';
import fraudRoute from './routes/fraud_routes.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { baseDir } from './middleware/img_fraud.js';
import { fileURLToPath } from 'url';


const app = express();

console.log("Upload Directorya :", baseDir);

app.use("/uploads", express.static(baseDir, {
  maxAge: '1d',
  immutable: false,
  etag: true,
  lastModified: true,
}));
// Deteksi environment
const isProduction = process.env.NODE_ENV === 'production';

// Set CORS origin berdasarkan environment
const corsOptions = {
  origin: isProduction
    // ? 'https://app.prazelab.my.id'   // domain frontend saat production
    ? 'http://36.67.110.108:3000'
    : 'http://192.168.1.10:3000',   // domain frontend saat development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};


app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/', fraudRoute);
app.use(express.json());
app.use('/', krisarRoute);
app.use('/', ideRoute);
// user authentication routes
app.use('/', userRoute);
// app.use('/users', userRoute);
// Krisar routes
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
//   maxAge: '30d',
//   immutable: true,
// }));

export default app;
