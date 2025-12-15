import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"; // <-- instancia de Axios con interceptors

export default function Login() {
  const [formData, setFormData] = useState({
    correo: "",
    contraseña: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correo || !formData.contraseña) {
      alert("Por favor, completa todos los campos antes de continuar.");
      return;
    }

    try {
      // Enviar campos exactos que espera el backend
      const { data } = await API.post("/auth/login", {
        Correo_electronico: formData.correo,
        Contraseña: formData.contraseña,
      });

      console.log("Datos login backend:", data);

      const { usuario, accessToken, refreshToken } = data;

      if (!usuario || !accessToken || !refreshToken) {
        alert("Error: datos de sesión incompletos.");
        return;
      }

      const rol = usuario.rol?.toLowerCase().trim();

      // Guardar tokens y usuario
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(usuario));

      // Redirigir según rol
      if (rol === "cliente") navigate("/usuario");
      else if (rol === "administrador") navigate("/admin");
      else if (rol === "domiciliario") navigate("/domiciliario");
      else alert("Rol no permitido en la aplicación.");

    } catch (error) {
      console.error("Error durante el login:", error);
      alert(error.response?.data?.message || "Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-4">
          Iniciar Sesión
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Correo</label>
            <input
              type="email"
              name="correo"
              autoComplete="email" // <-- agregado
              required
              placeholder="Ingresa tu correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              autoComplete="current-password" // <-- agregado
              required
              placeholder="Ingresa tu contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#4375b2] outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#5f54b3] text-white font-bold py-2 sm:py-3 rounded-xl text-base sm:text-lg hover:bg-[#3dc692] transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center text-sm sm:text-base text-white/90 space-y-2">
          <Link to="/forgot-password" className="hover:underline hover:text-[#3dc692]">
            ¿Olvidaste tu contraseña?
          </Link>
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-[#3dc692] hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
