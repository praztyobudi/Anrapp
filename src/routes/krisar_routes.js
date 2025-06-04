import { Router } from "express";

import { getAllKrisar, getKrisarById, createKrisar, updateKrisar, deleteKrisar } from "../controllers/speak/krisar/krisar_controller.js";

const router = Router();
// Krisar routes
router.get('/krisar', getAllKrisar);
router.get('/krisar/:id', getKrisarById);
router.post('/krisar', createKrisar);
router.put('/krisar/:id', updateKrisar);
router.delete('/krisar/:id', deleteKrisar);

export default router;
// This file defines the routes for the Krisar feature.