import { Router } from "express";
import { getAllIde, createIde, updateIde, deleteIde, getIdeById } from "../controllers/speak/ide/ide_controller.js";

const router = Router();
// Ide routes
router.get('/ide', getAllIde);
router.get('/ide/:id', getIdeById);
router.post('/ide', createIde);
router.put('/ide/:id', updateIde);
router.delete('/ide/:id', deleteIde);

export default router;
// This file defines the routes for the Ide feature.