import { Router } from "express";
import { userController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";

const router = Router();

// Todas las rutas de usuario requieren estar autenticado
router.use(authMiddleware);

// Admin puede ver todos los usuarios
router.get("/", roleMiddleware("admin"), userController.getUsers);

// Admin puede cambiar rol
router.put("/:id/role", roleMiddleware("admin"), userController.changeUserRole);

// Cualquier usuario autenticado puede ver o actualizar su propio perfil
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);

// Admin puede eliminar usuarios
router.delete("/:id", roleMiddleware("admin"), userController.deleteUser);

export default router;
