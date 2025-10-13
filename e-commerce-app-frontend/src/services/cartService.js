import clientAxios from "../utils/clientAxios.js";

export const getCart = async () => {
  try {
    const res = await clientAxios.get("/carts");
    return res.data.products || [];
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

export const updateCart = async (cartProducts) => {
  try {
    const formattedProducts = cartProducts.map(p => ({
      productId: p._id || p.productId,
      quantity: p.quantity || 1,
    }));

    const res = await clientAxios.post("/carts", { products: formattedProducts });
    return res.data.products || [];
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const res = await clientAxios.delete(`/carts/${productId}`);
    return res.data.products || [];
  } catch (error) {
    console.error("Error removing product from cart:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const res = await clientAxios.delete("/carts/clear");
    return res.data.products || [];
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};
