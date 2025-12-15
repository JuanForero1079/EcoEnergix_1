// src/Componentes/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const [contraseña, setContraseña] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contraseña || !confirmar) {
      alert("Completa todos los campos");
      return;
    }

    if (contraseña.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (contraseña !== confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const { data } = await API.post(`/auth/reset-password/${token}`, {
        Contraseña: contraseña,
      });

      alert(data.message || "Contraseña restablecida correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al restablecer contraseña:", error);
      const mensaje =
        error.response?.data?.message ||
        error.message ||
        "Error inesperado al restablecer la contraseña";
      alert(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-4">
          Restablecer contraseña
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingresa nueva contraseña"
              required
              autoComplete="new-password"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm sm:text-base">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Confirma tu contraseña"
              required
              autoComplete="new-password"
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
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
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
