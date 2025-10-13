import clientAxios from "../utils/clientAxios.js";
import { handleResponse, handleError } from "../utils/response.js";
import { useStore } from "../store/useStore.js";

const { setUser, logout } = useStore.getState();

export const login = async (credentials) => {
  try {
    const res = await clientAxios.post("/auth/login", credentials);
    const data = handleResponse(res);

    if (data?.user && data?.token) {
      await setUser(data.user, data.token); // <- guardamos usuario + token
    }

    return data;
  } catch (error) {
    handleError(error);
  }
};

export const register = async (userData) => {
  try {
    const res = await clientAxios.post("/auth/register", userData);
    const data = handleResponse(res);

    if (data?.user && data?.token) {
      await setUser(data.user, data.token);
    }

    return data;
  } catch (error) {
    handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    logout();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};
