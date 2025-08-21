import { query } from "../../../config/db.js";

export const fraudRepo = {
  getAllFraud: async (userId, userRole) => {
    if (userRole === 'admin') {
      const sql = `SELECT 
              f.id,
              f.user_id, 
              f.fraud_message, 
              t.types as type_message,
              created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
              updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
              FROM tb_fraud f 
              LEFT JOIN tb_types_fraud t ON f.type_id = t.id
              order by updated_at desc;`;
      const result = await query(sql);
      return result.rows;
    } else {
      const sql = `SELECT 
              f.id,
              f.user_id, 
              f.fraud_message, 
              t.types as type_message,
              created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
              updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
              FROM tb_fraud f 
              LEFT JOIN tb_types_fraud t ON f.type_id = t.id
              WHERE f.user_id = $1
              order by updated_at desc;`;
      const result = await query(sql, [userId]);
      return result.rows;
    }
  },

  getFraudById: async (id, userId, userRole) => {
    if (userRole === 'admin') {
      const sql = `SELECT 
              f.id,
              f.user_id, 
              f.fraud_message, 
              t.types as type_message,
              created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
              updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
              FROM tb_fraud f 
              LEFT JOIN tb_types_fraud t ON f.type_id = t.id
              WHERE f.id = $1
              order by updated_at desc;`;
      const result = await query(sql, [id]);
      return result.rows[0];
    } else {
      const sql = `SELECT 
              f.id,
              f.user_id, 
              f.fraud_message, 
              t.types as type_message,
              created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
              updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at
              FROM tb_fraud f 
              LEFT JOIN tb_types_fraud t ON f.type_id = t.id
              WHERE f.id = $1 AND f.user_id = $2
              order by updated_at desc;`;
      const result = await query(sql, [id, userId]);
      return result.rows[0];
    }
  },

  createFraud: async ({ user_id, fraud_message, types }) => {
    //Cari ID berdasarkan nama tipe
    const findTypeName = `SELECT id FROM tb_types_fraud WHERE types = $1`;
    const outputResult = await query(findTypeName, [types]);
    const idType = outputResult.rows[0].id;
    //Insert ke tabel tb_fraud
    const sql = `INSERT INTO tb_fraud (user_id, fraud_message, type_id)
            VALUES ($1, $2, $3) 
            RETURNING 
            id,
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
    const result = await query(sql, [user_id, fraud_message, idType]);
    const createResult = result.rows[0].id;
    //Ambil detail lengkap
    const fullResult = await fraudRepo.getFraudById(createResult);
    return fullResult;
  },

  updateFraud: async (id, { fraud_message, types }) => {
    const findTypeName = `SELECT id FROM tb_types_fraud WHERE types = $1`;
    const outputResult = await query(findTypeName, [types]);
    const idType = outputResult.rows[0].id;
    const sql = `UPDATE tb_fraud
            SET fraud_message = $1, type_id = $2, updated_at = NOW() 
            WHERE id = $3 RETURNING 
            id,
            user_id, 
            fraud_message, 
            type_id,
            created_at AT TIME ZONE 'Asia/Jakarta' AS created_at,
            updated_at AT TIME ZONE 'Asia/Jakarta' AS updated_at`;
    const result = await query(sql, [fraud_message, idType, id]);
    const updateResult = result.rows[0].id;
    //Ambil detail lengkap
    const fullResult = await fraudRepo.getFraudById(updateResult);
    return fullResult;
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
