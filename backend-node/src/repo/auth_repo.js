import { query } from '../config/db.js';

export const findUserByUsername = async (username) => {
  const result = await query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};
