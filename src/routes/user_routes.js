import { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/user_controller.js';
import { login } from '../controllers/auth_controller.js';
import { getAllIde, createIde, updateIde, deleteIde, getIdeById } from "../controllers/speak/ide/ide_controller.js";

const router = Router();
// Auth routes
router.post('/login', login);
// Ide routes
router.get('/ide', getAllIde);
router.get('/ide/:id', getIdeById);
router.post('/ide', createIde);
router.put('/ide/:id', updateIde);
router.delete('/ide/:id', deleteIde);
// User routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);


export default router;