import { Router } from "express";

import {
    getAllKrisar,
    getKrisarById,
    createKrisar,
    updateKrisar,
    deleteKrisar,
} from "../controllers/speak/krisar/krisar_controller.js";
import { authenticateToken } from "../middleware/auth_middleware.js";

const router = Router();
// Krisar routes
router.get("/krisar", authenticateToken, getAllKrisar);
router.get("/krisar/:id", authenticateToken, getKrisarById);
router.post("/krisar", authenticateToken, createKrisar);
router.put("/krisar/:id", updateKrisar);
router.delete("/krisar/:id", deleteKrisar);

export default router;
// This file defines the routes for the Krisar feature.
