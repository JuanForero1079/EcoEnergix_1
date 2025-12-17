import axios from "axios";

// -----------------------------
// Instancia Axios para usuario
// -----------------------------
const APIUsuario = axios.create({
  baseURL: "http://localhost:3001/api",
});

// -----------------------------
// Agregar token a cada request
// -----------------------------
APIUsuario.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Refresh token automático
// -----------------------------
APIUsuario.interceptors.response.use(
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
        const res = await axios.post(
          "http://localhost:3001/api/auth/refresh",
          {
            refreshToken: localStorage.getItem("refreshToken"),
          }
        );

        const { accessToken, refreshToken } = res.data;

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default APIUsuario;
