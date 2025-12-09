import axios from "axios";

// -----------------------------
// Instancia Axios para admin
// -----------------------------
const APIAdmin = axios.create({
  baseURL: "http://localhost:3001/api",
});

// -----------------------------
// Agregar token a cada request
// -----------------------------
APIAdmin.interceptors.request.use(
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
APIAdmin.interceptors.response.use(
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
          "http://localhost:3001/api/auth/refresh",
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefresh } = res.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

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

// -----------------------------
// 🔐 RECUPERACIÓN DE CONTRASEÑA ADMIN
// -----------------------------
export const forgotPasswordAdmin = (correo) => {
  return APIAdmin.post("/auth/forgot-password", {
    Correo_electronico: correo,
  });
};

export const resetPasswordAdmin = (token, nuevaContraseña) => {
  return APIAdmin.post(`/auth/reset-password/${token}`, {
    nuevaContraseña,
  });
};

export default APIAdmin;
