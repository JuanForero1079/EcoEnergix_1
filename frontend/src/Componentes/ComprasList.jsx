import React, { useEffect, useState } from "react";
import API from "../services/api";
import { exportTableToPDF } from "../utils/exportPDF";

const ESTADOS_COMPRAS = [
  "pendiente",
  "aprobada",
  "en_proceso",
  "entregada",
  "cancelada",
];

export default function ComprasList() {
  /* =====================
      STATES
  ===================== */
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterFechaInicio, setFilterFechaInicio] = useState("");
  const [filterFechaFin, setFilterFechaFin] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    ID_compra: null,
    ID_usuario: "",
    Fecha_compra: "",
    Monto_total: "",
    Estado: "pendiente",
  });

  /* PAGINACIÓN */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* =====================
      FETCH
  ===================== */
  const fetchCompras = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/compras");
      setCompras(res.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las compras");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  /* =====================
      FORM
  ===================== */
  const resetForm = () => {
    setFormData({
      ID_compra: null,
      ID_usuario: "",
      Fecha_compra: "",
      Monto_total: "",
      Estado: "pendiente",
    });
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await API.put(`/admin/compras/${formData.ID_compra}`, formData);
        alert("Compra actualizada correctamente");
      } else {
        await API.post("/admin/compras", formData);
        alert("Compra creada correctamente");
      }
      setShowModal(false);
      resetForm();
      fetchCompras();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la compra");
    }
  };

  const handleEdit = (c) => {
    setFormData({
      ID_compra: c.ID_compra,
      ID_usuario: c.ID_usuario,
      Fecha_compra: c.Fecha_compra?.split("T")[0],
      Monto_total: c.Monto_total,
      Estado: c.Estado,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta compra?")) return;
    try {
      await API.delete(`/admin/compras/${id}`);
      fetchCompras();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar");
    }
  };

  /* =====================
      FILTERS
  ===================== */
  const filteredCompras = compras.filter((c) => {
    const matchesSearch =
      String(c.ID_compra).includes(searchTerm) ||
      String(c.ID_usuario).includes(searchTerm);

    const matchesEstado = filterEstado
      ? c.Estado === filterEstado
      : true;

    const fecha = new Date(c.Fecha_compra);
    const matchesFecha =
      (!filterFechaInicio || fecha >= new Date(filterFechaInicio)) &&
      (!filterFechaFin || fecha <= new Date(filterFechaFin));

    return matchesSearch && matchesEstado && matchesFecha;
  });

  /* RESET PAGINA AL FILTRAR */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado, filterFechaInicio, filterFechaFin]);

  /* =====================
      PAGINACIÓN
  ===================== */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompras = filteredCompras.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCompras.length / itemsPerPage);

  /* =====================
      PDF
  ===================== */
  const handleExportPDF = () => {
    const columns = ["ID Compra", "ID Usuario", "Fecha", "Monto", "Estado"];
    const rows = filteredCompras.map((c) => [
      c.ID_compra,
      c.ID_usuario,
      new Date(c.Fecha_compra).toLocaleDateString(),
      `$${Number(c.Monto_total).toLocaleString()}`,
      c.Estado,
    ]);
    exportTableToPDF("Compras Registradas", columns, rows);
  };

  /* =====================
      LOADING / ERROR
  ===================== */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-lg animate-pulse">
          Cargando compras...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-300 bg-red-500/20 rounded-xl max-w-md mx-auto mt-10">
        {error}
      </div>
    );

  /* =====================
      UI
  ===================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">

            <input
              type="text"
              placeholder="Buscar compra o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white w-full lg:w-1/3"
            />

            <div className="flex flex-wrap gap-3">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
              >
                <option value="">Todos los estados</option>
                {ESTADOS_COMPRAS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filterFechaInicio}
                onChange={(e) => setFilterFechaInicio(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
              />

              <input
                type="date"
                value={filterFechaFin}
                onChange={(e) => setFilterFechaFin(e.target.value)}
                className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
              />

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white"
              >
                <option value={1}>1 por pagina </option>
                <option value={10}>10 por pagina </option>
                <option value={20}>20 por pagina </option>
                <option value={50}>50 por pagina</option>
              </select>

              <button
                onClick={handleExportPDF}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white"
              >
                PDF
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl text-white"
              >
                + Nueva Compra
              </button>
            </div>
          </div>
        </div>

        {/* LISTA */}
        <div className="space-y-4">
          {currentCompras.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No hay compras
            </div>
          ) : (
            currentCompras.map((c) => (
              <div
                key={c.ID_compra}
                className="bg-slate-800/70 border border-slate-700 rounded-2xl p-6 flex justify-between items-center flex-wrap gap-4"
              >
                <div>
                  <p className="text-white font-semibold">
                    Compra #{c.ID_compra}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Usuario ID: {c.ID_usuario}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {new Date(c.Fecha_compra).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-white font-bold">
                    ${Number(c.Monto_total).toLocaleString()}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs bg-slate-700 text-white">
                    {c.Estado}
                  </span>

                  <button
                    onClick={() => handleEdit(c)}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(c.ID_compra)}
                    className="px-3 py-1 bg-red-600/20 text-red-300 rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-700 rounded text-white disabled:opacity-40"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${
                    page === currentPage
                      ? "bg-teal-600 text-white"
                      : "bg-slate-700 text-white"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-700 rounded text-white disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 w-full max-w-2xl border border-slate-700 animate-scaleIn">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editMode ? "Editar Compra" : "Nueva Compra"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                name="ID_usuario"
                placeholder="ID Usuario"
                value={formData.ID_usuario}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700 rounded text-white"
                required
              />

              <input
                type="date"
                name="Fecha_compra"
                value={formData.Fecha_compra}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700 rounded text-white"
                required
              />

              <input
                type="number"
                name="Monto_total"
                placeholder="Monto total"
                value={formData.Monto_total}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700 rounded text-white"
                required
              />

              <select
                name="Estado"
                value={formData.Estado}
                onChange={handleChange}
                className="w-full p-3 bg-slate-700 rounded text-white"
              >
                {ESTADOS_COMPRAS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 py-3 rounded-xl text-white"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl text-white"
                >
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
