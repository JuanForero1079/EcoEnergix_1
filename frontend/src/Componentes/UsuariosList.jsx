
import React, { useEffect, useState } from "react";
//  Importamos el API del admin
import API from "../admin/services/api";

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
    Estado_usuario: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  //  Obtener usuarios desde la API del admin
  const fetchUsuarios = async () => {
    try {
      const res = await API.get("/admin/usuarios"); //  ruta correcta
      setUsuarios(res.data);
    } catch (err) {
      console.error(" Error al obtener usuarios:", err);
      setError("No se pudo conectar con el servidor.");
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
        await API.put(`/admin/usuarios/${formData.ID_usuario}`, formData);
        alert("Usuario actualizado correctamente");
      } else {
        await API.post("/admin/usuarios", formData);
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
        Estado_usuario: "",
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
      await API.delete(`/admin/usuarios/${id}`);
      alert("Usuario eliminado correctamente");
      fetchUsuarios();
    } catch (err) {
      console.error(" Error al eliminar usuario:", err);
      alert("No se pudo eliminar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setFormData(usuario);
    setEditMode(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-white">
        <p>Cargando usuarios...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 font-semibold text-center mt-10">{error}</div>
    );

  return (
    <div className="p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4"> Gestión de Usuarios</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" name="Nombre" placeholder="Nombre" value={formData.Nombre} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="email" name="Correo_electronico" placeholder="Correo electrónico" value={formData.Correo_electronico} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Rol_usuario" placeholder="Rol (Administrador / Cliente)" value={formData.Rol_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Tipo_documento" placeholder="Tipo documento" value={formData.Tipo_documento} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Numero_documento" placeholder="Número documento" value={formData.Numero_documento} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Foto_usuario" placeholder="Foto (URL)" value={formData.Foto_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="text" name="Estado_usuario" placeholder="Estado" value={formData.Estado_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <button type="submit" className="col-span-1 md:col-span-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition">
          {editMode ? " Guardar Cambios" : " Agregar Usuario"}
        </button>
      </form>

      {/*  Tabla de usuarios */}
      {usuarios.length === 0 ? (
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
              {usuarios.map((u) => (
                <tr key={u.ID_usuario} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{u.ID_usuario}</td>
                  <td className="py-2 px-4">{u.Nombre}</td>
                  <td className="py-2 px-4">{u.Correo_electronico}</td>
                  <td className="py-2 px-4">{u.Rol_usuario}</td>
                  <td className="py-2 px-4">{u.Tipo_documento}</td>
                  <td className="py-2 px-4">{u.Numero_documento}</td>
                  <td className="py-2 px-4">{u.Foto_usuario ? <img src={u.Foto_usuario} alt={u.Nombre} className="w-10 h-10 rounded-full object-cover" /> : "—"}</td>
                  <td className="py-2 px-4">{u.Estado_usuario}</td>
                  <td className="py-2 px-4 text-center">
                    <button onClick={() => handleEdit(u)} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-3 rounded mr-2"></button>
                    <button onClick={() => handleDelete(u.ID_usuario)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"></button>
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
