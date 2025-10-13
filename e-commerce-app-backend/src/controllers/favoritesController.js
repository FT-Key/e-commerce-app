import { favoritesService } from "../services/index.js";

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await favoritesService.getFavoritesByUser(req.user.id);
    res.json(favorites || { products: [] });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const updatedFav = await favoritesService.addFavorite(
      req.user.id,
      req.body.productId
    );
    res.json(updatedFav);
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const updatedFav = await favoritesService.removeFavorite(
      req.user.id,
      req.params.productId
    );
    res.json(updatedFav);
  } catch (error) {
    next(error);
  }
};

export const clearFavorites = async (req, res, next) => {
  try {
    const clearedFav = await favoritesService.clearFavorites(req.user.id);
    res.json(clearedFav);
  } catch (error) {
    next(error);
  }
};
