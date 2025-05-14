require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Deteksi environment
const isProduction = process.env.NODE_ENV === 'production';

// Set CORS origin berdasarkan environment
const corsOptions = {
  origin: isProduction
    ? 'https://app.prazelab.my.id'   // domain frontend saat production
    : 'http://localhost:3000',      // domain frontend saat development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express with Docker & Postgres!' });
});

module.exports = app;
