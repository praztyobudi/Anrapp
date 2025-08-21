import { Router } from "express";
import { getAllIde, createIde, updateIde, deleteIde, getIdeById } from "../controllers/speak/ide/ide_controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = Router();
// Ide routes
router.get('/ide', authenticateToken, getAllIde);
router.get('/ide/:id', authenticateToken, getIdeById);
router.post('/ide', authenticateToken, createIde);
router.put('/ide/:id', updateIde);
router.delete('/ide/:id', deleteIde);

export default router;
// This file defines the routes for the Ide feature.