// src/Componentes/ProveedoresList.jsx
import React, { useEffect, useState } from "react";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../admin/services/proveedoresService";

function ProveedoresList() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_proveedor: null,
    Nombre_empresa: "",
    Dirección: "",
    Teléfono: "",
    Correo_electronico: "",
    ID_usuario: "",
  });

  const [editMode, setEditMode] = useState(false);

  //  Obtener proveedores
  const fetchProveedores = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProveedores();
      setProveedores(res.data || res);
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
      setError("No se pudieron cargar los proveedores.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  //  Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateProveedor(formData.ID_proveedor, formData);
        alert(" Proveedor actualizado correctamente");
      } else {
        await createProveedor(formData);
        alert(" Proveedor creado correctamente");
      }
      setFormData({
        ID_proveedor: null,
        Nombre_empresa: "",
        Dirección: "",
        Teléfono: "",
        Correo_electronico: "",
        ID_usuario: "",
      });
      setEditMode(false);
      fetchProveedores();
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      alert(" Error al guardar proveedor.");
    }
  };

  const handleEdit = (prov) => {
    setFormData({
      ID_proveedor: prov.ID_proveedor,
      Nombre_empresa: prov.Nombre_empresa,
      Dirección: prov.Dirección,
      Teléfono: prov.Teléfono,
      Correo_electronico: prov.Correo_electronico,
      ID_usuario: prov.ID_usuario,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await deleteProveedor(id);
      alert("Proveedor eliminado correctamente");
      fetchProveedores();
    } catch (err) {
      console.error("Error al eliminar proveedor:", err);
      alert(" No se pudo eliminar el proveedor.");
    }
  };

  if (loading) return <p className="text-white p-4">Cargando proveedores...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">🏢 Gestión de Proveedores</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          name="Nombre_empresa"
          placeholder="Nombre de la empresa"
          value={formData.Nombre_empresa}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="text"
          name="Dirección"
          placeholder="Dirección"
          value={formData.Dirección}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="text"
          name="Teléfono"
          placeholder="Teléfono"
          value={formData.Teléfono}
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
        <input
          type="number"
          name="ID_usuario"
          placeholder="ID Usuario"
          value={formData.ID_usuario}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
        >
          {editMode ? " Guardar Cambios" : " Agregar Proveedor"}
        </button>
      </form>

      {/* Tabla */}
      {proveedores.length === 0 ? (
        <p>No hay proveedores registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Empresa</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((prov) => (
                <tr key={prov.ID_proveedor} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{prov.ID_proveedor}</td>
                  <td className="py-2 px-4">{prov.Nombre_empresa}</td>
                  <td className="py-2 px-4">{prov.Dirección}</td>
                  <td className="py-2 px-4">{prov.Teléfono}</td>
                  <td className="py-2 px-4">{prov.Correo_electronico}</td>
                  <td className="py-2 px-4">{prov.ID_usuario}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(prov)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                    
                    </button>
                    <button
                      onClick={() => handleDelete(prov.ID_proveedor)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      
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

export default ProveedoresList;
