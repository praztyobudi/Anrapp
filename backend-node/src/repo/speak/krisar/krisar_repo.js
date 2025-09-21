import { query } from "../../../config/db.js";
// import { getAllKrisar, getKrisarById } from "../../../controllers/speak/krisar/krisar_controller.js";

export const krisarRepo = {
    getAllKrisar: async (userId, userRole) => {
        if (userRole === 'admin') {
            const sql = `SELECT 
                id,
                user_id, 
                critique, 
                suggestion,
                created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
                updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
                FROM tb_kritiksaran;`;
            const result = await query(sql);
            return result.rows;
        } else {
            const sql = `SELECT 
                id,
                user_id, 
                critique, 
                suggestion,
                created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
                updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
                FROM tb_kritiksaran WHERE user_id = $1;`;
            const result = await query(sql, [userId]);
            return result.rows;
        }
    },
    getKrisarById: async (id, userId, userRole) => {
        console.log('Fetching Krisar by ID:', id, 'User ID:', userId, 'User Role:', userRole);
       if (userRole === 'admin') {
         const sql = `SELECT
             id, 
             user_id, 
             critique, 
             suggestion,
             created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
             updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
             FROM tb_kritiksaran WHERE id = $1;`;
         const result = await query(sql, [id]);
         return result.rows[0];
       } else {
         const sql = `SELECT
             id, 
             user_id, 
             critique, 
             suggestion,
             created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
             updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
             FROM tb_kritiksaran WHERE id = $1 AND user_id = $2;`;
         const result = await query(sql, [id, userId]);
         return result.rows[0];
       }
    },
    createKrisar: async ({ user_id, critique, suggestion }) => {
        const sql = `INSERT INTO tb_kritiksaran (user_id, critique, suggestion)
            VALUES ($1, $2, $3) 
            RETURNING 
            id,
            user_id, 
            critique, 
            suggestion,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
        const result = await query(sql, [user_id, critique, suggestion]);
        return result.rows[0];
    },
    updateKrisar: async (id, { critique, suggestion }) => {
        const sql = `UPDATE tb_kritiksaran 
            SET critique = $1, suggestion = $2, updated_at = NOW() 
            WHERE id = $3 RETURNING 
            id,
            critique, 
            suggestion,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
        const result = await query(sql, [critique, suggestion, id]);
        return result.rows[0];
    },
    deleteKrisar: async (id) => {
        const sql = `DELETE FROM tb_kritiksaran WHERE id = $1 RETURNING
            id,
            user_id, 
            critique, 
            suggestion,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
        const result = await query(sql, [id]);
        return result.rows[0];
    }
}