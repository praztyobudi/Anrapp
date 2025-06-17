import { query } from "../../../config/db.js";

export const fraudRepo = {
  getAllFraud: async () => {
    const sql = `SELECT 
            id,
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
            FROM tb_fraud;`;
    const result = await query(sql);
    return result.rows;
  },

  getFraudById: async (id) => {
    const sql = `SELECT
            id, 
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
            FROM tb_fraud WHERE id = $1;`;
    const result = await query(sql, [id]);
    return result.rows[0];
  },

  createFraud: async ({ user_id, fraud_message, type_id }) => {
    const sql = `INSERT INTO tb_fraud (user_id, fraud_message, type_id)
            VALUES ($1, $2, $3) 
            RETURNING 
            id,
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
    const result = await query(sql, [user_id, fraud_message, type_id]);
    return result.rows[0];
  },

  updateFraud: async (id, { fraud_message, type_id }) => {
    const sql = `UPDATE tb_fraud
            SET fraud_message = $1, type_id = $2, updated_at = NOW() 
            WHERE id = $3 RETURNING 
            id,
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
    const result = await query(sql, [fraud_message, type_id, id]);
    return result.rows[0];
  },
  deleteFraud: async (id) => {
    const sql = `DELETE FROM tb_fraud WHERE id = $1 RETURNING
            id,
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
    const result = await query(sql, [id]);
    return result.rows[0];
  },
};
