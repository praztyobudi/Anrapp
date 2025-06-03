import { query } from '../../../config/db.js';

//by Grouping CRUD
export const ideRepo = {
    getAllIde: async () => {
        const sql = 
        `SELECT 
            i.id, 
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
    },
    getIdeById: async (id) => {
        const sql = 
        `SELECT 
            i.id, 
            i.name, 
            i.message,
            TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS created_at,
            TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS updated_at,
            d.department AS department
        FROM tb_ide i
        LEFT JOIN tb_department d ON i.department_id = d.id
        WHERE i.id = $1`;
        const result = await query(sql, [id]);
        return result.rows[0];
    },
    createIde: async ({ name, message, department }) => {
        // 1. Cari ID dari nama departemen
        const findDeptSQL = `SELECT id FROM tb_department WHERE department = $1 LIMIT 1`;
        const deptResult = await query(findDeptSQL, [department]);
    
        if (deptResult.rows.length === 0) {
            throw new Error(`Department '${department}' not found`);
        }
    
        const department_id = deptResult.rows[0].id;
    
        // 2. Simpan ide ke tabel
        const insertSQL = `
            INSERT INTO tb_ide (name, message, department_id)
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const insertResult = await query(insertSQL, [name, message, department_id]);
        const insertedIdeId = insertResult.rows[0].id;
    
        // 3. Ambil data lengkap setelah insert (dengan JOIN untuk ambil nama departemen)
        const getFullIdeSQL = `
            SELECT 
                i.id, 
                i.name, 
                i.message,
                TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta', 'DD-Mon-YYYY HH24:MI') AS created_at,
                TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta', 'DD-Mon-YYYY HH24:MI') AS updated_at, 
                d.department AS department
            FROM tb_ide i
            LEFT JOIN tb_department d ON i.department_id = d.id
            WHERE i.id = $1
        `;
        const fullResult = await query(getFullIdeSQL, [insertedIdeId]);
    
        return fullResult.rows[0];
    },
    updateIde: async (id, data) => {
        // Update ide data
        await query(
            `UPDATE tb_ide 
            SET name = $1, message = $2, department_id = $3, updated_at = NOW() 
            WHERE id = $4`,
            [data.name, data.message, data.department, id]
        );
        // Ambil ide terbaru dengan nama departemen
        const { rows } = await query(
            `SELECT i.name, i.message, d.department, TO_CHAR(i.created_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS created_at, TO_CHAR(i.updated_at AT TIME ZONE 'Asia/Jakarta', 'DD/Mon/YYYY') AS updated_at 
            FROM tb_ide i 
            JOIN tb_department d ON i.department_id = d.id 
            WHERE i.id = $1`,
            [id]
        );
        return rows[0];
    },
    deleteIdeById: async (id) => {
        const result = await query('DELETE FROM tb_ide WHERE id = $1 RETURNING *', [id]);
        return result.rowCount > 0;
    }
};

