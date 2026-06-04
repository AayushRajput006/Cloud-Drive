import axios from "axios";

const api = axios.create({
  // baseURL: "https://cloud-drive-1.onrender.com",
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://cloud-drive-1.onrender.com",
  timeout: 15000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("clouddrive_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Helps identify which URL is returning 404/canceled in deployed env
    console.error("API error:", {
      url: error?.config?.url,
      method: error?.config?.method,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    return Promise.reject(error);
  }
);

export default api;
