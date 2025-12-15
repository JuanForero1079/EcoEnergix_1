// src/services/api.js
import axios from "axios";

// ===================================
// Base URL desde .env (Vite)
// ===================================
const API_BASE_URL = import.meta.env.VITE_API_URL + "/api"; // <-- Asegúrate que VITE_API_URL sea "http://localhost:3001"

// ===================================
// Instancia Axios para cliente/usuario
// ===================================
const API = axios.create({
  baseURL: API_BASE_URL,
});

// ===================================
// Agregar token a cada request
// ===================================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===================================
// Refresh token automático
// ===================================
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`, // usa URL completa para refresh
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefresh } = res.data;

        // Guardar nuevos tokens
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (err) {
        console.error("Refresh token falló:", err);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// ===================================
// Función auxiliar para construir URLs de imágenes
// ===================================
export const getFullImageUrl = (ruta) => {
  if (!ruta) return null;
  if (ruta.startsWith("http")) return ruta;
  return `${import.meta.env.VITE_API_URL}${ruta}`;
};

export default API;
