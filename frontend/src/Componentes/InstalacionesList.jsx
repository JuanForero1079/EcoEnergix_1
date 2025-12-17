import React, { useEffect, useState } from "react";
import API from "../admin/services/api";
import { exportTableToPDF } from "../utils/exportPDF";

const ESTADOS_INSTALACION = [
  "Pendiente",
  "En_Proceso",
  "Completada",
  "Cancelada",
];

function InstalacionesList() {
  /* ============================
      STATES
  ============================ */
  const [instalaciones, setInstalaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const [formData, setFormData] = useState({
    ID_instalacion: null,
    Fecha_instalacion: "",
    Duracion_instalacion: "",
    Costo_instalacion: "",
    Estado_instalacion: "",
    ID_usuario: "",
    ID_producto: "",
  });

  /* PAGINACIÓN */
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ============================
      FETCH
  ============================ */
  const fetchInstalaciones = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/instalaciones");
      setInstalaciones(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las instalaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstalaciones();
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ESTADOS_INSTALACION.includes(formData.Estado_instalacion)) {
      alert(
        `Estado inválido. Usa: ${ESTADOS_INSTALACION.join(", ")}`
      );
      return;
    }

    try {
      if (editMode) {
        await API.put(
          `/admin/instalaciones/${formData.ID_instalacion}`,
          formData
        );
        alert("Instalación actualizada");
      } else {
        await API.post("/admin/instalaciones", formData);
        alert("Instalación creada");
      }

      resetForm();
      setShowModal(false);
      fetchInstalaciones();
    } catch (err) {
      console.error(err);
      alert("Error al guardar la instalación");
    }
  };

  const handleEdit = (i) => {
    setFormData({
      ...i,
      Fecha_instalacion: i.Fecha_instalacion?.split("T")[0] || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar instalación?")) return;

    try {
      await API.delete(`/admin/instalaciones/${id}`);
      alert("Instalación eliminada");
      fetchInstalaciones();
    } catch {
      alert("No se pudo eliminar la instalación");
    }
  };

  /* ============================
      FILTER + PAGINATION
  ============================ */
  const filteredInstalaciones = instalaciones.filter((i) => {
    const fecha = new Date(i.Fecha_instalacion);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const matchFecha =
      (!inicio || fecha >= inicio) &&
      (!fin || fecha <= fin);

    const matchEstado =
      !estadoFiltro || i.Estado_instalacion === estadoFiltro;

    return matchFecha && matchEstado;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentInstalaciones = filteredInstalaciones.slice(
    indexOfFirst,
    indexOfLast
  );
  const totalPages = Math.ceil(
    filteredInstalaciones.length / itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [fechaInicio, fechaFin, estadoFiltro]);

  /* ============================
      PDF
  ============================ */
  const formatFecha = (f) =>
    new Date(f).toLocaleDateString();

  const handleExportPDF = () => {
    exportTableToPDF(
      "Instalaciones Registradas",
      ["ID", "Fecha", "Duración", "Costo", "Estado", "Usuario", "Producto"],
      filteredInstalaciones.map((i) => [
        i.ID_instalacion,
        formatFecha(i.Fecha_instalacion),
        i.Duracion_instalacion,
        i.Costo_instalacion,
        i.Estado_instalacion.replace("_", " "),
        i.ID_usuario,
        i.ID_producto,
      ])
    );
  };

  /* ============================
      LOADING / ERROR
  ============================ */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cargando instalaciones...
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
          <div className="flex gap-3 flex-wrap">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="px-3 py-3 bg-slate-700 rounded-xl"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="px-3 py-3 bg-slate-700 rounded-xl"
            />
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="px-3 py-3 bg-slate-700 rounded-xl"
            >
              <option value="">Todos</option>
              {ESTADOS_INSTALACION.map((e) => (
                <option key={e} value={e}>
                  {e.replace("_", " ")}
                </option>
              ))}
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(Number(e.target.value))
              }
              className="px-3 py-3 bg-slate-700 rounded-xl"
            >
              <option value={2}>2 por pagina </option>
              <option value={10}>10 por pagina </option>
              <option value={20}>20 por pagina </option>
              <option value={50}>50 por pagina </option>
            </select>
          </div>

          <div className="flex gap-3 flex-wrap">
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
              + Nueva Instalación
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div className="space-y-4">
          {currentInstalaciones.map((i) => (
            <div
              key={i.ID_instalacion}
              className="bg-slate-800/70 rounded-2xl p-6 border border-slate-700 flex flex-wrap justify-between gap-4"
            >
              <div>
                <p className="text-lg font-semibold">
                  Instalación #{i.ID_instalacion}
                </p>
                <p className="text-slate-400 text-sm">
                  Fecha: {formatFecha(i.Fecha_instalacion)}
                </p>
                <p className="text-slate-300">
                  Estado:{" "}
                  <span className="font-medium">
                    {i.Estado_instalacion.replace("_", " ")}
                  </span>
                </p>
                <p className="text-slate-400 text-sm">
                  Usuario: {i.ID_usuario} | Producto:{" "}
                  {i.ID_producto}
                </p>
                <p className="text-slate-300 font-semibold">
                  ${i.Costo_instalacion}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleEdit(i)}
                  className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() =>
                    handleDelete(i.ID_instalacion)
                  }
                  className="px-4 py-2 bg-red-600/20 text-red-300 rounded-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
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
                  ? "Editar Instalación"
                  : "Nueva Instalación"}
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
                type="date"
                name="Fecha_instalacion"
                value={formData.Fecha_instalacion}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <input
                type="text"
                name="Duracion_instalacion"
                placeholder="Duración"
                value={formData.Duracion_instalacion}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <input
                type="number"
                name="Costo_instalacion"
                placeholder="Costo"
                value={formData.Costo_instalacion}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              />

              <select
                name="Estado_instalacion"
                value={formData.Estado_instalacion}
                onChange={handleChange}
                className="p-3 bg-slate-700 rounded-xl"
                required
              >
                <option value="">Estado</option>
                {ESTADOS_INSTALACION.map((e) => (
                  <option key={e} value={e}>
                    {e.replace("_", " ")}
                  </option>
                ))}
              </select>

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

export default InstalacionesList;
