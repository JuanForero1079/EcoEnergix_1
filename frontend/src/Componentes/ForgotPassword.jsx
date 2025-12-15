// src/Componentes/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ForgotPassword() {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo) {
      alert("Ingresa tu correo");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post("/auth/forgot-password", {
        Correo_electronico: correo,
      });

      alert(data.message || "Revisa tu correo para restablecer la contraseña");
      navigate("/login");
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "Error inesperado al enviar correo";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-4">
          Recuperar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo"
              required
              autoComplete="email"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-2 sm:py-3 rounded-xl text-base sm:text-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#5f54b3] hover:bg-[#3dc692]"
            }`}
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center text-sm sm:text-base text-white/90 space-y-2">
          <p>
            ¿Recuerdas tu contraseña?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#3dc692] hover:underline cursor-pointer"
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
