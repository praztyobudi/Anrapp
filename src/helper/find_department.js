import { query } from '../config/db.js';
export const getDepartmentName = async ({ userId, departmentName }) => {
    if (userId) {
      const result = await query(
        `SELECT u.id, u.name, u.username, d.department 
         FROM users u 
         JOIN tb_department d ON u.department_id = d.id 
         WHERE u.id = $1`,
        [userId]
      );
      return result.rows[0];
    }
  
    if (departmentName) {
      const result = await query(
        `SELECT id FROM tb_department WHERE department = $1`,
        [departmentName]
      );
      return result.rows[0]?.id;
    }
  
    throw new Error('Either userId or departmentName must be provided');
  };