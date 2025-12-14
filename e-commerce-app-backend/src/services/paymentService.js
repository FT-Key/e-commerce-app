import { MercadoPagoConfig, Preference } from "mercadopago";
import dotenv from "dotenv";
import { Product } from "../models/index.js";

dotenv.config();

export const createPreference = async (items, returnUrl, user = {}) => {
  const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
  });

  // 1️⃣ Traer productos reales
  const productIds = items.map(i => i.productId);
  console.log("ProductsID: ", productIds)

  // La siguiente linea indica que busque lso que tienen _id que este dentro del array de ids que creamos anteriormente
  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true,
  });
  console.log("Productos: ", products)

  if (products.length !== items.length) {
    throw new Error("Uno o más productos no existen");
  }

  // 2️⃣ Construir items para Mercado Pago
  const mpItems = items.map(item => {
    const product = products.find(
      p => p._id.toString() === item.productId
    );

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    const quantity = Number(item.quantity || 1);

    if (quantity < 1) {
      throw new Error("Cantidad inválida");
    }

    return {
      title: product.name,
      quantity,
      unit_price: Number(product.price),
      currency_id: "ARS",
    };
  });

  // 3️⃣ Normalizar returnUrl
  const baseUrl = returnUrl.endsWith("/")
    ? returnUrl.slice(0, -1)
    : returnUrl;

  const preference = new Preference(client);

  // 4️⃣ Crear preferencia
  const result = await preference.create({
    body: {
      items: mpItems,
      payer: {
        email: user?.email,
      },
      back_urls: {
        success: `${baseUrl}/payments/success`,
        failure: `${baseUrl}/payments/failure`,
        pending: `${baseUrl}/payments/pending`,
      },
      // El return_url no funcina en desarrollo, solo en produccion asi qeu mantenercomentado para pruebas
      //auto_return: "approved",
    },
  });

  return {
    id: result.id,
    init_point: result.init_point,
  };
};