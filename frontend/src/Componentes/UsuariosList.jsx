import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_usuario: null,
    Nombre: "",
    Correo_electronico: "",
    Rol_usuario: "cliente",
    Tipo_documento: "",
    Numero_documento: "",
    Foto_usuario: "",
    Estado_usuario: "activo",
  });
  const [editMode, setEditMode] = useState(false);

  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ================================
  // Traer token de localStorage
  // ================================
  const token = localStorage.getItem("accessToken"); // debe guardarse al login

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

  const validateForm = () => {
    if (!formData.Nombre || !formData.Correo_electronico || !formData.Rol_usuario) {
      alert("Nombre, correo y rol son obligatorios.");
      return false;
    }
    const roles = ["administrador", "cliente", "domiciliario"];
    if (!roles.includes(formData.Rol_usuario.toLowerCase())) {
      alert("Rol inválido. Debe ser Administrador, Cliente o Domiciliario.");
      return false;
    }
    const estados = ["activo", "inactivo"];
    if (!estados.includes(formData.Estado_usuario.toLowerCase())) {
      alert("Estado inválido. Debe ser activo o inactivo.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSend = { ...formData, Rol_usuario: formData.Rol_usuario.toLowerCase() };
      if (editMode) {
        await API.put(`/usuarios/${formData.ID_usuario}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Usuario actualizado correctamente");
      } else {
        await API.post("/usuarios", dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Usuario creado correctamente");
      }

      setFormData({
        ID_usuario: null,
        Nombre: "",
        Correo_electronico: "",
        Rol_usuario: "cliente",
        Tipo_documento: "",
        Numero_documento: "",
        Foto_usuario: "",
        Estado_usuario: "activo",
      });
      setEditMode(false);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert(err.response?.data?.message || "Error al guardar usuario.");
    }
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
      alert(err.response?.data?.message || "No se pudo eliminar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setEditMode(true);
  };

  const handleBulkUpload = async () => {
    const usuariosMasivos = [
      { Nombre: "Juan", Correo_electronico: "juan@mail.com", Rol_usuario: "cliente", Tipo_documento: "CC", Numero_documento: "12345" },
      { Nombre: "Ana", Correo_electronico: "ana@mail.com", Rol_usuario: "administrador", Tipo_documento: "CC", Numero_documento: "67890" },
      { Nombre: "Pedro", Correo_electronico: "pedro@mail.com", Rol_usuario: "domiciliario", Tipo_documento: "CC", Numero_documento: "11223" },
    ];

    try {
      const res = await API.post("/usuarios/bulk", usuariosMasivos, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      fetchUsuarios();
    } catch (err) {
      console.error("Error en carga masiva:", err);
      alert(err.response?.data?.message || "No se pudieron cargar los usuarios.");
    }
  };

  const handleExportPDF = () => {
    const columns = ["ID", "Nombre", "Correo", "Rol", "Tipo Doc.", "N° Doc.", "Foto", "Estado"];
    const rows = filteredUsuarios.map((u) => [
      u.ID_usuario,
      u.Nombre,
      u.Correo_electronico,
      u.Rol_usuario,
      u.Tipo_documento,
      u.Numero_documento,
      u.Foto_usuario || "—",
      u.Estado_usuario,
    ]);
    exportTableToPDF("Usuarios Registrados", columns, rows);
  };

  const filteredUsuarios = Array.isArray(usuarios)
    ? usuarios.filter((u) => {
        const matchesRol = filterRol ? u.Rol_usuario === filterRol.toLowerCase() : true;
        const matchesEstado = filterEstado ? u.Estado_usuario.toLowerCase() === filterEstado.toLowerCase() : true;
        const matchesSearch =
          u.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.Correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.Numero_documento?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        return matchesRol && matchesEstado && matchesSearch;
      })
    : [];

  if (loading) return <div className="flex justify-center items-center h-full text-white">Cargando usuarios...</div>;
  if (error) return <div className="text-red-400 font-semibold text-center mt-10">{error}</div>;

  return (
    <div className="p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 text-white">
      {/* ...resto del JSX igual... */}
    </div>
  );
}

export default UsuariosList;
