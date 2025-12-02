import React, { useState, useEffect } from "react";
import { FaUsers, FaEnvelope, FaShieldAlt, FaEdit, FaTrash, FaUserPlus, FaBolt, FaSearch, FaDownload, FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    ID_usuario: null,
    Nombre: "",
    Correo_electronico: "",
    Contrasena: "",
    Rol_usuario: "domiciliario",
    Tipo_documento: "",
    Numero_documento: "",
    Foto_usuario: "",
    Estado_usuario: "activo",
    Debe_cambiar_contrasena: true,
  });
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await API.get("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      // Mostrar todos los usuarios (sin filtrar)
      setUsuarios(data);
      setError("");
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("No se pudo conectar con el servidor.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Nombre || !formData.Correo_electronico || !formData.Rol_usuario) {
      alert("Nombre, correo y rol son obligatorios");
      return;
    }

    if (!editMode && !formData.Contrasena) {
      alert("La contraseña es obligatoria para crear un nuevo usuario");
      return;
    }

    try {
      if (editMode) {
        await API.put(`/usuarios/${formData.ID_usuario}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Usuario actualizado correctamente");
      } else {
        // Al crear, siempre marcar que debe cambiar contraseña
        const dataToSend = {
          ...formData,
          Debe_cambiar_contrasena: true
        };
        await API.post("/usuarios", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Usuario creado correctamente. Deberá cambiar su contraseña en el primer inicio de sesión.");
      }
      resetForm();
      fetchUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert(err.response?.data?.message || "Error al guardar usuario.");
    }
  };

  const resetForm = () => {
    setFormData({
      ID_usuario: null,
      Nombre: "",
      Correo_electronico: "",
      Contrasena: "",
      Rol_usuario: "domiciliario",
      Tipo_documento: "",
      Numero_documento: "",
      Foto_usuario: "",
      Estado_usuario: "activo",
      Debe_cambiar_contrasena: true,
    });
    setEditMode(false);
    setShowForm(false);
    setShowPassword(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await API.delete(`/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Usuario eliminado correctamente");
      fetchUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    // Al editar, no incluimos la contraseña
    setFormData({
      ...usuario,
      Contrasena: ""
    });
    setEditMode(true);
    setShowForm(true);
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesRol = filterRol ? u.Rol_usuario?.toLowerCase() === filterRol.toLowerCase() : true;
    const matchesEstado = filterEstado ? u.Estado_usuario?.toLowerCase() === filterEstado.toLowerCase() : true;
    const matchesSearch =
      u.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Correo_electronico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.Numero_documento?.includes(searchTerm) ?? false);
    return matchesRol && matchesEstado && matchesSearch;
  });

  const handleExportPDF = () => {
    const columns = ["ID", "Nombre", "Correo", "Rol", "Documento", "Estado"];
    const rows = filteredUsuarios.map((u) => [
      u.ID_usuario,
      u.Nombre,
      u.Correo_electronico,
      u.Rol_usuario,
      `${u.Tipo_documento || ""} ${u.Numero_documento || ""}`,
      u.Estado_usuario,
    ]);
    exportTableToPDF("Usuarios Registrados", columns, rows);
  };

  const getRoleColor = (role) => {
    switch(role?.toLowerCase()) {
      case "administrador": return "from-amber-400 to-orange-500";
      case "cliente": return "from-emerald-400 to-teal-500";
      case "domiciliario": return "from-blue-400 to-indigo-500";
      default: return "from-gray-400 to-gray-500";
    }
  };

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case "administrador": return <FaShieldAlt className="w-4 h-4" />;
      case "cliente": return <FaUsers className="w-4 h-4" />;
      case "domiciliario": return <FaBolt className="w-4 h-4" />;
      default: return <FaUsers className="w-4 h-4" />;
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Cargando usuarios...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-red-400 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-[#00C9A7] to-[#7D5FFF] rounded-xl">
            <FaUsers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Gestión de Usuarios</h1>
            <p className="text-blue-200">Administra todos los usuarios del sistema</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Total Usuarios</p>
                <p className="text-3xl font-bold text-white">{usuarios.length}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Administradores</p>
                <p className="text-3xl font-bold text-white">
                  {usuarios.filter(u => u.Rol_usuario?.toLowerCase() === "administrador").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Clientes</p>
                <p className="text-3xl font-bold text-white">
                  {usuarios.filter(u => u.Rol_usuario?.toLowerCase() === "cliente").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Domiciliarios</p>
                <p className="text-3xl font-bold text-white">
                  {usuarios.filter(u => u.Rol_usuario?.toLowerCase() === "domiciliario").length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <FaBolt className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
            />
          </div>

          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
          >
            <option value="" className="bg-slate-800">Todos los roles</option>
            <option value="Administrador" className="bg-slate-800">Administrador</option>
            <option value="Cliente" className="bg-slate-800">Cliente</option>
            <option value="Domiciliario" className="bg-slate-800">Domiciliario</option>
          </select>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
          >
            <option value="" className="bg-slate-800">Todos los estados</option>
            <option value="Activo" className="bg-slate-800">Activo</option>
            <option value="Inactivo" className="bg-slate-800">Inactivo</option>
          </select>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <FaDownload className="w-4 h-4" />
            PDF
          </button>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white font-semibold hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <FaUserPlus className="w-5 h-5" />
              Agregar
            </button>
          )}
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {editMode ? <FaEdit className="w-5 h-5" /> : <FaUserPlus className="w-5 h-5" />}
              {editMode ? "Editar Usuario" : "Nuevo Usuario"}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-blue-200 text-sm mb-1 block">Nombre completo *</label>
                <input
                  type="text"
                  name="Nombre"
                  placeholder="Ej: Juan Pérez"
                  value={formData.Nombre}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                  required
                />
              </div>

              <div>
                <label className="text-blue-200 text-sm mb-1 block">Correo electrónico *</label>
                <input
                  type="email"
                  name="Correo_electronico"
                  placeholder="correo@ejemplo.com"
                  value={formData.Correo_electronico}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                  required
                />
              </div>

              <div>
                <label className="text-blue-200 text-sm mb-1 block">
                  Contraseña {editMode ? "(dejar vacío para no cambiar)" : "*"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Contrasena"
                    placeholder={editMode ? "Nueva contraseña (opcional)" : "Contraseña temporal"}
                    value={formData.Contrasena}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00C9A7] pr-10"
                    required={!editMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {!editMode && (
                  <p className="text-xs text-blue-300 mt-1">
                    El usuario deberá cambiar esta contraseña en su primer inicio de sesión
                  </p>
                )}
              </div>

              <div>
                <label className="text-blue-200 text-sm mb-1 block">Rol del usuario *</label>
                <select
                  name="Rol_usuario"
                  value={formData.Rol_usuario}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                >
                  <option value="domiciliario" className="bg-slate-800">Domiciliario</option>
                  <option value="administrador" className="bg-slate-800">Administrador</option>
                </select>
              </div>

              <div>
                <label className="text-blue-200 text-sm mb-1 block">Estado</label>
                <select
                  name="Estado_usuario"
                  value={formData.Estado_usuario}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                >
                  <option value="activo" className="bg-slate-800">Activo</option>
                  <option value="inactivo" className="bg-slate-800">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="text-blue-200 text-sm mb-1 block">Tipo de documento</label>
                <input
                  type="text"
                  name="Tipo_documento"
                  placeholder="C.C., T.I., etc."
                  value={formData.Tipo_documento}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                />
              </div>

              <div>
                <label className="text-blue-200 text-sm mb-1 block">Número de documento</label>
                <input
                  type="text"
                  name="Numero_documento"
                  placeholder="123456789"
                  value={formData.Numero_documento}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-white/20 bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00C9A7]"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                {editMode ? "Actualizar Usuario" : "Crear Usuario"}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="space-y-4">
        {filteredUsuarios.length > 0 ? (
          filteredUsuarios.map((usuario) => (
            <div
              key={usuario.ID_usuario}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-[#00C9A7]/50 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00C9A7] to-[#7D5FFF] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {usuario.Nombre?.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">{usuario.Nombre}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-blue-200">
                        <FaEnvelope className="w-4 h-4" />
                        {usuario.Correo_electronico}
                      </span>
                      {usuario.Numero_documento && (
                        <span className="text-blue-300">
                          {usuario.Tipo_documento} {usuario.Numero_documento}
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r ${getRoleColor(usuario.Rol_usuario)} text-white text-xs font-semibold`}>
                        {getRoleIcon(usuario.Rol_usuario)}
                        {usuario.Rol_usuario}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        usuario.Estado_usuario?.toLowerCase() === "activo" 
                          ? "bg-green-500/20 text-green-300 border border-green-500/50" 
                          : "bg-red-500/20 text-red-300 border border-red-500/50"
                      }`}>
                        {usuario.Estado_usuario}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-400/50 text-blue-300 hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                  >
                    <FaEdit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.ID_usuario)}
                    className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/50 text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-2 group-hover:scale-105"
                  >
                    <FaTrash className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00C9A7] to-[#7D5FFF] flex items-center justify-center opacity-50">
              <FaUsers className="w-10 h-10 text-white" />
            </div>
            <p className="text-xl text-blue-200 mb-2">No hay usuarios registrados</p>
            <p className="text-blue-300/60">
              {searchTerm || filterRol || filterEstado 
                ? "No se encontraron usuarios con los filtros aplicados" 
                : "Comienza agregando tu primer usuario"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}