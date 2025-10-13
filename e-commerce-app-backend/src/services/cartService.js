import { Cart } from "../models/index.js";

// Obtener carrito de un usuario (normalizado)
export const getCartByUser = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("products.productId");

  if (!cart) return { products: [], total: 0 };

  const productsWithTotals = cart.products
    .filter(p => p.productId) // filtra productos eliminados
    .map(p => {
      // si productId es objeto (poblado) usamos sus datos
      const prod = typeof p.productId === "object" ? p.productId : {};
      return {
        _id: p._id.toString(),
        productId: prod._id?.toString() || p.productId, // siempre string
        name: prod.name || p.name || "Producto sin nombre",
        price: prod.price || p.price || 0,
        quantity: p.quantity,
        subtotal: p.quantity * (prod.price || p.price || 0),
        images: prod.images || p.images || [],
      };
    });

  const total = productsWithTotals.reduce((acc, p) => acc + p.subtotal, 0);

  return { products: productsWithTotals, total };
};

// Crear o actualizar carrito (retorna el mismo formato que getCartByUser)
export const createOrUpdateCart = async (userId, items) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      products: items.map(i => ({
        productId: i.productId,
        quantity: i.quantity || 1,
      })),
    });
    return getCartByUser(userId);
  }

  items.forEach(item => {
    const index = cart.products.findIndex(p => p.productId.toString() === item.productId);
    if (index > -1) {
      cart.products[index].quantity = item.quantity; // <-- sobrescribimos en lugar de sumar
    } else {
      cart.products.push({
        productId: item.productId,
        quantity: item.quantity || 1,
      });
    }
  });

  await cart.save();
  return getCartByUser(userId);
};

// Eliminar un producto del carrito (formato normalizado)
export const removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return { products: [], total: 0 };

  cart.products = cart.products.filter(p => p.productId.toString() !== productId);
  await cart.save();
  return getCartByUser(userId);
};

// Limpiar todo el carrito (formato normalizado)
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return { products: [], total: 0 };

  cart.products = [];
  await cart.save();
  return { products: [], total: 0 };
};
