import axios from "axios";
import { useStore } from "../store/useStore.js";

const clientAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

clientAxios.interceptors.request.use((config) => {
  const token = useStore.getState().token || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

clientAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request - logging out...");
      useStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default clientAxios;
