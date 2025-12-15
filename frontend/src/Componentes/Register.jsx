import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"; // <-- Axios con interceptors

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    documentType: "",
    documentNumber: "",
    terms: false,
    privacy: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.documentType ||
      !formData.documentNumber
    ) {
      setError("Por favor, completa todos los campos antes de registrarte.");
      return;
    }

    if (!formData.terms || !formData.privacy) {
      setError(
        "Debes aceptar los Términos y Condiciones y la Política de Privacidad."
      );
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post("/auth/register", {
        Nombre: formData.name,
        Correo_electronico: formData.email,
        Contraseña: formData.password,
        Tipo_documento: formData.documentType,
        Numero_documento: formData.documentNumber,
      });

      setSuccess(
        data.message || "¡Registro exitoso! Se ha enviado un correo de verificación."
      );

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Error al registrar:", err.response || err);
      setError(err.response?.data?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Crear Cuenta
        </h2>
        <p className="text-base text-center text-white/80 mb-6">
          Regístrate y empieza a ahorrar con energía solar
        </p>

        {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
        {success && (
          <p className="text-green-400 text-center mb-4 font-medium">
            {success} <br />
            <span className="text-sm text-white/70">
              Redirigiendo al inicio de sesión...
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-white mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#5f54b3] outline-none"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-white mb-1">Correo</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa tu correo"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-white mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crea una contraseña"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#5f54b3] outline-none"
            />
          </div>

          {/* Documento */}
          <div>
            <label className="block text-white mb-1">Documento</label>
            <div className="flex gap-2">
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-1/3 px-2 py-2 rounded-lg bg-white/30 text-black focus:ring-2 focus:ring-[#3dc692] outline-none"
              >
                <option value="" disabled hidden>Tipo</option>
                <option value="CC">Cédula</option>
                <option value="TI">Tarjeta Identidad</option>
                <option value="CE">Cédula Extranjería</option>
              </select>
              <input
                type="text"
                name="documentNumber"
                autoComplete="off"
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="Número"
                className="w-2/3 px-3 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#5f54b3] outline-none"
              />
            </div>
          </div>

          {/* Términos y política */}
          <div className="space-y-2">
            <label className="flex items-center text-white text-sm">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2"
              />
              Estoy de acuerdo con los{" "}
              <Link to="/terms" className="ml-1 text-[#3dc692] hover:underline">Términos y Condiciones</Link>
            </label>
            <label className="flex items-center text-white text-sm">
              <input
                type="checkbox"
                name="privacy"
                checked={formData.privacy}
                onChange={handleChange}
                className="mr-2"
              />
              Acepto la{" "}
              <Link to="/privacy" className="ml-1 text-[#3dc692] hover:underline">Política de Privacidad</Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5f54b3] text-white py-2 rounded-lg hover:bg-[#3dc692] transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <p className="text-sm text-white text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#3dc692] hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
