import { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/user_controller.js';
import { login } from '../controllers/auth_controller.js';

const router = Router();
// Auth routes
router.post('/login', login);
// User routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;