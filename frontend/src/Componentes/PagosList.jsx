import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function PagosList() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_pago: null,
    ID_usuario: "",
    Monto: "",
    Fecha_pago: "",
    Metodo_pago: "",
    Estado_pago: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const ESTADOS_PAGO = ["Pendiente", "Completado"];
  const METODOS_PAGO = ["Tarjeta", "Efectivo", "Transferencia"];

  /* ================= FETCH ================= */
  const fetchPagos = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pagos");
      setPagos(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ID_pago: null,
      ID_usuario: "",
      Monto: "",
      Fecha_pago: "",
      Metodo_pago: "",
      Estado_pago: "",
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await API.put(`/admin/pagos/${formData.ID_pago}`, formData);
        alert("Pago actualizado");
      } else {
        await API.post("/admin/pagos", formData);
        alert("Pago creado");
      }
      resetForm();
      setShowModal(false);
      fetchPagos();
    } catch (err) {
      console.error(err);
      alert("Error al guardar pago");
    }
  };

  const handleEdit = (p) => {
    setFormData({
      ...p,
      Fecha_pago: p.Fecha_pago?.split("T")[0] || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar pago?")) return;
    await API.delete(`/admin/pagos/${id}`);
    fetchPagos();
  };

  /* ================= FILTERS ================= */
  const filteredPagos = pagos.filter((p) => {
    const fecha = new Date(p.Fecha_pago);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const matchFecha = (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    const matchSearch =
      p.ID_usuario.toString().includes(searchTerm) ||
      p.Metodo_pago.toLowerCase().includes(searchTerm.toLowerCase());

    return matchFecha && matchSearch;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPagos = filteredPagos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPagos.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fechaInicio, fechaFin]);

  /* ================= PDF ================= */
  const handleExportPDF = () => {
    const columns = ["ID", "Usuario", "Monto", "Fecha", "Método", "Estado"];
    const rows = filteredPagos.map((p) => [
      p.ID_pago,
      p.ID_usuario,
      p.Monto,
      p.Fecha_pago,
      p.Metodo_pago,
      p.Estado_pago,
    ]);
    exportTableToPDF("Pagos Registrados", columns, rows);
  };

  /* ================= RENDER ================= */
  if (loading) return <p className="text-white text-center">Cargando pagos...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Barra superior */}
        <div className="mb-6 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="Buscar usuario o método..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-1/3 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
            />

            <div className="flex gap-3 flex-wrap">
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="px-4 py-3 bg-slate-700/50 rounded-xl text-white" />
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="px-4 py-3 bg-slate-700/50 rounded-xl text-white" />

              <button onClick={handleExportPDF} className="px-6 py-3 bg-green-600 rounded-xl text-white">
                PDF
              </button>

              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl"
              >
                + Nuevo Pago
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {currentPagos.map((p) => (
            <div key={p.ID_pago} className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700/50">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-400 text-sm">Usuario</p>
                  <p className="text-white font-medium">{p.ID_usuario}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {p.Metodo_pago} · ${p.Monto}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(p)} className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg">Editar</button>
                  <button onClick={() => handleDelete(p.ID_pago)} className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN (idéntica) */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50">
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
              .map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === p
                      ? "bg-gradient-to-r from-teal-500 to-cyan-600"
                      : "bg-slate-700/50 border border-slate-600"
                  }`}>
                  {p}
                </button>
              ))}

            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white disabled:opacity-50">
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
              {editMode ? "Editar Pago" : "Nuevo Pago"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input name="ID_usuario" value={formData.ID_usuario} onChange={handleChange} placeholder="ID Usuario" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input name="Monto" value={formData.Monto} onChange={handleChange} placeholder="Monto" className="p-3 bg-slate-700 rounded-xl text-white" />
              <input type="date" name="Fecha_pago" value={formData.Fecha_pago} onChange={handleChange} className="p-3 bg-slate-700 rounded-xl text-white" />

              <select name="Metodo_pago" value={formData.Metodo_pago} onChange={handleChange} className="p-3 bg-slate-700 rounded-xl text-white">
                <option value="">Método</option>
                {METODOS_PAGO.map(m => <option key={m}>{m}</option>)}
              </select>

              <select name="Estado_pago" value={formData.Estado_pago} onChange={handleChange} className="p-3 bg-slate-700 rounded-xl text-white">
                <option value="">Estado</option>
                {ESTADOS_PAGO.map(e => <option key={e}>{e}</option>)}
              </select>

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

export default PagosList;
