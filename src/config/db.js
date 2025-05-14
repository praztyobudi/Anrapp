import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAMEDB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const query = (text, params) => pool.query(text, params);