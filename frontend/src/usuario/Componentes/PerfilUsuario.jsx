import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaIdCard,
} from "react-icons/fa";
import API from "../../services/api";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [tempUsuario, setTempUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fotoFile, setFotoFile] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL; // ej: http://localhost:3001

  // ======================
  // Cargar perfil
  // ======================
  const fetchPerfil = async () => {
    try {
      const res = await API.get("/user/perfil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = res.data;

      // Construir URL completa de la foto si existe
      if (userData.Foto_usuario && !userData.Foto_usuario.startsWith("http")) {
        userData.Foto_usuario = `${API_URL}${userData.Foto_usuario}`;
      }

      setUsuario(userData);
      setTempUsuario(userData);
      setPreviewFoto(userData.Foto_usuario || null);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      alert("No se pudo cargar el perfil. Revisa tu sesión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, [token]);

  if (loading) return <p className="text-white text-center mt-10">Cargando perfil...</p>;
  if (!usuario) return null;

  // ======================
  // Handlers
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = () => {
    setTempUsuario(usuario);
    setPreviewFoto(usuario.Foto_usuario || null);
    setEditando(true);
  };

  const handleCancelar = () => {
    setTempUsuario(usuario);
    setPreviewFoto(usuario.Foto_usuario || null);
    setFotoFile(null);
    setEditando(false);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setPreviewFoto(URL.createObjectURL(file));
  };

  // ======================
  // Guardar perfil
  // ======================
  const handleGuardar = async () => {
    try {
      // 1️⃣ Actualizar datos
      await API.put(
        "/user/perfil",
        {
          Nombre: tempUsuario.Nombre,
          Tipo_documento: tempUsuario.Tipo_documento,
          Numero_documento: tempUsuario.Numero_documento,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Subir foto si existe
      if (fotoFile) {
        const formData = new FormData();
        formData.append("foto", fotoFile);
        const resFoto = await API.post("/user/perfil/foto", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        let nuevaFoto = resFoto.data.usuario.Foto_usuario;
        if (nuevaFoto && !nuevaFoto.startsWith("http")) {
          nuevaFoto = `${API_URL}${nuevaFoto}`;
        }
        tempUsuario.Foto_usuario = nuevaFoto;
        setPreviewFoto(nuevaFoto);
      }

      setUsuario({ ...tempUsuario });
      setEditando(false);
      setFotoFile(null);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error al actualizar perfil");
    }
  };

  // ======================
  // Render
  // ======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">Mi Perfil</h1>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                {previewFoto ? (
                  <img src={previewFoto} alt="Foto perfil" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-white w-14 h-14" />
                )}
              </div>

              {editando && (
                <>
                  <label
                    htmlFor="foto"
                    className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer"
                  >
                    <FaCamera className="text-white" />
                  </label>
                  <input id="foto" type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                </>
              )}
            </div>
          </div>

          {/* Datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-white text-sm flex items-center gap-2 mb-1">
                <FaUser /> Nombre
              </label>
              <input
                type="text"
                name="Nombre"
                value={editando ? tempUsuario.Nombre : usuario.Nombre}
                onChange={handleChange}
                disabled={!editando}
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
              />
            </div>

            <div>
              <label className="text-white text-sm flex items-center gap-2 mb-1">
                <FaEnvelope /> Correo
              </label>
              <input
                type="text"
                value={usuario.Correo_electronico}
                disabled
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20 opacity-60"
              />
            </div>

            <div>
              <label className="text-white text-sm flex items-center gap-2 mb-1">
                <FaIdCard /> Tipo de documento
              </label>
              <input
                type="text"
                name="Tipo_documento"
                value={editando ? tempUsuario.Tipo_documento : usuario.Tipo_documento}
                onChange={handleChange}
                disabled={!editando}
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
              />
            </div>

            <div>
              <label className="text-white text-sm flex items-center gap-2 mb-1">
                <FaIdCard /> Número de documento
              </label>
              <input
                type="text"
                name="Numero_documento"
                value={editando ? tempUsuario.Numero_documento : usuario.Numero_documento}
                onChange={handleChange}
                disabled={!editando}
                className="w-full p-3 rounded-xl bg-white/10 text-white border border-white/20"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8">
            {!editando ? (
              <button
                onClick={handleEditar}
                className="px-6 py-3 bg-green-500 text-white rounded-xl flex items-center gap-2"
              >
                <FaEdit /> Editar
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancelar}
                  className="px-6 py-3 bg-gray-500 text-white rounded-xl flex items-center gap-2"
                >
                  <FaTimes /> Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center gap-2"
                >
                  <FaSave /> Guardar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
