import { query } from '../config/db.js';

export const getAllUsers = async () => {
  const result = await query('SELECT u.id, u.username, u.password, u.name, d.department AS department FROM users u LEFT JOIN tb_department d ON u.department_id = d.id');
  console.log.result;
  return result.rows;
};
export const getUserById = async (id) => {
  const result = await query('SELECT u.id, u.username, u.password, u.name, d.department AS department FROM users u LEFT JOIN tb_department d ON u.department_id = d.id WHERE u.id = $1', [id]);
  return result.rows[0];
};
export const createUser = async (name, password, username, department) => {
  // const result = await query(
  //   'INSERT INTO users (name, password, username, department_id) VALUES ($1, $2, $3, (SELECT id FROM tb_department WHERE department = $4)) RETURNING *',
  //   [name, password, username, department]
  // );
  const result = await query(
    'INSERT INTO users (name, password, username, department_id) SELECT $1::text, $2::text, $3::text, id FROM tb_department WHERE department = $4 AND NOT EXISTS (SELECT 1 FROM users WHERE username = $3 ) RETURNING *;',
    [name, password, username, department]
  );
  if (result.rowCount === 0) {
    throw new Error('Username already exists');
  }
  return result.rows[0];
};
export const updateUser = async (id, data) => {
  // Update user data
  await query(
    `UPDATE users 
     SET name = $1, username = $2, password = $3, department_id = $4 
     WHERE id = $5`,
    [data.name, data.username, data.password, data.department, id]
  );
  // Ambil user terbaru dengan nama departemen
  const { rows } = await query(
    `SELECT u.name, u.username, u.password, d.department 
     FROM users u 
     JOIN tb_department d ON u.department_id = d.id 
     WHERE u.id = $1`,
    [id]
  );

  return rows[0];
};
export const deleteUserById = async (id) => {
  const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rowCount > 0;
};
