import { Router } from "express";
import { paymentController } from "../controllers/index.js";

const router = Router();

// Crear preferencia de pago
router.post("/create_preference", paymentController.createPreference);

// Webhook (notificaciones de Mercado Pago)
router.post("/webhook", paymentController.webhook);

export default router;
