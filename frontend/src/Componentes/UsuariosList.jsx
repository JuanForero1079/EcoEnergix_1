import React, { useEffect, useState } from "react";
import APIAdmin from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_usuario: null,
    Nombre: "",
    Correo_electronico: "",
    Contrasena: "",
    Rol_usuario: "domiciliario",
    Estado_usuario: "activo",
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ======================
  // API
  // ======================
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await APIAdmin.get("/admin/usuarios");
      setUsuarios(res.data.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // ======================
  // FORM
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        Contraseña: formData.Contrasena,
      };
      delete payload.Contrasena;

      if (editMode) {
        await APIAdmin.put(`/admin/usuarios/${formData.ID_usuario}`, payload);
        alert("Usuario actualizado correctamente");
      } else {
        await APIAdmin.post("/admin/usuarios", payload);
        alert("Usuario creado correctamente");
      }

      resetForm();
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Error al guardar usuario");
    }
  };

  const handleEdit = (u) => {
    setFormData({ ...u, Contrasena: "" });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    try {
      await APIAdmin.delete(`/admin/usuarios/${id}`);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el usuario");
    }
  };

  const resetForm = () => {
    setFormData({
      ID_usuario: null,
      Nombre: "",
      Correo_electronico: "",
      Contrasena: "",
      Rol_usuario: "domiciliario",
      Estado_usuario: "activo",
    });
    setEditMode(false);
  };

  // ======================
  // FILTRO
  // ======================
  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.Correo_electronico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================
  // PDF
  // ======================
  const handleExportPDF = () => {
    const columns = ["ID", "Nombre", "Correo", "Rol", "Estado"];
    const rows = filteredUsuarios.map((u) => [
      u.ID_usuario,
      u.Nombre,
      u.Correo_electronico,
      u.Rol_usuario,
      u.Estado_usuario,
    ]);
    exportTableToPDF("Usuarios Registrados", columns, rows);
  };

  // ======================
  // RENDER
  // ======================
  if (loading) return <p className="text-white p-4">Cargando usuarios...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          name="Nombre"
          placeholder="Nombre completo"
          value={formData.Nombre}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />

        <input
          type="email"
          name="Correo_electronico"
          placeholder="Correo electrónico"
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
          required
        >
          <option value="administrador">Administrador</option>
          <option value="domiciliario">Domiciliario</option>
        </select>

        <select
          name="Estado_usuario"
          value={formData.Estado_usuario}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>

        <input
          type="password"
          name="Contrasena"
          placeholder={
            editMode ? "Nueva contraseña (opcional)" : "Contraseña"
          }
          value={formData.Contrasena}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required={!editMode}
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
