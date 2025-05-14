import { query } from '../config/db.js';

export const getAllUsers = async () => {
  const result = await query('SELECT * FROM users');
  return result.rows;
};