import { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/user_controller.js';
import { login } from '../controllers/auth_controller.js';
import { authenticateToken, authRoles } from '../middleware/auth_middleware.js';
import { refreshToken, logout } from "../controllers/auth_controller.js";

const router = Router();
// Login
router.post('/login', login);
router.post('/refresh', refreshToken);
// Authenticated routes
router.use(authenticateToken); // Middleware for authentication
router.post('/logout', logout);
router.get('/users', getAllUsers, authRoles('admin')); // Only admin can access this route
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;