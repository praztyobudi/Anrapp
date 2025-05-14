import { Router } from "express";
import * as controller from "../controllers/user_controller.js";

const router = Router();

router.get('/', controller.getAllUsers);

export default router;  // Export the router to use it in other files.  // Export the router