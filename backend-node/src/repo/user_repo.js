import { query } from "../config/db.js";

export const getAllUsers = async () => {
  const result = await query(
    "SELECT u.id, u.username, u.password, u.name, d.department AS department, r.role as role FROM users u LEFT JOIN tb_department d ON u.department_id = d.id LEFT JOIN tb_role r on u.role_id = r.id"
  );
  console.log.result;
  return result.rows;
};
export const findUserByUsername = async (username) => {
  const result = await query(
    'SELECT u.id, u.username, u.password, u.name, d.department AS department, r.role as role FROM users u LEFT JOIN tb_department d ON u.department_id = d.id LEFT JOIN tb_role r on u.role_id = r.id WHERE u.username = $1',
    [username]
  );
  return result.rows[0];
};
export const getUserById = async (id) => {
  const result = await query(
    "SELECT u.id, u.username, u.password, u.name, d.department AS department, r.role as role FROM users u LEFT JOIN tb_department d ON u.department_id = d.id LEFT JOIN tb_role r on u.role_id = r.id WHERE u.id = $1",
    [id]
  );
  return result.rows[0];
};
export const createUser = async (
  name,
  password,
  username,
  department,
  role
) => {
  // const result = await query(
  //   'INSERT INTO users (name, password, username, department_id) VALUES ($1, $2, $3, (SELECT id FROM tb_department WHERE department = $4)) RETURNING *',
  //   [name, password, username, department]
  // );
  const result = await query(
    // 'INSERT INTO users (name, password, username, department_id, role_id) SELECT $1::text, $2::text, $3::text, $4::text, id FROM tb_department WHERE department = $5 AND NOT EXISTS (SELECT 1 FROM users WHERE username = $3 ) RETURNING *;',
    `INSERT INTO users (name, password, username, department_id, role_id)
SELECT $1::text, $2::text, $3::text,
       (SELECT id FROM tb_department WHERE department = $4),
       (SELECT id FROM tb_role WHERE role = $5)
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE username = $3::text
)
RETURNING *;`,

    [name, password, username, department, role]
  );
  if (result.rowCount === 0) {
    throw new Error("Username already exists");
  }
  const getAll = result.rows[0];
  const fullData = await query(
    `SELECT u.id, u.name, u.username, d.department, r.role as user_role
   FROM users u
   JOIN tb_department d ON u.department_id = d.id
   JOIN tb_role r ON u.role_id = r.id
   WHERE u.id = $1`,
    [getAll.id]
  );
  return fullData.rows[0];
};
export const updateUser = async (id, data) => {
  // Update user data
  await query(
    `UPDATE users 
     SET name = $1, username = $2, password = $3, department_id = $4, role_id = $5 
     WHERE id = $6`,
    [data.name, data.username, data.password, data.department, data.role, id]
  );
  // Ambil user terbaru dengan nama departemen
  const { rows } = await query(
    `SELECT u.id, u.name, u.username, d.department, r.role as user_role
   FROM users u
   JOIN tb_department d ON u.department_id = d.id
   JOIN tb_role r ON u.role_id = r.id
   WHERE u.id = $1`,
    [id]
  );

  return rows[0];
};
export const deleteUserById = async (id) => {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rowCount > 0;
};
