import { Favorite } from "../models/index.js";

export const getFavoritesByUser = async (userId) => {
  return await Favorite.findOne({ user: userId }).populate("products");
};

export const addFavorite = async (userId, productId) => {
  const fav = await Favorite.findOne({ user: userId });
  if (fav) {
    if (!fav.products.includes(productId)) {
      fav.products.push(productId);
      await fav.save();
    }
  } else {
    await Favorite.create({ user: userId, products: [productId] });
  }

  // 🔥 IMPORTANTE: devolvemos populate
  const updated = await Favorite.findOne({ user: userId }).populate("products");
  return updated;
};

export const removeFavorite = async (userId, productId) => {
  const fav = await Favorite.findOne({ user: userId });
  if (!fav) return null;

  fav.products = fav.products.filter((p) => p.toString() !== productId);
  await fav.save();

  // 🔥 devolver populateado
  const updated = await Favorite.findOne({ user: userId }).populate("products");
  return updated;
};

export const clearFavorites = async (userId) => {
  const fav = await Favorite.findOne({ user: userId });
  if (!fav) return null;

  fav.products = [];
  await fav.save();

  // 🔥 devolver populateado (aunque vacío)
  const updated = await Favorite.findOne({ user: userId }).populate("products");
  return updated;
};
