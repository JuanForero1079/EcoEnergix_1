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
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

/* ======================
   Input reutilizable
====================== */
function Input({ label, icon, name, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="text-white/80 mb-1 block">{label}</label>
      <div className="flex items-center bg-white/10 border border-white/20 rounded-xl px-4 py-3">
        <span className="text-white/70 mr-3">{icon}</span>
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent text-white outline-none disabled:text-white/50"
        />
      </div>
    </div>
  );
}

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState(null);
  const [tempUsuario, setTempUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);

  const [fotoFile, setFotoFile] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  // Eliminar cuenta
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  /* ======================
     Cargar perfil
  ====================== */
  const fetchPerfil = async () => {
    try {
      const res = await API.get("/user/perfil");
      const data = res.data;

      if (data.Foto_usuario && !data.Foto_usuario.startsWith("http")) {
        data.Foto_usuario = `${API_URL}${data.Foto_usuario}`;
      }

      setUsuario(data);
      setTempUsuario({ ...data });
      setPreviewFoto(data.Foto_usuario || null);
    } catch (error) {
      console.error("Error cargando perfil:", error);
      alert("No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  if (loading) {
    return (
      <p className="text-white text-center mt-10">
        Cargando perfil...
      </p>
    );
  }

  if (!usuario || !tempUsuario) return null;

  /* ======================
     Handlers
  ====================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = () => {
    setTempUsuario({ ...usuario });
    setPreviewFoto(usuario.Foto_usuario || null);
    setEditando(true);
  };

  const handleCancelar = () => {
    setTempUsuario({ ...usuario });
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

  /* ======================
     Guardar perfil
  ====================== */
  const handleGuardar = async () => {
    try {
      await API.put("/user/perfil", {
        Nombre: tempUsuario.Nombre,
        Tipo_documento: tempUsuario.Tipo_documento,
        Numero_documento: tempUsuario.Numero_documento,
      });

      if (fotoFile) {
        const formData = new FormData();
        formData.append("foto", fotoFile);

        const resFoto = await API.post("/user/perfil/foto", formData);

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
      alert("Error al actualizar el perfil");
    }
  };

  /* ======================
     Eliminar cuenta (FIX REAL)
  ====================== */
  const handleDeleteAccount = async () => {
    if (!passwordConfirm) {
      alert("Debes confirmar tu contraseña");
      return;
    }

    const confirmar = window.confirm(
      "  Esta acción es irreversible. ¿Deseas eliminar tu cuenta?"
    );
    if (!confirmar) return;

    try {
      setDeleting(true);

      // ✅ POST (NO DELETE)
      await API.post("/auth/delete-account", {
        password: passwordConfirm,
      });

      localStorage.clear();
      alert("Cuenta eliminada correctamente");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        "Error al eliminar la cuenta"
      );
    } finally {
      setDeleting(false);
      setPasswordConfirm("");
    }
  };

  /* ======================
     Render
  ====================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Mi Perfil
        </h1>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8">
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                {previewFoto ? (
                  <img
                    src={previewFoto}
                    alt="Foto perfil"
                    className="w-full h-full object-cover"
                  />
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
                  <input
                    id="foto"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFotoChange}
                  />
                </>
              )}
            </div>
          </div>

          {/* Datos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              icon={<FaUser />}
              name="Nombre"
              value={tempUsuario.Nombre}
              onChange={handleChange}
              disabled={!editando}
            />

            <Input
              label="Correo"
              icon={<FaEnvelope />}
              value={usuario.Correo_electronico}
              disabled
            />

            <Input
              label="Tipo de documento"
              icon={<FaIdCard />}
              name="Tipo_documento"
              value={tempUsuario.Tipo_documento}
              onChange={handleChange}
              disabled={!editando}
            />

            <Input
              label="Número de documento"
              icon={<FaIdCard />}
              name="Numero_documento"
              value={tempUsuario.Numero_documento}
              onChange={handleChange}
              disabled={!editando}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-8">
            {!editando ? (
              <button onClick={handleEditar} className="btn-green">
                <FaEdit /> Editar
              </button>
            ) : (
              <>
                <button onClick={handleCancelar} className="btn-gray">
                  <FaTimes /> Cancelar
                </button>
                <button onClick={handleGuardar} className="btn-blue">
                  <FaSave /> Guardar
                </button>
              </>
            )}
          </div>

          {/* Zona de peligro */}
          <div className="mt-12 border-t border-red-500/40 pt-8">
            <h2 className="text-xl font-bold text-red-400 mb-4">
                Zona de peligro
            </h2>

            <input
              type="password"
              placeholder="Confirma tu contraseña"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/10 text-white border border-red-500/40 mb-4"
            />

            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
            >
              {deleting ? "Eliminando cuenta..." : "Eliminar cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
