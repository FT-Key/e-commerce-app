import { Router } from "express";
import { cartController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware); // todas las rutas requieren login

router.get("/", cartController.getCart);
router.post("/", cartController.updateCart);
router.delete("/clear", cartController.clearCart);
router.delete("/:productId", cartController.removeProduct);

export default router;
