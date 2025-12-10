import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaEnvelope,
  FaShieldAlt,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaBolt,
  FaSearch,
  FaDownload,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import APIAdmin from "../admin/services/api";
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

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ======================
  // API
  // ======================
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await APIAdmin.get("/admin/usuarios");
      setUsuarios(Array.isArray(res.data.data) ? res.data.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener los usuarios.");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Nombre || !formData.Correo_electronico || !formData.Rol_usuario) {
      alert("Nombre, correo y rol son obligatorios");
      return;
    }

    if (!editMode && !formData.Contrasena) {
      alert("La contraseña es obligatoria");
      return;
    }

    try {
      if (editMode) {
        await APIAdmin.put(
          `/admin/usuarios/${formData.ID_usuario}`,
          formData
        );
        alert("Usuario actualizado");
      } else {
        await APIAdmin.post("/admin/usuarios", {
          ...formData,
          Debe_cambiar_contrasena: true,
        });
        alert("Usuario creado");
      }

      resetForm();
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al guardar usuario");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    try {
      await APIAdmin.delete(`/admin/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar");
    }
  };

  const handleEdit = (usuario) => {
    setFormData({ ...usuario, Contrasena: "" });
    setEditMode(true);
    setShowForm(true);
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

  const filteredUsuarios = usuarios.filter((u) => {
    const rol = u.Rol_usuario?.toLowerCase() || "";
    const estado = u.Estado_usuario?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      (!filterRol || rol === filterRol.toLowerCase()) &&
      (!filterEstado || estado === filterEstado.toLowerCase()) &&
      (
        u.Nombre?.toLowerCase().includes(search) ||
        u.Correo_electronico?.toLowerCase().includes(search) ||
        u.Numero_documento?.includes(search)
      )
    );
  });

  const handleExportPDF = () => {
    exportTableToPDF(
      "Usuarios",
      ["ID", "Nombre", "Correo", "Rol", "Estado"],
      filteredUsuarios.map((u) => [
        u.ID_usuario,
        u.Nombre,
        u.Correo_electronico,
        u.Rol_usuario,
        u.Estado_usuario,
      ])
    );
  };

  // ======================
  // UI helpers
  // ======================
  const getRoleIcon = (r) =>
    r === "administrador" ? <FaShieldAlt /> :
    r === "domiciliario" ? <FaBolt /> : <FaUsers />;

  // ======================
  // RENDER
  // ======================
  if (loading) return <div className="text-white text-center p-10">Cargando...</div>;
  if (error) return <div className="text-red-400 text-center p-10">{error}</div>;

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold mb-6">Gestión de Usuarios</h1>

      <button
        onClick={() => setShowForm(true)}
        className="mb-4 bg-green-600 px-4 py-2 rounded"
      >
        <FaUserPlus /> Nuevo
      </button>

      <button
        onClick={handleExportPDF}
        className="ml-2 bg-blue-600 px-4 py-2 rounded"
      >
        <FaDownload /> PDF
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/10 p-4 rounded mb-6">
          <input
            name="Nombre"
            placeholder="Nombre"
            value={formData.Nombre}
            onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}
          />
          <input
            name="Correo_electronico"
            placeholder="Correo"
            value={formData.Correo_electronico}
            onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}
          />
          <input
            type={showPassword ? "text" : "password"}
            name="Contrasena"
            placeholder="Contraseña"
            value={formData.Contrasena}
            onChange={(e)=>setFormData({...formData,[e.target.name]:e.target.value})}
          />
          <button type="submit">Guardar</button>
          <button type="button" onClick={resetForm}>Cancelar</button>
        </form>
      )}

      {filteredUsuarios.map((u) => (
        <div
          key={u.ID_usuario}
          className="bg-white/10 p-4 rounded mb-2 flex justify-between"
        >
          <div>
            {getRoleIcon(u.Rol_usuario)} {u.Nombre} — {u.Correo_electronico}
          </div>
          <div>
            <button onClick={() => handleEdit(u)}><FaEdit /></button>
            <button onClick={() => handleDelete(u.ID_usuario)}><FaTrash /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
