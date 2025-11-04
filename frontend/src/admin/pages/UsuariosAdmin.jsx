import React, { useState, useEffect } from "react";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../services/usersServiceAdmin";
import logo from "../../assets/EcoEnergixLog.png";
import fondo from "../../assets/camion-solar-1.jpg";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    ID_usuario: null,
    Nombre: "",
    Correo_electronico: "",
    Rol_usuario: "",
    Tipo_documento: "",
    Numero_documento: "",
    Foto_usuario: "",
    Estado_usuario: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      console.log("👥 Usuarios recibidos:", data);
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        console.warn("⚠️ Respuesta inesperada:", data);
      }
    } catch (err) {
      console.error("❌ Error al cargar usuarios:", err);
    }
  };

  // 📝 Manejo de formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Nombre, Correo_electronico, Rol_usuario } = form;

    if (!Nombre || !Correo_electronico || !Rol_usuario)
      return alert("⚠️ Nombre, correo y rol son obligatorios");

    try {
      if (isEditing) {
        await updateUsuario(form.ID_usuario, form);
        setIsEditing(false);
      } else {
        await createUsuario(form);
      }
      setForm({
        ID_usuario: null,
        Nombre: "",
        Correo_electronico: "",
        Rol_usuario: "",
        Tipo_documento: "",
        Numero_documento: "",
        Foto_usuario: "",
        Estado_usuario: "",
      });
      fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
    }
  };

  // ✏️ Editar usuario
  const handleEdit = (usuario) => {
    setForm(usuario);
    setIsEditing(true);
  };

  // 🗑️ Eliminar usuario
  const handleDelete = async (ID_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await deleteUsuario(ID_usuario);
      fetchUsuarios();
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
    }
  };

  // 🎨 Estilo vidrio
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
  };

  return (
    <div
      className="p-8 space-y-8 relative min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      {/* Encabezado */}
      <div style={glassStyle} className="p-6 flex items-center gap-4">
        <img
          src={logo}
          alt="EcoEnergix Logo"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold text-white">Gestión de Usuarios</h2>
          <p className="text-sm text-white/70 mt-1">
            Administra los usuarios registrados en el sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div style={glassStyle} className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-center justify-between"
        >
          <input
            type="text"
            name="Nombre"
            placeholder="Nombre"
            value={form.Nombre}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <input
            type="email"
            name="Correo_electronico"
            placeholder="Correo electrónico"
            value={form.Correo_electronico}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <input
            type="text"
            name="Rol_usuario"
            placeholder="Rol (Administrador / Cliente)"
            value={form.Rol_usuario}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-teal-400 to-purple-500 hover:scale-105 transition"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.ID_usuario} className="hover:bg-white/20 text-white">
                  <td className="p-3">{u.ID_usuario}</td>
                  <td className="p-3">{u.Nombre}</td>
                  <td className="p-3">{u.Correo_electronico}</td>
                  <td className="p-3">{u.Rol_usuario}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.ID_usuario)}
                      className="px-4 py-2 rounded-xl border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white/60">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
