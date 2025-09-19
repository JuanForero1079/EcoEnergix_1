import { useState } from "react"
import { Link } from "react-router-dom"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    documentType: "",
    documentNumber: "",
    terms: false,
    privacy: false,
    
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.documentType ||
      !formData.documentNumber
    ) {
      alert("Por favor, completa todos los campos antes de registrarte.");
      return;
    }

    if (!formData.terms || !formData.privacy) {
      alert("Debes aceptar los Términos y Condiciones y la Política de Privacidad.");
      return;
    }

    alert(`Registro con: ${formData.name} - ${formData.email}`);

    setFormData({
    name: "",
    email: "",
    password: "",
    documentType: "",
    documentNumber: "",
    terms: false,
    privacy: false,
  });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-17 sm:py-10">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Crear Cuenta
        </h2>
        <p className="text-base text-center text-white/80 mb-6">
          Regístrate y empieza a ahorrar con energía solar
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-white mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ingresa tu nombre"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#5f54b3] outline-none"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-white mb-1">Correo</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#3dc692] outline-none"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-white mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Crea una contraseña"
              value={formData.password}
              onChange={handleChange}
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
                className="w-1/3 px-2 py-2 rounded-lg bg-white/30 text-white focus:ring-2 focus:ring-[#3dc692] outline-none"
                required
              >
                <option value="" disabled hidden>Tipo</option>
                <option value="CC" className="bg-[#4375b2]/80 text-white">Cédula</option>
                <option value="TI" className="bg-[#4375b2]/80 text-white">Tarjeta Identidad</option>
                <option value="CE" className="bg-[#4375b2]/80 text-white">Cédula Extranjería</option>
              </select>
              <input
                type="text"
                name="documentNumber"
                required
                placeholder="Número"
                value={formData.documentNumber}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 rounded-lg bg-white/30 text-white placeholder-white/70 focus:ring-2 focus:ring-[#5f54b3] outline-none"
              />
            </div>
          </div>

          {/* Terminos y Politica */}
          <div className="space-y-2">
            <label className="flex items-center text-white text-sm">
              <input 
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mr-2" /> 
              Estoy de acuerdo con los{" "}
             <Link to="/terms" className="ml-1 text-[#3dc692] hover:underline">
                Términos y Condiciones
              </Link>
            </label>
            <label className="flex items-center text-white text-sm">
              <input 
              type="checkbox" 
              name="privacy"
              checked={formData.privacy}
              onChange={handleChange}
              className="mr-2" /> 
              Acepto la {" "} 
               <Link to="/privacy" className="ml-1 text-[#3dc692] hover:underline">
                 Política de Privacidad
              </Link>
            </label>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r bg-[#5f54b3] text-white py-2 rounded-lg hover:bg-[#3dc692] transition"
          >
            Registrarme
          </button>
        </form>

        <p className="text-sm text-white text-center mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-[#3dc692] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

