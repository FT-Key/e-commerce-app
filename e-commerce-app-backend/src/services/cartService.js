import { Cart, Product } from "../models/index.js";

export const getCartByUser = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("products.productId");
};

export const createOrUpdateCart = async (userId, items) => {
  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    // Actualizamos productos existentes o agregamos nuevos
    items.forEach((item) => {
      const index = cart.products.findIndex(
        (p) => p.productId.toString() === item.productId
      );
      if (index > -1) {
        cart.products[index].quantity += item.quantity;
        cart.products[index].subtotal =
          cart.products[index].quantity * cart.products[index].price;
      } else {
        cart.products.push({
          ...item,
          subtotal: item.price * item.quantity,
        });
      }
    });
  } else {
    const newCart = {
      user: userId,
      products: items.map((i) => ({ ...i, subtotal: i.price * i.quantity })),
    };
    return await Cart.create(newCart);
  }

  // Recalcular total
  cart.total = cart.products.reduce((acc, p) => acc + p.subtotal, 0);
  return await cart.save();
};

export const removeProductFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.products = cart.products.filter(
    (p) => p.productId.toString() !== productId
  );
  cart.total = cart.products.reduce((acc, p) => acc + p.subtotal, 0);
  return await cart.save();
};

export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.products = [];
  cart.total = 0;
  return await cart.save();
};
