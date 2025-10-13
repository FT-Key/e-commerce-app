import clientAxios from "../utils/clientAxios.js";
import { handleResponse, handleError } from "../utils/response.js";

export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await clientAxios.get(`/products?${params}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};

export const getProductById = async (id) => {
  try {
    const res = await clientAxios.get(`/products/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};

export const createProduct = async (productData) => {
  try {
    const res = await clientAxios.post("/products", productData);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const res = await clientAxios.put(`/products/${id}`, productData);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await clientAxios.delete(`/products/${id}`);
    return handleResponse(res);
  } catch (error) {
    handleError(error);
  }
};
