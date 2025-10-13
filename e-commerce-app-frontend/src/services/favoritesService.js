import clientAxios from "../utils/clientAxios.js";

// Obtener favoritos del usuario
export const getFavorites = async () => {
  try {
    const res = await clientAxios.get("/favorites");
    return res.data.products || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Agregar un producto a favoritos
export const addFavorite = async (productId) => {
  try {
    const res = await clientAxios.post("/favorites", { productId });
    return res.data.products || [];
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
};

// Remover un producto de favoritos
export const removeFavorite = async (productId) => {
  try {
    const res = await clientAxios.delete(`/favorites/${productId}`);
    return res.data.products || [];
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
};

// Limpiar todos los favoritos
export const clearFavorites = async () => {
  try {
    const res = await clientAxios.delete("/favorites/clear");
    return res.data.products || [];
  } catch (error) {
    console.error("Error clearing favorites:", error);
    throw error;
  }
};
