import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import cartRoutes from "./cartRoutes.js";
import favoritesRoutes from "./favoritesRoutes.js";
import productRoutes from "./productRoutes.js";
import paymentRoutes from "./paymentRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/carts", cartRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/products", productRoutes);
router.use("/payment", paymentRoutes);

export default router;
