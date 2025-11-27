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

    try {
      if (editMode) {
        await API.put(`/usuarios/${formData.ID_usuario}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Usuario actualizado correctamente");
      } else {
        await API.post("/usuarios", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Usuario creado correctamente");
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
      Rol_usuario: "cliente",
      Tipo_documento: "",
      Numero_documento: "",
      Foto_usuario: "",
      Estado_usuario: "activo",
    });
    setEditMode(false);
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
    setFormData(usuario);
    setEditMode(true);
  };

  const handleBulkUpload = async () => {
    const usuariosMasivos = [
      { Nombre: "Juan", Correo_electronico: "juan@mail.com", Rol_usuario: "cliente", Tipo_documento: "CC", Numero_documento: "12345", Estado_usuario: "activo" },
      { Nombre: "Ana", Correo_electronico: "ana@mail.com", Rol_usuario: "administrador", Tipo_documento: "CC", Numero_documento: "67890", Estado_usuario: "activo" },
      { Nombre: "Pedro", Correo_electronico: "pedro@mail.com", Rol_usuario: "domiciliario", Tipo_documento: "CC", Numero_documento: "11223", Estado_usuario: "activo" },
    ];

    try {
      const res = await API.post("/usuarios/bulk", usuariosMasivos, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(res.data.message);
      fetchUsuarios();
    } catch (err) {
      console.error("Error en carga masiva:", err);
      alert("No se pudieron cargar los usuarios.");
    }
  };

  const filteredUsuarios = usuarios.filter((u) => {
    const matchesRol = filterRol ? u.Rol_usuario === filterRol : true;
    const matchesEstado = filterEstado ? u.Estado_usuario === filterEstado : true;
    const matchesSearch =
      u.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Correo_electronico.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      `${u.Tipo_documento} ${u.Numero_documento}`,
      u.Estado_usuario,
    ]);
    exportTableToPDF("Usuarios Registrados", columns, rows);
  };

  if (loading)
    return <p className="text-white p-4">Cargando usuarios...</p>;

  if (error)
    return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="Nombre"
          placeholder="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="email"
          name="Correo_electronico"
          placeholder="Correo"
          value={formData.Correo_electronico}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <select
          name="Rol_usuario"
          value={formData.Rol_usuario}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        >
          <option value="cliente">Cliente</option>
          <option value="administrador">Administrador</option>
          <option value="domiciliario">Domiciliario</option>
        </select>

        <select
          name="Estado_usuario"
          value={formData.Estado_usuario}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <input
          type="text"
          name="Tipo_documento"
          placeholder="Tipo de documento"
          value={formData.Tipo_documento}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />

        <input
          type="text"
          name="Numero_documento"
          placeholder="Número de documento"
          value={formData.Numero_documento}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
        />

        <button
          type="submit"
          className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          {editMode ? "Guardar Cambios" : "Agregar Usuario"}
        </button>
      </form>

      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />

        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Exportar PDF
        </button>

        <button
          onClick={handleBulkUpload}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
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
              <tr className="bg-green-600 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsuarios.map((u) => (
                <tr
                  key={u.ID_usuario}
                  className="border-b border-slate-700 hover:bg-slate-800"
                >
                  <td className="py-2 px-4">{u.ID_usuario}</td>
                  <td className="py-2 px-4">{u.Nombre}</td>
                  <td className="py-2 px-4">{u.Correo_electronico}</td>
                  <td className="py-2 px-4">{u.Rol_usuario}</td>
                  <td className="py-2 px-4">
                    {u.Tipo_documento} {u.Numero_documento}
                  </td>
                  <td className="py-2 px-4">{u.Estado_usuario}</td>
                  <td className="py-2 px-4 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(u)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(u.ID_usuario)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
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
