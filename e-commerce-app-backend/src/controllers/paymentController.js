import { paymentService } from "../services/index.js";

export const createPreference = async (req, res) => {
  try {
    const { items, user } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items inválidos" });
    }

    const returnUrl = req.headers.origin || "http://localhost:5173";

    const pref = await paymentService.createPreference(
      items,
      returnUrl,
      user
    );

    return res.json({
      id: pref.id,
      init_point: pref.init_point,
    });
  } catch (err) {
    console.error("Error creando preferencia:", err);
    return res.status(500).json({ error: "Error creando preferencia" });
  }
};

export const webhook = async (req, res) => {
  try {
    console.log("Webhook recibido:", req.body);
    res.status(200).send("OK");
  } catch (err) {
    console.error("Error en webhook:", err);
    res.status(500).send("Error procesando webhook");
  }
};
