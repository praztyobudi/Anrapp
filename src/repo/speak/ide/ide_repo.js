import { query } from '../../../config/db.js';

//by Grouping CRUD
export const ideRepo = {
    getAllIde: async (userId, userRole) => {
        if (userRole === 'admin') {
            const sql =
                `SELECT 
            i.id,
            i.user_id, 
            i.name, 
            i.message,
            TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS created_at,
            TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS updated_at,
            d.department AS department
        FROM tb_ide i
        LEFT JOIN tb_department d ON i.department_id = d.id
        ORDER BY i.updated_at DESC;`;
            const result = await query(sql);
            return result.rows;
        } else {
            const sql =
                `SELECT 
            i.id,
            i.user_id, 
            i.name, 
            i.message,
            TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS created_at,
            TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS updated_at,
            d.department AS department
        FROM tb_ide i
        LEFT JOIN tb_department d ON i.department_id = d.id
        WHERE i.user_id = $1
        ORDER BY i.updated_at DESC;`;
            const result = await query(sql, [userId]);
            return result.rows;
        }
    },
    getIdeById: async (id, userRole, userId) => {
        if (userRole === 'admin') {
            const sql = `
              SELECT 
                i.id, i.user_id, i.name, i.message,
                TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta','DD/Mon/YYYY') AS created_at,
                TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta','DD/Mon/YYYY') AS updated_at,
                d.department AS department
              FROM tb_ide i
              LEFT JOIN tb_department d ON i.department_id = d.id
              WHERE i.id = $1
              LIMIT 1
            `;
            const result = await query(sql, [id]);
            return result.rows[0] || null;
        } else {
            const sql = `
              SELECT 
                i.id, i.user_id, i.name, i.message,
                TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta','DD/Mon/YYYY') AS created_at,
                TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta','DD/Mon/YYYY') AS updated_at,
                d.department AS department
              FROM tb_ide i
              LEFT JOIN tb_department d ON i.department_id = d.id
              WHERE i.id = $1 AND i.user_id = $2
              LIMIT 1
            `;
            const result = await query(sql, [id, userId]);
            return result.rows[0] || null;
        }
    },
    createIde: async ({ user_id, name, message, department }) => {
        // 1. Cari ID dari nama departemen
        const findDeptSQL = `SELECT id FROM tb_department WHERE department = $1 LIMIT 1`;
        const deptResult = await query(findDeptSQL, [department]);
        const department_id = deptResult.rows[0].id;

        // 2. Simpan ide ke tabel
        const insertSQL = `
            INSERT INTO tb_ide (user_id, name, message, department_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;
        const insertResult = await query(insertSQL, [user_id, name, message, department_id]);
        const insertedIdeId = insertResult.rows[0].id;

        const getFullIde = await ideRepo.getIdeById(insertedIdeId);
        return getFullIde;
    },
    updateIde: async (id, data) => {
        // Update ide data
        const result = await query(
            `UPDATE tb_ide 
             SET name = $1, message = $2, department_id = $3, updated_at = NOW() 
             WHERE id = $4 RETURNING id`,
            [data.name, data.message, data.department, id]
        );
        const updateIde = result.rows[0].id;
        const resultIde = await ideRepo.getIdeById(updateIde);
        return resultIde;
    },
    deleteIdeById: async (id) => {
        const result = await query('DELETE FROM tb_ide WHERE id = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    }
};

