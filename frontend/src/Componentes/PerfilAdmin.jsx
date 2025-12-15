import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
} from "react-icons/fa";
import APIAdmin from "../admin/services/api";

export default function PerfilAdmin() {
  const fileInputRef = useRef(null);

  const [admin, setAdmin] = useState({
    Nombre: "",
    Correo_electronico: "",
    Tipo_documento: "",
    Numero_documento: "",
    Foto_usuario: "",
  });

  const [tempAdmin, setTempAdmin] = useState(admin);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================================
  // Cargar perfil admin
  // ================================
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await APIAdmin.get("/admin/perfil");
        setAdmin(res.data);
        setTempAdmin(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          setError("No se pudo cargar el perfil");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  // ================================
  // Handlers
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = () => setEditando(true);

  const handleCancelar = () => {
    setTempAdmin(admin);
    setEditando(false);
  };

  const handleGuardar = async () => {
    try {
      const res = await APIAdmin.put("/admin/perfil", tempAdmin);
      setAdmin(res.data);
      setEditando(false);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    }
  };

  // ================================
  // Subir foto de perfil
  // ================================
  const handleFotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await APIAdmin.post("/admin/foto", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAdmin((prev) => ({
        ...prev,
        Foto_usuario: res.data.Foto_usuario,
      }));
    } catch (err) {
      console.error(err);
      alert("Error al subir la foto");
    }
  };

  if (loading)
    return <p className="text-white text-center mt-20">Cargando perfil...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="relative h-32 bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2]">
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3dc692] to-[#5f54b3] p-1">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                  {admin.Foto_usuario ? (
                    <img
                      src={`http://localhost:3001${admin.Foto_usuario}`}
                      alt="Foto perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="w-16 h-16 text-white" />
                  )}
                </div>
              </div>

              <button
                onClick={handleFotoClick}
                className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] rounded-full shadow-lg hover:scale-110 transition"
              >
                <FaCamera className="text-white w-4 h-4" />
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFotoChange}
                hidden
              />
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="pt-20 p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">
              {admin.Nombre}
            </h1>
            <p className="text-blue-200 flex items-center justify-center gap-2">
              <FaShieldAlt /> Administrador
            </p>
          </div>

          {/* FORM */}
          {[
            ["Nombre", FaUser],
            ["Correo_electronico", FaEnvelope],
            ["Tipo_documento", FaIdCard],
            ["Numero_documento", FaIdCard],
          ].map(([field, Icon]) => (
            <div key={field}>
              <label className="flex items-center gap-2 text-blue-200 font-semibold">
                <Icon /> {field.replace("_", " ")}
              </label>
              <input
                type="text"
                name={field}
                value={editando ? tempAdmin[field] : admin[field]}
                onChange={handleChange}
                disabled={!editando}
                className={`w-full p-4 rounded-xl border transition-all ${
                  editando
                    ? "border-[#3dc692] bg-white/10 text-white focus:ring-2 focus:ring-[#3dc692]"
                    : "bg-white/5 border-white/10 text-gray-300 cursor-not-allowed"
                }`}
              />
            </div>
          ))}

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            {!editando ? (
              <button
                onClick={handleEditar}
                className="px-6 py-3 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:scale-105 transition"
              >
                <FaEdit className="inline mr-2" />
                Editar Información
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelar}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl"
                >
                  <FaTimes className="inline mr-2" />
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:scale-105"
                >
                  <FaSave className="inline mr-2" />
                  Guardar Cambios
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
