
import React, { useEffect, useState } from "react";
import {
  getInstalaciones,
  createInstalacion,
  updateInstalacion,
  deleteInstalacion,
} from "../admin/services/instalacionesService";

function InstalacionesList() {
  const [instalaciones, setInstalaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_instalacion: null,
    Fecha_instalacion: "",
    Duracion_instalacion: "",
    Costo_instalacion: "",
    Estado_instalacion: "",
    ID_usuario: "",
    ID_producto: "",
  });
  const [editMode, setEditMode] = useState(false);

  //   Obtener instalaciones
  const fetchInstalaciones = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getInstalaciones();
      setInstalaciones(res.data || res);
    } catch (err) {
      console.error("Error al obtener instalaciones:", err);
      setError("No se pudieron cargar las instalaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstalaciones();
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
        await updateInstalacion(formData.ID_instalacion, formData);
        alert(" Instalación actualizada correctamente");
      } else {
        await createInstalacion(formData);
        alert(" Instalación creada correctamente");
      }
      setFormData({
        ID_instalacion: null,
        Fecha_instalacion: "",
        Duracion_instalacion: "",
        Costo_instalacion: "",
        Estado_instalacion: "",
        ID_usuario: "",
        ID_producto: "",
      });
      setEditMode(false);
      fetchInstalaciones();
    } catch (err) {
      console.error("Error al guardar instalación:", err);
      alert(" Error al guardar instalación.");
    }
  };

  const handleEdit = (inst) => {
    setFormData({
      ID_instalacion: inst.ID_instalacion,
      Fecha_instalacion: inst.Fecha_instalacion?.split("T")[0] || "",
      Duracion_instalacion: inst.Duracion_instalacion,
      Costo_instalacion: inst.Costo_instalacion,
      Estado_instalacion: inst.Estado_instalacion,
      ID_usuario: inst.ID_usuario,
      ID_producto: inst.ID_producto,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta instalación?")) return;
    try {
      await deleteInstalacion(id);
      alert("  Instalación eliminada correctamente");
      fetchInstalaciones();
    } catch (err) {
      console.error("Error al eliminar instalación:", err);
      alert(" No se pudo eliminar la instalación.");
    }
  };

  if (loading) return <p className="text-white p-4">Cargando instalaciones...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">🔧 Gestión de Instalaciones</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="date" name="Fecha_instalacion" value={formData.Fecha_instalacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Duracion_instalacion" placeholder="Duración (horas)" value={formData.Duracion_instalacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="Costo_instalacion" placeholder="Costo" value={formData.Costo_instalacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Estado_instalacion" placeholder="Estado" value={formData.Estado_instalacion} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_usuario" placeholder="ID Usuario" value={formData.ID_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="ID_producto" placeholder="ID Producto" value={formData.ID_producto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
          {editMode ? " Guardar Cambios" : "Agregar Instalación"}
        </button>
      </form>

      {/* Tabla */}
      {instalaciones.length === 0 ? (
        <p>No hay instalaciones registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Duración</th>
                <th className="py-3 px-4">Costo</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {instalaciones.map((inst) => (
                <tr key={inst.ID_instalacion} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{inst.ID_instalacion}</td>
                  <td className="py-2 px-4">{inst.Fecha_instalacion?.split("T")[0]}</td>
                  <td className="py-2 px-4">{inst.Duracion_instalacion}</td>
                  <td className="py-2 px-4 text-center">${inst.Costo_instalacion}</td>
                  <td className="py-2 px-4">{inst.Estado_instalacion}</td>
                  <td className="py-2 px-4">{inst.ID_usuario}</td>
                  <td className="py-2 px-4">{inst.ID_producto}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(inst)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"> </button>
                    <button onClick={() => handleDelete(inst.ID_instalacion)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"> </button>
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

export default InstalacionesList;
