import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as cartService from "../services/cartService.js";
import * as favoritesService from "../services/favoritesService.js";

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: async (userData, token) => {
        set({ user: userData, token });

        if (userData) {
          try {
            // Traemos carrito y favoritos del backend
            const cart = await cartService.getCart();
            const favorites = await favoritesService.getFavorites();

            // Sobrescribimos el estado, evitando mezcla con lo persistido
            set({ cart: cart || [], favorites: favorites || [] });
          } catch (err) {
            console.error("Error cargando carrito/favoritos:", err);
            set({ cart: [], favorites: [] });
          }
        } else {
          // Si no hay usuario, limpiamos carrito y favoritos
          set({ cart: [], favorites: [] });
        }
      },

      logout: () => set({ user: null, token: null, cart: [], favorites: [] }),

      cart: [],
      addToCart: async (product) => {
        set((state) => {
          if (!state.user) {
            window.location.href = "/login";
            return { cart: state.cart };
          }

          const exists = state.cart.find((p) => p.productId === product._id);
          const updatedCart = exists
            ? state.cart.map((p) =>
              p.productId === product._id
                ? { ...p, quantity: p.quantity + 1 }
                : p
            )
            : [...state.cart, { productId: product._id, ...product, quantity: 1 }];

          const formattedCart = updatedCart.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
          }));

          cartService.updateCart(formattedCart).catch(console.error);

          return { cart: updatedCart };
        });
      },

      removeFromCart: async (productId) => {
        set((state) => {
          const updatedCart = state.cart.filter((p) => p.productId !== productId);

          if (state.user)
            cartService.removeFromCart(productId).catch(console.error);

          return { cart: updatedCart };
        });
      },

      updateCartQuantity: async (productId, quantity) => {
        set((state) => {
          const updatedCart = state.cart.map((p) =>
            p.productId === productId
              ? { ...p, quantity: quantity < 1 ? 1 : quantity }
              : p
          );

          if (state.user)
            cartService
              .updateCart(
                updatedCart.map((p) => ({ productId: p.productId, quantity: p.quantity }))
              )
              .catch(console.error);

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
            favoritesService
              .addFavorite(product._id)
              .then((updatedFavorites) => set({ favorites: updatedFavorites }))
              .catch(console.error);
          }

          const updatedFavorites = exists
            ? state.favorites
            : [...state.favorites, product];
          return { favorites: updatedFavorites };
        });
      },

      removeFromFavorites: async (productId) => {
        set((state) => {
          if (state.user) {
            favoritesService
              .removeFavorite(productId)
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
          favoritesService
            .clearFavorites()
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
