import React, { useEffect, useState } from "react";
import {
  getSoportes,
  createSoporte,
  updateSoporte,
  deleteSoporte,
} from "../admin/services/soportesService";

function SoportesList() {
  const [soportes, setSoportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    Fecha_solicitud: "",
    Descripcion_problema: "",
    Fecha_resolucion: "",
    ID_usuarioFK: "",
    ID_producto: "",
    ID_instalacion: "",
    ID_domiciliario: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchSoportes = async () => {
    try {
      setLoading(true);
      const res = await getSoportes();
      setSoportes(res);
    } catch (err) {
      console.error("Error al obtener soportes:", err);
      setError("No se pudieron cargar las solicitudes de soporte.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoportes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateSoporte(editId, formData);
        alert("✅ Soporte actualizado correctamente");
      } else {
        await createSoporte(formData);
        alert("✅ Soporte creado correctamente");
      }
      setFormData({
        Fecha_solicitud: "",
        Descripcion_problema: "",
        Fecha_resolucion: "",
        ID_usuarioFK: "",
        ID_producto: "",
        ID_instalacion: "",
        ID_domiciliario: "",
      });
      setEditMode(false);
      setEditId(null);
      fetchSoportes();
    } catch (err) {
      console.error("Error al guardar soporte:", err);
      alert("❌ Error al guardar soporte.");
    }
  };

  const handleEdit = (s) => {
    setFormData({
      Fecha_solicitud: s.Fecha_solicitud?.split("T")[0] || "",
      Descripcion_problema: s.Descripcion_problema,
      Fecha_resolucion: s.Fecha_resolucion?.split("T")[0] || "",
      ID_usuarioFK: s.ID_usuarioFK,
      ID_producto: s.ID_producto,
      ID_instalacion: s.ID_instalacion,
      ID_domiciliario: s.ID_domiciliario,
    });
    setEditId(s.ID_soporte);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta solicitud de soporte?"))
      return;
    try {
      await deleteSoporte(id);
      alert("🗑️ Soporte eliminado correctamente");
      fetchSoportes();
    } catch (err) {
      console.error("Error al eliminar soporte:", err);
      alert("❌ No se pudo eliminar la solicitud.");
    }
  };

  if (loading) return <p>Cargando solicitudes de soporte...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">🛠️ Soporte Técnico</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="date" name="Fecha_solicitud" value={formData.Fecha_solicitud} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Descripcion_problema" placeholder="Descripción del problema" value={formData.Descripcion_problema} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="date" name="Fecha_resolucion" value={formData.Fecha_resolucion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" />
        <input type="number" name="ID_usuarioFK" placeholder="ID Usuario" value={formData.ID_usuarioFK} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_producto" placeholder="ID Producto" value={formData.ID_producto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_instalacion" placeholder="ID Instalación" value={formData.ID_instalacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_domiciliario" placeholder="ID Domiciliario" value={formData.ID_domiciliario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
          {editMode ? "💾 Guardar Cambios" : "➕ Agregar Soporte"}
        </button>
      </form>

      {soportes.length === 0 ? (
        <p>No hay solicitudes registradas</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Fecha Solicitud</th>
                <th className="py-3 px-4">Problema</th>
                <th className="py-3 px-4">Fecha Resolución</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Instalación</th>
                <th className="py-3 px-4">Domiciliario</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {soportes.map((s) => (
                <tr key={s.ID_soporte} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{s.ID_soporte}</td>
                  <td className="py-2 px-4">{s.Fecha_solicitud?.split("T")[0]}</td>
                  <td className="py-2 px-4">{s.Descripcion_problema}</td>
                  <td className="py-2 px-4">{s.Fecha_resolucion?.split("T")[0]}</td>
                  <td className="py-2 px-4">{s.ID_usuarioFK}</td>
                  <td className="py-2 px-4">{s.ID_producto}</td>
                  <td className="py-2 px-4">{s.ID_instalacion}</td>
                  <td className="py-2 px-4">{s.ID_domiciliario}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(s)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded">✏️</button>
                    <button onClick={() => handleDelete(s.ID_soporte)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">🗑️</button>
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

export default SoportesList;
