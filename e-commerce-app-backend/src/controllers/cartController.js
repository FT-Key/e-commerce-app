import * as cartService from "../services/cartService.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCartByUser(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const updatedCart = await cartService.createOrUpdateCart(
      req.user.id,
      req.body.products
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const removeProduct = async (req, res, next) => {
  try {
    const updatedCart = await cartService.removeProductFromCart(
      req.user.id,
      req.params.productId
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const clearedCart = await cartService.clearCart(req.user.id);
    res.json(clearedCart);
  } catch (error) {
    next(error);
  }
};
