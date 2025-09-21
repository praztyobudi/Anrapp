import { Router } from "express";
import {
  getAllFraud,
  getFraudById,
  createFraud,
  updateFraud,
  deleteFraud,
} from "../controllers/speak/fraud/fraud_controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = Router();
// Fraud routes
router.get("/fraud", getAllFraud);
router.get("/fraud/:id", getFraudById);
router.post("/fraud", authenticateToken, createFraud);
router.put('/fraud/:id', updateFraud);
router.delete('/fraud/:id', deleteFraud);
export default router;
