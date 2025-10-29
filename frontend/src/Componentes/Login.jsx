import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Error en el inicio de sesión.");
        return;
      }

      const { usuario, token } = data;
      if (!usuario || !usuario.Rol_usuario || !token) {
        alert("Datos de sesión incompletos.");
        return;
      }
      // Guardar usuario y token en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...usuario,
          rol: usuario.Rol_usuario,
        }),
      );
      localStorage.setItem("token", token);
      // Redirigir solo admin
      if (usuario.Rol_usuario === "Administrador") {
        navigate("/admin");
      } else {
        alert("Solo los administradores pueden acceder a esta vista.");
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      alert("Ocurrió un error al intentar iniciar sesión.");
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
            <label className="block text-white mb-2 text-sm sm:text-base">
              Correo
            </label>
            <input
              type="email"
              name="correo"
              required
              placeholder="Ingresa tu correo"
              value={formData.correo}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">
              Contraseña
            </label>
            <input
              type="password"
              name="contraseña"
              required
              placeholder="Ingresa tu contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#4375b2] outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#5f54b3] text-white font-bold py-2 sm:py-3 rounded-xl text-base sm:text-lg hover:bg-[#3dc692] transition "
          >
            Entrar
          </button>
        </form>
        <div className="mt-4 flex flex-col items-center text-sm sm:text-base text-white/90 space-y-2">
          <Link
            to="/forgot-password"
            className="hover:underline hover:text-[#3dc692]"
          >
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
