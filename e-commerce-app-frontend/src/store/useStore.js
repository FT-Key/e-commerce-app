import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cartService from "../services/cartService.js";
import * as favoritesService from "../services/favoritesService.js";

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null, // <- nuevo

      setUser: async (userData, token) => {
        set({ user: userData, token }); // <- guardamos token también
        if (userData) {
          try {
            const cart = await cartService.getCart();
            const favorites = await favoritesService.getFavorites();
            set({ cart, favorites });
          } catch (err) {
            console.error("Error cargando carrito/favoritos:", err);
          }
        }
      },

      logout: () => set({ user: null, token: null, cart: [], favorites: [] }), // <- limpiar token

      // Carrito y favoritos (igual que antes)
      cart: [],
      addToCart: async (product) => {
        set((state) => {
          if (!state.user) {
            window.location.href = "/login";
            return { cart: state.cart };
          }
          const exists = state.cart.find((p) => p._id === product._id);
          const updatedCart = exists
            ? state.cart.map((p) => p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p)
            : [...state.cart, { ...product, quantity: 1 }];
          cartService.updateCart(updatedCart).catch(console.error);
          return { cart: updatedCart };
        });
      },
      removeFromCart: async (productId) => {
        set((state) => {
          const updatedCart = state.cart.filter((p) => p._id !== productId);
          if (state.user) cartService.removeFromCart(productId).catch(console.error);
          return { cart: updatedCart };
        });
      },
      updateCartQuantity: async (productId, quantity) => {
        set((state) => {
          const updatedCart = state.cart.map((p) => p._id === productId ? { ...p, quantity: quantity < 1 ? 1 : quantity } : p);
          if (state.user) cartService.updateCart(updatedCart).catch(console.error);
          return { cart: updatedCart };
        });
      },
      clearCart: async () => {
        set({ cart: [] });
        if (get().user) cartService.clearCart().catch(console.error);
      },

      favorites: [],
      addToFavorites: async (product) => {
        set((state) => {
          if (!state.user) {
            window.location.href = "/login";
            return { favorites: state.favorites };
          }
          const exists = state.favorites.some((p) => p._id === product._id);
          if (!exists) {
            favoritesService.addFavorite(product._id)
              .then((updatedFavorites) => set({ favorites: updatedFavorites }))
              .catch(console.error);
          }
          const updatedFavorites = exists ? state.favorites : [...state.favorites, product];
          return { favorites: updatedFavorites };
        });
      },
      removeFromFavorites: async (productId) => {
        set((state) => {
          if (state.user) {
            favoritesService.removeFavorite(productId)
              .then((updatedFavorites) => set({ favorites: updatedFavorites }))
              .catch(console.error);
          }
          const updatedFavorites = state.favorites.filter((p) => p._id !== productId);
          return { favorites: updatedFavorites };
        });
      },
      clearFavorites: async () => {
        set({ favorites: [] });
        if (get().user) {
          favoritesService.clearFavorites()
            .then((updatedFavorites) => set({ favorites: updatedFavorites }))
            .catch(console.error);
        }
      },
    }),
    {
      name: "ecommerce-storage",
      getStorage: () => localStorage,
    }
  )
);
