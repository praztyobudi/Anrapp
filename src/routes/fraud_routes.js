import { Router } from "express";
import {
  getAllFraud,
  getFraudById,
  createFraud,
  updateFraud,
  deleteFraud,
} from "../controllers/speak/fraud/fraud_controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";
import { uploadBukti } from "../middleware/img_fraud.js";

const router = Router();
// Fraud routes
router.get("/fraud", authenticateToken, getAllFraud);
router.get("/fraud/:id", authenticateToken, getFraudById);
router.post("/fraud", authenticateToken, uploadBukti, createFraud);
router.put('/fraud/:id', updateFraud);
router.delete('/fraud/:id', deleteFraud);
export default router;
