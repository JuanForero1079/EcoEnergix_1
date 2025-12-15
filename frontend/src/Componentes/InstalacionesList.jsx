import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

const ESTADOS_INSTALACION = ["Pendiente", "En_Proceso", "Completada", "Cancelada"];

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

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  useEffect(() => {
    fetchInstalaciones();
  }, []);

  const fetchInstalaciones = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/instalaciones");
      setInstalaciones(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las instalaciones.");
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

    if (!ESTADOS_INSTALACION.includes(formData.Estado_instalacion)) {
      return alert(`Estado inválido. Usa: ${ESTADOS_INSTALACION.join(", ")}`);
    }

    try {
      if (editMode) {
        await API.put(`/admin/instalaciones/${formData.ID_instalacion}`, formData);
        alert("Instalación actualizada");
      } else {
        await API.post("/admin/instalaciones", formData);
        alert("Instalación creada");
      }

      resetForm();
      fetchInstalaciones();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la instalación");
    }
  };

  const resetForm = () => {
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
  };

  const handleEdit = (inst) => {
    setFormData({
      ...inst,
      Fecha_instalacion: inst.Fecha_instalacion?.split("T")[0] || "",
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar instalación?")) return;

    try {
      await API.delete(`/admin/instalaciones/${id}`);
      alert("Instalación eliminada");
      fetchInstalaciones();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la instalación");
    }
  };

  const formatFecha = (f) => new Date(f).toLocaleDateString();

  const filtered = instalaciones.filter((i) => {
    const fecha = new Date(i.Fecha_instalacion);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;
    const matchFecha = (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    const matchEstado = !estadoFiltro || i.Estado_instalacion === estadoFiltro;
    return matchFecha && matchEstado;
  });

  const handleExportPDF = () => {
    const columns = ["ID", "Fecha", "Duración", "Costo", "Estado", "Usuario", "Producto"];
    const rows = filtered.map((i) => [
      i.ID_instalacion,
      formatFecha(i.Fecha_instalacion),
      i.Duracion_instalacion,
      i.Costo_instalacion,
      i.Estado_instalacion.replace("_", " "),
      i.ID_usuario,
      i.ID_producto,
    ]);

    exportTableToPDF("Instalaciones Registradas", columns, rows);
  };

  if (loading) return <p className="text-white">Cargando instalaciones...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-xl text-white border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Gestión de Instalaciones</h2>

      {/* FORM */}
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" onSubmit={handleSubmit}>
        <input type="date" name="Fecha_instalacion" value={formData.Fecha_instalacion} onChange={handleChange} className="p-2 bg-slate-700 rounded" required />
        <input type="text" name="Duracion_instalacion" placeholder="Duración" value={formData.Duracion_instalacion} onChange={handleChange} className="p-2 bg-slate-700 rounded" required />
        <input type="number" name="Costo_instalacion" placeholder="Costo" value={formData.Costo_instalacion} onChange={handleChange} className="p-2 bg-slate-700 rounded" required />

        <select name="Estado_instalacion" value={formData.Estado_instalacion} onChange={handleChange} className="p-2 bg-slate-700 rounded" required>
          <option value="">Estado</option>
          {ESTADOS_INSTALACION.map((e) => (
            <option key={e} value={e}>{e.replace("_", " ")}</option>
          ))}
        </select>

        <input type="number" name="ID_usuario" placeholder="ID Usuario" value={formData.ID_usuario} onChange={handleChange} className="p-2 bg-slate-700 rounded" required />
        <input type="number" name="ID_producto" placeholder="ID Producto" value={formData.ID_producto} onChange={handleChange} className="p-2 bg-slate-700 rounded" required />

        <button className="col-span-3 bg-indigo-600 hover:bg-indigo-700 py-2 rounded">
          {editMode ? "Guardar cambios" : "Agregar instalación"}
        </button>
      </form>

      {/* FILTERS */}
      <div className="flex gap-4 mb-4">
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="p-2 bg-slate-700 rounded" />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="p-2 bg-slate-700 rounded" />

        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="p-2 bg-slate-700 rounded">
          <option value="">Todos</option>
          {ESTADOS_INSTALACION.map((e) => (
            <option key={e} value={e}>{e.replace("_", " ")}</option>
          ))}
        </select>

        <button onClick={handleExportPDF} type="button" className="bg-green-600 px-4 py-2 rounded">
          Exportar PDF
        </button>
      </div>

      {/* TABLE */}
      <table className="min-w-full bg-slate-900 border border-slate-700 rounded">
        <thead className="bg-blue-600">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Duración</th>
            <th className="p-2">Costo</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Producto</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((i) => (
            <tr key={i.ID_instalacion} className="border-b border-slate-700">
              <td className="p-2">{i.ID_instalacion}</td>
              <td className="p-2">{formatFecha(i.Fecha_instalacion)}</td>
              <td className="p-2">{i.Duracion_instalacion}</td>
              <td className="p-2">${i.Costo_instalacion}</td>
              <td className="p-2">{i.Estado_instalacion.replace("_", " ")}</td>
              <td className="p-2">{i.ID_usuario}</td>
              <td className="p-2">{i.ID_producto}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button onClick={() => handleEdit(i)} className="bg-yellow-500 px-2 py-1 rounded">Editar</button>
                <button onClick={() => handleDelete(i.ID_instalacion)} className="bg-red-600 px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InstalacionesList;
