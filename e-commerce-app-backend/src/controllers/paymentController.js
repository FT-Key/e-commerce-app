import { paymentService } from "../services/index.js";

export const createPreference = async (req, res) => {
  try {
    const { items, user } = req.body;

    // Pasamos el returnUrl directamente desde el frontend
    const returnUrl = req.headers.origin || "http://localhost:5173";

    console.log("DATOS CONTROLLER: ", items, returnUrl, user);

    const pref = await paymentService.createPreference(items, returnUrl, user);

    return res.json({ id: pref.id, init_point: pref.init_point });
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
