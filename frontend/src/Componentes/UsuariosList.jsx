import React, { useEffect, useState } from "react";
import API from "../admin/services/api"; // API del admin
import { exportTableToPDF } from "../utils/exportPDF";

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_usuario: null,
    Nombre: "",
    Correo_electronico: "",
    Rol_usuario: "",
    Tipo_documento: "",
    Numero_documento: "",
    Foto_usuario: "",
    Estado_usuario: "activo",
  });
  const [editMode, setEditMode] = useState(false);

  // Filtros y búsqueda
  const [filterRol, setFilterRol] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await API.get("/usuarios"); // <-- ruta backend
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
    const roles = ["Administrador", "Cliente", "Domiciliario"];
    if (!roles.includes(formData.Rol_usuario)) {
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
      if (editMode) {
        await API.put(`/usuarios/${formData.ID_usuario}`, formData);
        alert("Usuario actualizado correctamente");
      } else {
        await API.post("/usuarios", formData);
        alert("Usuario creado correctamente");
      }
      setFormData({
        ID_usuario: null,
        Nombre: "",
        Correo_electronico: "",
        Rol_usuario: "",
        Tipo_documento: "",
        Numero_documento: "",
        Foto_usuario: "",
        Estado_usuario: "activo",
      });
      setEditMode(false);
      fetchUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Error al guardar usuario.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await API.delete(`/usuarios/${id}`);
      alert("Usuario eliminado correctamente");
      fetchUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setEditMode(true);
  };

  // ======================
  // Carga masiva de usuarios
  // ======================
  const handleBulkUpload = async () => {
    // Esto se puede reemplazar por un CSV parseado
    const usuariosMasivos = [
      { Nombre: "Juan", Correo_electronico: "juan@mail.com", Rol_usuario: "Cliente", Tipo_documento: "CC", Numero_documento: "12345" },
      { Nombre: "Ana", Correo_electronico: "ana@mail.com", Rol_usuario: "Administrador", Tipo_documento: "CC", Numero_documento: "67890" },
      { Nombre: "Pedro", Correo_electronico: "pedro@mail.com", Rol_usuario: "Domiciliario", Tipo_documento: "CC", Numero_documento: "11223" }
    ];

    try {
      const res = await API.post("/usuarios/bulk", usuariosMasivos);
      alert(res.data.message);
      fetchUsuarios(); // <-- Actualiza la tabla después de la carga masiva
    } catch (err) {
      console.error("Error en carga masiva:", err);
      alert("No se pudieron cargar los usuarios.");
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

  // Filtrar usuarios
  const filteredUsuarios = Array.isArray(usuarios)
    ? usuarios.filter((u) => {
        const matchesRol = filterRol ? u.Rol_usuario === filterRol : true;
        const matchesEstado = filterEstado
          ? u.Estado_usuario.toLowerCase() === filterEstado.toLowerCase()
          : true;
        const matchesSearch =
          u.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.Correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (u.Numero_documento?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        return matchesRol && matchesEstado && matchesSearch;
      })
    : [];

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-white">
        <p>Cargando usuarios...</p>
      </div>
    );

  if (error)
    return <div className="text-red-400 font-semibold text-center mt-10">{error}</div>;

  return (
    <div className="p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="Nombre" placeholder="Nombre" value={formData.Nombre} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="email" name="Correo_electronico" placeholder="Correo electrónico" value={formData.Correo_electronico} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Rol_usuario" placeholder="Rol (Administrador / Cliente / Domiciliario)" value={formData.Rol_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Tipo_documento" placeholder="Tipo documento" value={formData.Tipo_documento} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Numero_documento" placeholder="Número documento" value={formData.Numero_documento} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Foto_usuario" placeholder="Foto (URL)" value={formData.Foto_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Estado_usuario" placeholder="Estado (activo/inactivo)" value={formData.Estado_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <button type="submit" className="col-span-1 md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition">
          {editMode ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
      </form>

      {/* Filtros, búsqueda y carga masiva */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 rounded bg-slate-700 text-white" />
        <select value={filterRol} onChange={(e) => setFilterRol(e.target.value)} className="p-2 rounded bg-slate-700 text-white">
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Cliente">Cliente</option>
          <option value="Domiciliario">Domiciliario</option>
        </select>
        <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="p-2 rounded bg-slate-700 text-white">
          <option value="">Todos los estados</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Exportar PDF
        </button>
        <button onClick={handleBulkUpload} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Carga Masiva
        </button>
      </div>

      {/* Tabla */}
      {filteredUsuarios.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-indigo-700 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Tipo Doc.</th>
                <th className="py-3 px-4">N° Doc.</th>
                <th className="py-3 px-4">Foto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((u) => (
                <tr key={u.ID_usuario} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{u.ID_usuario}</td>
                  <td className="py-2 px-4">{u.Nombre}</td>
                  <td className="py-2 px-4">{u.Correo_electronico}</td>
                  <td className="py-2 px-4">{u.Rol_usuario}</td>
                  <td className="py-2 px-4">{u.Tipo_documento}</td>
                  <td className="py-2 px-4">{u.Numero_documento}</td>
                  <td className="py-2 px-4">
                    {u.Foto_usuario ? <img src={u.Foto_usuario} alt={u.Nombre} className="w-10 h-10 rounded-full object-cover" /> : "—"}
                  </td>
                  <td className="py-2 px-4">{u.Estado_usuario}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button onClick={() => handleEdit(u)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-3 rounded">Editar</button>
                    <button onClick={() => handleDelete(u.ID_usuario)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UsuariosList;
      