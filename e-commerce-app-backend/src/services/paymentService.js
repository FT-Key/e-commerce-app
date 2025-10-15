import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
dotenv.config();

export const createPreference = async (productos, returnUrl, user = {}) => {
  console.log("DATOS: ", productos, returnUrl, user);

  const cliente = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });

  const items = productos.map(prod => ({
    title: prod.title,
    quantity: Number(prod.quantity || prod.cantidad || 1),
    unit_price: Number(prod.unit_price || prod.precio || prod.price || 0),
    currency_id: "ARS",
  }));

  const preference = new Preference(cliente);

  // Asegurarse de que returnUrl tenga el formato correcto
  const baseUrl = returnUrl.endsWith('/') ? returnUrl.slice(0, -1) : returnUrl;

  const result = await preference.create({
    body: {
      items,
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/webhook`,
      metadata: { 
        userId: user.id || null,
        userEmail: user.email || null 
      },
    },
  });

  return {
    id: result.id,
    init_point: result.init_point,
    statusCode: 200,
  };
};