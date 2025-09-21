import { query } from "../config/db.js";
import { generateNP } from "../helper/np.js";
import { getRoleName } from "../helper/find_data.js";

export const getAllUsers = async () => {
  const result = await query(
    "SELECT u.id, u.username, u.password, u.name, d.department AS department, r.role as role, u.np, u.last_login, u.last_device FROM users u LEFT JOIN tb_department d ON u.department_id = d.id LEFT JOIN tb_role r on u.role_id = r.id"
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
    "SELECT u.id, u.username, u.password, u.name, d.department AS department, r.role as role, u.np, u.last_login, u.last_device FROM users u LEFT JOIN tb_department d ON u.department_id = d.id LEFT JOIN tb_role r on u.role_id = r.id WHERE u.id = $1",
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
  const np = await generateNP();

  // Validasi department & role
  const dept = await query(`SELECT id FROM tb_department WHERE department = $1`, [department]);
  if (dept.rowCount === 0) throw new Error("Invalid department");

  const roleData = await query(`SELECT id FROM tb_role WHERE role = $1`, [role]);
  if (roleData.rowCount === 0) throw new Error("Invalid role");

  // Insert user
  const result = await query(
    `INSERT INTO users (name, password, username, department_id, role_id, np)
     SELECT $1::text, $2::text, $3::text,
            (SELECT id FROM tb_department WHERE department = $4),
            (SELECT id FROM tb_role WHERE role = $5),
            $6::text
     WHERE NOT EXISTS (
       SELECT 1 FROM users WHERE username = $7::text
     )
     RETURNING *;`,
    [name, password, username, department, role, np, username]
  );
  

  if (result.rowCount === 0 || !result.rows[0]) {
    throw new Error("Username already exists or insert failed.");
  }

  const getAll = result.rows[0];

  const fullData = await query(
    `SELECT u.id, u.np, u.name, u.username, d.department, r.role as user_role
     FROM users u
     JOIN tb_department d ON u.department_id = d.id
     JOIN tb_role r ON u.role_id = r.id
     WHERE u.id = $1`,
    [getAll.id]
  );

  if (fullData.rowCount === 0 || !fullData.rows[0]) {
    throw new Error("Failed to retrieve user data after insert.");
  }

  return fullData.rows[0];
};

export const updateUser = async (id, data) => {
  await query(
    `UPDATE users 
     SET name = $1, username = $2, password = $3, department_id = $4, role_id = $5 
     WHERE id = $6`,
    [data.name, data.username, data.password, data.department, data.role, id]
  );
  // Ambil user terbaru dengan nama departemen
  // const { rows } = await query(
  //   `SELECT u.id, u.name, u.username, d.department, r.role as user_role
  //  FROM users u
  //  JOIN tb_department d ON u.department_id = d.id
  //  JOIN tb_role r ON u.role_id = r.id
  //  WHERE u.id = $1`,
  //   [id]
  // );
  const user = await getUserById(id);
  return user;  
};

export const deleteUserById = async (id) => {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rowCount > 0;
};

export const lastLogin = async (userId) => {
  const result = await query(
    `UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING last_login`,
    [userId]
  );

  return result.rows[0]?.last_login;
};

export const lastDevice = async (userId, deviceInfo) => {
  const result = await query(
    `UPDATE users SET last_device = $1 WHERE id = $2 RETURNING last_device`,
    // [JSON.stringify(deviceInfo), userId]
    [deviceInfo, userId]
  );

  return result.rows[0]?.last_device;
};



