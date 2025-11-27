import axios from "axios";

// -----------------------------
// Instancia Axios para cliente/usuario
// -----------------------------
const API = axios.create({
  baseURL: "http://localhost:3001",
});

// -----------------------------
// Agregar token a cada request
// -----------------------------
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Manejar refresh token automáticamente
// -----------------------------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verificar 401 y refresh token disponible
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "http://localhost:3001/api/auth/refresh",
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefresh } = res.data;

        // Guardar tokens nuevos
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

        // Reintentar la request original con el nuevo token
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axios(originalRequest);
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

export default API;
