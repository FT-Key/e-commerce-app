import { Router } from "express";
import { favoritesController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware); // todas las rutas requieren login

router.get("/", favoritesController.getFavorites);
router.post("/", favoritesController.addFavorite);
router.delete("/clear", favoritesController.clearFavorites);
router.delete("/:productId", favoritesController.removeFavorite);

export default router;
