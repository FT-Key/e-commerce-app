import { Router } from "express";
import { authController } from "../controllers/index.js";

const router = Router();

// Registro y login tradicionales
router.post("/register", authController.register);
router.post("/login", authController.login);

// Google
router.post("/google", authController.googleLogin);

export default router;
