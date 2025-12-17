import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

function EntregasList() {
  /* ============================
      STATES
  ============================ */
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterFechaInicio, setFilterFechaInicio] = useState("");
  const [filterFechaFin, setFilterFechaFin] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    ID_entrega: null,
    ID_usuario: "",
    ID_producto: "",
    Cantidad: "",
    Fecha_entrega: "",
    ID_domiciliario: "",
  });

  /* PAGINACIÓN */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ============================
      FETCH
  ============================ */
  const fetchEntregas = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/entregas");
      setEntregas(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar las entregas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntregas();
  }, []);

  /* ============================
      FORM
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      ID_entrega: null,
      ID_usuario: "",
      ID_producto: "",
      Cantidad: "",
      Fecha_entrega: "",
      ID_domiciliario: "",
    });
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.ID_usuario ||
      !formData.ID_producto ||
      !formData.Cantidad ||
      !formData.Fecha_entrega
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      if (editMode) {
        await API.put(
          `/admin/entregas/${formData.ID_entrega}`,
          formData
        );
        alert("Entrega actualizada correctamente");
      } else {
        await API.post("/admin/entregas", formData);
        alert("Entrega creada correctamente");
      }

      resetForm();
      setShowModal(false);
      fetchEntregas();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la entrega");
    }
  };

  const handleEdit = (e) => {
    setFormData({
      ID_entrega: e.ID_entrega,
      ID_usuario: e.ID_usuario,
      ID_producto: e.ID_producto,
      Cantidad: e.Cantidad,
      Fecha_entrega: e.Fecha_entrega?.split("T")[0] || "",
      ID_domiciliario: e.ID_domiciliario || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta entrega?")) return;

    try {
      await API.delete(`/admin/entregas/${id}`);
      alert("Entrega eliminada correctamente");
      fetchEntregas();
    } catch {
      alert("No se pudo eliminar la entrega");
    }
  };

  /* ============================
      FILTER + PAGINATION
  ============================ */
  const filteredEntregas = entregas.filter((e) => {
    const matchesSearch =
      e.ID_usuario.toString().includes(searchTerm) ||
      e.ID_producto.toString().includes(searchTerm);

    const fecha = new Date(e.Fecha_entrega);
    const matchesFecha =
      (!filterFechaInicio || fecha >= new Date(filterFechaInicio)) &&
      (!filterFechaFin || fecha <= new Date(filterFechaFin));

    return matchesSearch && matchesFecha;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEntregas = filteredEntregas.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredEntregas.length / itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterFechaInicio, filterFechaFin]);

  /* ============================
      PDF
  ============================ */
  const handleExportPDF = () => {
    exportTableToPDF(
      "Entregas Registradas",
      ["ID", "Usuario", "Producto", "Cantidad", "Fecha"],
      filteredEntregas.map((e) => [
        e.ID_entrega,
        e.ID_usuario,
        e.ID_producto,
        e.Cantidad,
        new Date(e.Fecha_entrega).toLocaleDateString(),
      ])
    );
  };

  /* ============================
      LOADING / ERROR
  ============================ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando entregas...
      </div>
    );

  if (error)
    return <div className="p-6 text-red-400">{error}</div>;

  /* ============================
      UI
  ============================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="mb-6 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 flex flex-col lg:flex-row gap-4 justify-between">
          <input
            type="text"
            placeholder="Buscar usuario o producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 bg-slate-700/50 rounded-xl"
          />

          <div className="flex gap-3 flex-wrap">
            <input
              type="date"
              value={filterFechaInicio}
              onChange={(e) =>
                setFilterFechaInicio(e.target.value)
              }
              className="px-3 py-3 bg-slate-700 rounded-xl"
            />
            <input
              type="date"
              value={filterFechaFin}
              onChange={(e) =>
                setFilterFechaFin(e.target.value)
              }
              className="px-3 py-3 bg-slate-700 rounded-xl"
            />

            <select
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(Number(e.target.value))
              }
              className="px-3 py-3 bg-slate-700 rounded-xl"
            >
              <option value={2}> 2 por pagina </option>
              <option value={10}>10 por pagina </option>
              <option value={20}>20 por pagina </option>
              <option value={50}>50 por pagina </option>
            </select>

            <button
              onClick={handleExportPDF}
              className="px-6 py-3 bg-green-600 rounded-xl"
            >
              PDF
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl"
            >
              + Nueva Entrega
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="space-y-4">
          {currentEntregas.map((e) => (
            <div
              key={e.ID_entrega}
              className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 flex flex-wrap gap-4 justify-between"
            >
              <div>
                <p className="text-lg font-semibold">
                  Entrega #{e.ID_entrega}
                </p>
                <p className="text-slate-400 text-sm">
                  Usuario: {e.ID_usuario} | Producto:{" "}
                  {e.ID_producto}
                </p>
                <p className="text-slate-300 font-medium">
                  Cantidad: {e.Cantidad}
                </p>
                <p className="text-slate-400 text-sm">
                  Fecha:{" "}
                  {new Date(e.Fecha_entrega).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleEdit(e)}
                  className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() =>
                    handleDelete(e.ID_entrega)
                  }
                  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from(
              { length: totalPages },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? "bg-teal-600"
                    : "bg-slate-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 w-full max-w-2xl border border-slate-700">

            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editMode
                  ? "Editar Entrega"
                  : "Nueva Entrega"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="number"
                name="ID_usuario"
                placeholder="ID Usuario"
                value={formData.ID_usuario}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <input
                type="number"
                name="ID_producto"
                placeholder="ID Producto"
                value={formData.ID_producto}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <input
                type="number"
                name="Cantidad"
                placeholder="Cantidad"
                value={formData.Cantidad}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <input
                type="date"
                name="Fecha_entrega"
                value={formData.Fecha_entrega}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <input
                type="number"
                name="ID_domiciliario"
                placeholder="ID Domiciliario (opcional)"
                value={formData.ID_domiciliario}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
              />

              <div className="md:col-span-2 flex gap-3 pt-4">
                <button className="flex-1 bg-teal-600 py-3 rounded-xl">
                  {editMode ? "Guardar" : "Crear"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-slate-700 rounded-xl"
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

export default EntregasList;
