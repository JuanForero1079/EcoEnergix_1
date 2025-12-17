import React, { useEffect, useState } from "react";
import {
  getSoportes,
  createSoporte,
  updateSoporte,
  deleteSoporte,
} from "../admin/services/soportesService";
import { exportTableToPDF } from "../utils/exportPDF";

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
  const [showModal, setShowModal] = useState(false);

  /* ===== FILTROS ===== */
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  /* ===== PAGINACIÓN ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchSoportes();
  }, []);

  const fetchSoportes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getSoportes();
      setSoportes(res || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las solicitudes de soporte.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateSoporte(editId, formData);
        alert("Soporte actualizado correctamente");
      } else {
        await createSoporte(formData);
        alert("Soporte creado correctamente");
      }
      resetForm();
      setShowModal(false);
      fetchSoportes();
    } catch (err) {
      console.error(err);
      alert("Error al guardar soporte");
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
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar solicitud de soporte?")) return;
    await deleteSoporte(id);
    fetchSoportes();
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const f = new Date(fecha);
    return `${f.getDate()}/${f.getMonth() + 1}/${f.getFullYear()}`;
  };

  /* ===== FILTRADO ===== */
  const filteredSoportes = soportes.filter((s) => {
    const fechaSolicitud = new Date(s.Fecha_solicitud);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const matchFecha = (!inicio || fechaSolicitud >= inicio) && (!fin || fechaSolicitud <= fin);
    const matchSearch = s.Descripcion_problema
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchFecha && matchSearch;
  });

  useEffect(() => setCurrentPage(1), [searchTerm, fechaInicio, fechaFin]);

  /* ===== PAGINACIÓN ===== */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSoportes = filteredSoportes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSoportes.length / itemsPerPage);

  const paginate = (p) => {
    if (p >= 1 && p <= totalPages) setCurrentPage(p);
  };

  /* ===== PDF ===== */
  const handleExportPDF = () => {
    const columns = [
      "ID",
      "Fecha Solicitud",
      "Problema",
      "Fecha Resolución",
      "Usuario",
      "Producto",
      "Instalación",
      "Domiciliario",
    ];
    const rows = filteredSoportes.map((s) => [
      s.ID_soporte,
      formatFecha(s.Fecha_solicitud),
      s.Descripcion_problema,
      formatFecha(s.Fecha_resolucion),
      s.ID_usuarioFK,
      s.ID_producto,
      s.ID_instalacion,
      s.ID_domiciliario,
    ]);
    exportTableToPDF("Solicitudes de Soporte", columns, rows);
  };

  if (loading) return <p className="text-white text-center">Cargando...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Barra superior */}
        <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/50 mb-6 flex flex-wrap gap-3 justify-between">
          <input
            placeholder="Buscar problema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 rounded-xl text-white"
          />

          <div className="flex gap-2 flex-wrap">
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="px-3 py-2 bg-slate-700 rounded-xl text-white" />
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="px-3 py-2 bg-slate-700 rounded-xl text-white" />
            <button onClick={handleExportPDF} className="px-5 py-3 bg-green-600 rounded-xl text-white">
              PDF
            </button>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl text-white"
            >
              + Nuevo Soporte
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {currentSoportes.map((s) => (
            <div
              key={s.ID_soporte}
              className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700/50 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{s.Descripcion_problema}</p>
                <p className="text-slate-400 text-sm">
                  {formatFecha(s.Fecha_solicitud)} · Usuario {s.ID_usuarioFK}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)} className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg">
                  Editar
                </button>
                <button onClick={() => handleDelete(s.ID_soporte)} className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700 rounded-lg text-white disabled:opacity-50">
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
              .map(p => (
                <button
                  key={p}
                  onClick={() => paginate(p)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === p
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600"
                      : "bg-slate-700"
                  }`}
                >
                  {p}
                </button>
              ))}

            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700 rounded-lg text-white disabled:opacity-50">
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-xl w-full border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editMode ? "Editar Soporte" : "Nuevo Soporte"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input type="date" name="Fecha_solicitud" value={formData.Fecha_solicitud} onChange={handleChange} className="p-3 bg-slate-700 rounded-xl text-white" required />
              <input name="Descripcion_problema" value={formData.Descripcion_problema} onChange={handleChange} placeholder="Descripción del problema" className="p-3 bg-slate-700 rounded-xl text-white" required />
              <input type="date" name="Fecha_resolucion" value={formData.Fecha_resolucion} onChange={handleChange} className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="ID_usuarioFK" value={formData.ID_usuarioFK} onChange={handleChange} placeholder="ID Usuario" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="ID_producto" value={formData.ID_producto} onChange={handleChange} placeholder="ID Producto" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="ID_instalacion" value={formData.ID_instalacion} onChange={handleChange} placeholder="ID Instalación" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="ID_domiciliario" value={formData.ID_domiciliario} onChange={handleChange} placeholder="ID Domiciliario" className="p-3 bg-slate-700 rounded-xl text-white" />

              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-teal-600 py-3 rounded-xl text-white">
                  Guardar
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-700 py-3 rounded-xl text-white">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SoportesList;
