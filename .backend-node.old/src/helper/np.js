import { query } from '../config/db.js';

export const generateNP = async () => {
  let np;
  let exists = true;

  while (exists) {
    const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    np = `ANRIT${random}`;

    const check = await query('SELECT 1 FROM users WHERE np = $1 LIMIT 1', [np]);
    exists = check && check.rowCount > 0;
  }

  return np;
};
