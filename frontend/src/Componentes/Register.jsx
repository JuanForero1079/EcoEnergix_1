import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate(); // <--- Hook para redirección

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    documentType: "",
    documentNumber: "",
    terms: false,
    privacy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showTerminos, setShowTerminos] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.email.trim()) newErrors.email = "El correo es obligatorio.";
    if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
    else if (formData.password.length < 6) newErrors.password = "Debe tener al menos 6 caracteres.";
    if (!formData.documentType) newErrors.documentType = "Selecciona el tipo.";
    if (!formData.documentNumber.trim()) newErrors.documentNumber = "El número es obligatorio.";
    if (!formData.terms) newErrors.terms = "Debes aceptar los Términos y Condiciones.";
    if (!formData.privacy) newErrors.privacy = "Debes aceptar la Política de Privacidad.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: formData.name,
          Correo_electronico: formData.email,
          Contraseña: formData.password,
          Tipo_documento: formData.documentType,
          Numero_documento: formData.documentNumber,
          terms: formData.terms,
          privacy: formData.privacy,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error en el registro");

      setSuccess("¡Registro exitoso! Revisa tu correo para verificar la cuenta.");

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        password: "",
        documentType: "",
        documentNumber: "",
        terms: false,
        privacy: false,
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl p-6 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-2">Crear Cuenta</h2>
        <p className="text-center text-white/80 mb-4">
          Regístrate y empieza a ahorrar con energía solar
        </p>

        <p className="text-sm text-white/70 mb-4">* Campos obligatorios</p>

        {errors.general && <p className="text-red-400 text-center mb-2">{errors.general}</p>}
        {success && <p className="text-green-400 text-center mb-4 font-medium">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-white mb-1">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70"
            />
            {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-white mb-1">
              Correo <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70"
            />
            {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-white mb-1">
              Contraseña <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70"
            />
            {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
          </div>

          {/* Documento */}
          <div>
            <label className="block text-white mb-1">
              Documento <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-1/3 px-2 py-2 rounded-lg bg-white/30 text-black"
              >
                <option value="">Tipo</option>
                <option value="CC">Cédula</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
              </select>
              <input
                type="text"
                name="documentNumber"
                value={formData.documentNumber}
                onChange={handleChange}
                placeholder="Número"
                className="w-2/3 px-3 py-2 rounded-lg bg-white/30 text-white placeholder-white/70"
              />
            </div>
            {(errors.documentType || errors.documentNumber) && (
              <p className="text-red-400 text-sm">
                {errors.documentType || errors.documentNumber}
              </p>
            )}
          </div>

          {/* Términos */}
          <div className="space-y-2">
            <label className="flex items-start text-white text-sm">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="mr-2 mt-1"
              />
              Estoy de acuerdo con los{" "}
              <button
                type="button"
                onClick={() => setShowTerminos(!showTerminos)}
                className="text-[#3dc692] ml-1 inline-flex items-center gap-1"
              >
                Términos y Condiciones
                {showTerminos ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <span className="text-red-400 ml-1">*</span>
            </label>
            {showTerminos && (
              <div className="ml-6 p-4 bg-white/10 rounded-lg max-h-60 overflow-y-auto text-xs text-blue-200 space-y-2">
                <p>Al usar EcoEnergix aceptas cumplir estos términos.</p>
                <p>Eres responsable del uso de tu cuenta.</p>
                <p>Los precios pueden cambiar sin previo aviso.</p>
              </div>
            )}
            {errors.terms && <p className="text-red-400 text-sm ml-6">{errors.terms}</p>}
          </div>

          {/* Privacidad */}
          <div className="space-y-2">
            <label className="flex items-start text-white text-sm">
              <input
                type="checkbox"
                name="privacy"
                checked={formData.privacy}
                onChange={handleChange}
                className="mr-2 mt-1"
              />
              Acepto la{" "}
              <button
                type="button"
                onClick={() => setShowPrivacidad(!showPrivacidad)}
                className="text-[#3dc692] ml-1 inline-flex items-center gap-1"
              >
                Política de Privacidad
                {showPrivacidad ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <span className="text-red-400 ml-1">*</span>
            </label>
            {showPrivacidad && (
              <div className="ml-6 p-4 bg-white/10 rounded-lg max-h-60 overflow-y-auto text-xs text-blue-200 space-y-2">
                <p>Protegemos tus datos personales.</p>
                <p>No compartimos tu información con terceros.</p>
                <p>Puedes solicitar eliminación de datos.</p>
              </div>
            )}
            {errors.privacy && <p className="text-red-400 text-sm ml-6">{errors.privacy}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5f54b3] text-white py-2 rounded-lg hover:bg-[#3dc692] transition"
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>
      </div>
    </div>
  );
}
