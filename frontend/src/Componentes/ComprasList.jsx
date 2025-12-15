import React, { useEffect, useState } from "react";
import API from "../services/api";
import { exportTableToPDF } from "../utils/exportPDF";

// Estados válidos según la BD
const ESTADOS_COMPRAS = [
  "pendiente",
  "aprobada",
  "en_proceso",
  "entregada",
  "cancelada",
];

function ComprasList() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    ID_compra: null,
    ID_usuario: "",
    Fecha_compra: "",
    Monto_total: "",
    Estado: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterFechaInicio, setFilterFechaInicio] = useState("");
  const [filterFechaFin, setFilterFechaFin] = useState("");

  // Obtener compras
  const fetchCompras = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/compras");
      setCompras(res.data);
    } catch (err) {
      console.error("Error al obtener compras:", err);
      setError("No se pudo obtener la lista de compras. Verifica el backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos a enviar:", formData); // Para depuración
    try {
      if (editMode) {
        await API.put(`/admin/compras/${formData.ID_compra}`, formData);
        alert("Compra actualizada correctamente");
      } else {
        await API.post("/admin/compras", formData);
        alert("Compra creada correctamente");
      }

      setFormData({
        ID_compra: null,
        ID_usuario: "",
        Fecha_compra: "",
        Monto_total: "",
        Estado: "",
      });
      setEditMode(false);
      fetchCompras();
    } catch (err) {
      console.error("Error al guardar compra:", err);
      alert(
        "Error al guardar compra. Verifica los datos y el token de autorización."
      );
    }
  };

  const handleEdit = (compra) => {
    setFormData({
      ID_compra: compra.ID_compra,
      ID_usuario: compra.ID_usuario,
      Fecha_compra: compra.Fecha_compra?.split("T")[0] || "",
      Monto_total: compra.Monto_total,
      Estado: compra.Estado,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta compra?")) return;
    try {
      await API.delete(`/admin/compras/${id}`);
      alert("Compra eliminada correctamente");
      fetchCompras();
    } catch (err) {
      console.error("Error al eliminar compra:", err);
      alert("No se pudo eliminar la compra.");
    }
  };

  // Filtrar compras por búsqueda, estado y rango de fechas
  const filteredCompras = compras.filter((c) => {
    const matchesSearch =
      String(c.ID_usuario).includes(searchTerm) ||
      String(c.ID_compra).includes(searchTerm);

    const matchesEstado = filterEstado
      ? c.Estado.toLowerCase() === filterEstado.toLowerCase()
      : true;

    const fechaCompra = new Date(c.Fecha_compra);
    const matchesFecha =
      (!filterFechaInicio || fechaCompra >= new Date(filterFechaInicio)) &&
      (!filterFechaFin || fechaCompra <= new Date(filterFechaFin));

    return matchesSearch && matchesEstado && matchesFecha;
  });

  // Exportar PDF
  const handleExportPDF = () => {
    const columns = ["ID Compra", "ID Usuario", "Fecha", "Monto Total", "Estado"];
    const rows = filteredCompras.map((c) => [
      c.ID_compra,
      c.ID_usuario,
      new Date(c.Fecha_compra).toLocaleDateString(),
      Number(c.Monto_total).toLocaleString(),
      c.Estado.charAt(0).toUpperCase() + c.Estado.slice(1),
    ]);
    exportTableToPDF("Compras Registradas", columns, rows);
  };

  if (loading) return <p className="text-white p-4">Cargando compras...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Compras</h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="number"
          name="ID_usuario"
          placeholder="ID Usuario"
          value={formData.ID_usuario}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="date"
          name="Fecha_compra"
          placeholder="Fecha"
          value={formData.Fecha_compra}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="number"
          name="Monto_total"
          placeholder="Monto Total"
          value={formData.Monto_total}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <select
          name="Estado"
          value={formData.Estado}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        >
          <option value="">Selecciona un estado</option>
          {ESTADOS_COMPRAS.map((estado) => (
            <option key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
        >
          {editMode ? "Guardar Cambios" : "Agregar Compra"}
        </button>
      </form>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar compras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_COMPRAS.map((estado) => (
            <option key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={filterFechaInicio}
          onChange={(e) => setFilterFechaInicio(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="date"
          value={filterFechaFin}
          onChange={(e) => setFilterFechaFin(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <button
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Exportar PDF
        </button>
      </div>

      {/* Tabla */}
      {filteredCompras.length === 0 ? (
        <p>No hay compras registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-green-600 text-left">
                <th className="py-3 px-4">ID Compra</th>
                <th className="py-3 px-4">ID Usuario</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Monto Total</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompras.map((c) => (
                <tr
                  key={c.ID_compra}
                  className="border-b border-slate-700 hover:bg-slate-800"
                >
                  <td className="py-2 px-4">{c.ID_compra}</td>
                  <td className="py-2 px-4">{c.ID_usuario}</td>
                  <td className="py-2 px-4">
                    {new Date(c.Fecha_compra).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    ${Number(c.Monto_total).toLocaleString()}
                  </td>
                  <td className="py-2 px-4">
                    {c.Estado.charAt(0).toUpperCase() + c.Estado.slice(1)}
                  </td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.ID_compra)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Eliminar
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

export default ComprasList;
