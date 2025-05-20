import { Router } from "express";
import { getAllUsers, getUserById, createUser, deleteUser, updateUser } from '../controllers/user_controller.js';
import { login } from '../controllers/auth_controller.js';

const router = Router();

router.post('/login', login);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;  // Export the router to use it in other files.  // Export the router