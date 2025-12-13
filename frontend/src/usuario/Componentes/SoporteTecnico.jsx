import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHeadset, 
  FaEnvelope, 
  FaPhone, 
  FaWhatsapp,
  FaArrowLeft,
  FaCheckCircle,
  FaQuestionCircle,
  FaTools,
  FaCreditCard,
  FaTruck,
  FaExclamationCircle
} from "react-icons/fa";

export default function SoporteTecnico() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    categoria: "",
    asunto: "",
    mensaje: ""
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const categorias = [
    { id: "instalacion", nombre: "Instalación", icon: <FaTools className="w-5 h-5" /> },
    { id: "pago", nombre: "Problemas de pago", icon: <FaCreditCard className="w-5 h-5" /> },
    { id: "entrega", nombre: "Envío y entrega", icon: <FaTruck className="w-5 h-5" /> },
    { id: "tecnico", nombre: "Soporte técnico", icon: <FaHeadset className="w-5 h-5" /> },
    { id: "otro", nombre: "Otro", icon: <FaQuestionCircle className="w-5 h-5" /> }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const enviarSoporte = async (e) => {
    e.preventDefault();
    
    // Validación
    if (!formData.nombre || !formData.email || !formData.categoria || !formData.mensaje) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setEnviando(true);

    try {
      // Aquí conectarías con tu backend
      // const response = await fetch('http://localhost:5000/api/soporte', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulación de envío
      setTimeout(() => {
        setEnviando(false);
        setEnviado(true);
        
        // Limpiar formulario después de 3 segundos
        setTimeout(() => {
          setFormData({
            nombre: "",
            email: "",
            telefono: "",
            categoria: "",
            asunto: "",
            mensaje: ""
          });
          setEnviado(false);
        }, 3000);
      }, 2000);

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setEnviando(false);
      alert('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header con botón volver */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-blue-200 hover:text-white hover:border-[#3dc692]/50 transition-all"
          >
            <FaArrowLeft className="w-5 h-5" />
            Volver
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#3dc692] to-[#5f54b3] rounded-xl">
              <FaHeadset className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
              Soporte Técnico
            </h1>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="text-center mb-8">
          <p className="text-blue-200 text-lg">
            Estamos aquí para ayudarte. Completa el formulario y te responderemos pronto
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2">
            {enviado ? (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FaCheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  ¡Solicitud enviada!
                </h2>
                <p className="text-blue-200 mb-2">
                  Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo pronto.
                </p>
                <p className="text-sm text-gray-300">
                  Tiempo estimado de respuesta: 24-48 horas
                </p>
              </div>
            ) : (
              <form onSubmit={enviarSoporte} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                    Información de Contacto
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 text-sm font-semibold mb-2">
                        Nombre completo <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Juan Pérez"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-blue-200 text-sm font-semibold mb-2">
                        Correo electrónico <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-blue-200 text-sm font-semibold mb-2">
                      Teléfono (opcional)
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Categoría del problema <span className="text-red-400">*</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, categoria: cat.id })}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                          formData.categoria === cat.id
                            ? "border-[#3dc692] bg-[#3dc692]/10"
                            : "border-white/20 bg-white/5 hover:border-white/40"
                        }`}
                      >
                        <div className={formData.categoria === cat.id ? "text-[#3dc692]" : "text-white"}>
                          {cat.icon}
                        </div>
                        <span className={`text-sm font-semibold ${
                          formData.categoria === cat.id ? "text-[#3dc692]" : "text-white"
                        }`}>
                          {cat.nombre}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    placeholder="Breve descripción del problema"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition"
                  />
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-semibold mb-2">
                    Describe tu problema <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    placeholder="Explica detalladamente tu problema para que podamos ayudarte mejor..."
                    required
                    rows="6"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-[#3dc692] focus:ring-2 focus:ring-[#3dc692]/50 transition resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Mínimo 20 caracteres - {formData.mensaje.length}/500
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={enviando}
                  className="w-full py-4 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-bold hover:shadow-xl hover:shadow-[#3dc692]/50 transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enviando ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="w-5 h-5" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Información de contacto */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contacto directo */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                Contacto Directo
              </h3>

              <div className="space-y-4">
                <a
                  href="mailto:ecoenergix2@gmail.com"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition group"
                >
                  <div className="p-2 bg-[#3dc692]/20 rounded-lg group-hover:bg-[#3dc692] transition">
                    <FaEnvelope className="w-5 h-5 text-[#3dc692] group-hover:text-white transition" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-200">Email</p>
                    <p className="text-white font-semibold text-sm">ecoenergix2@gmail.com</p>
                  </div>
                </a>

                <a
                  href="tel:+573001234567"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition group"
                >
                  <div className="p-2 bg-[#5f54b3]/20 rounded-lg group-hover:bg-[#5f54b3] transition">
                    <FaPhone className="w-5 h-5 text-[#5f54b3] group-hover:text-white transition" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-200">Teléfono</p>
                    <p className="text-white font-semibold text-sm">+57 300 123 4567</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/573001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition group"
                >
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500 transition">
                    <FaWhatsapp className="w-5 h-5 text-green-400 group-hover:text-white transition" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-200">WhatsApp</p>
                    <p className="text-white font-semibold text-sm">+57 300 123 4567</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Horario de atención */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                Horario de Atención
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-blue-200">
                  <span>Lunes - Viernes</span>
                  <span className="text-white font-semibold">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Sábados</span>
                  <span className="text-white font-semibold">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Domingos</span>
                  <span className="text-red-300 font-semibold">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Tiempo de respuesta */}
            <div className="bg-gradient-to-r from-[#3dc692]/10 to-[#5f54b3]/10 border border-[#3dc692]/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <FaExclamationCircle className="w-6 h-6 text-[#3dc692] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-bold mb-2">Tiempo de Respuesta</h4>
                  <p className="text-blue-200 text-sm">
                    Respondemos todas las solicitudes en un plazo máximo de 24-48 horas laborales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}