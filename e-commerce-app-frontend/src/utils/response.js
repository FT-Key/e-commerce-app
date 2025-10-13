import toast from "react-hot-toast";

export const handleResponse = (response) => {
  if (response?.data?.message) {
    toast.success(response.data.message);
  }
  return response.data;
};

export const handleError = (error) => {
  const message =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error.message ||
    "Ocurrió un error";
  toast.error(message);
  throw new Error(message);
};
