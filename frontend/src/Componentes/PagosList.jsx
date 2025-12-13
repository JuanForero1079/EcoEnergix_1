import React, { useEffect, useState } from "react";
import API from "../admin/services/api"; // baseURL: /api
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
    Estado_pago: "", // 🔑 OBLIGATORIO SEGÚN BACKEND
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // ===============================
  // FETCH
  // ===============================
  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/pagos");
      setPagos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al obtener pagos:", err);
      setError("No se pudieron cargar los pagos.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // API ACTIONS
  // ===============================
  const createPago = (data) => API.post("/admin/pagos", data);
  const updatePago = (id, data) => API.put(`/admin/pagos/${id}`, data);
  const deletePago = (id) => API.delete(`/admin/pagos/${id}`);

  // ===============================
  // FORM HANDLERS
  // ===============================
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
        await updatePago(formData.ID_pago, formData);
        alert("Pago actualizado correctamente");
      } else {
        await createPago(formData);
        alert("Pago creado correctamente");
      }

      resetForm();
      fetchPagos();
    } catch (err) {
      console.error("Error al guardar pago:", err);
      alert("Error al guardar el pago");
    }
  };

  const handleEdit = (pago) => {
    setFormData({
      ...pago,
      Fecha_pago: pago.Fecha_pago?.split("T")[0] || "",
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este pago?")) return;
    try {
      await deletePago(id);
      alert("Pago eliminado correctamente");
      fetchPagos();
    } catch (err) {
      console.error("Error al eliminar pago:", err);
      alert("No se pudo eliminar el pago");
    }
  };

  // ===============================
  // HELPERS
  // ===============================
  const formatFecha = (fechaString) => {
    if (!fechaString) return "";
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString();
  };

  const filteredPagos = pagos.filter((p) => {
    const fecha = new Date(p.Fecha_pago);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const matchFecha =
      (!inicio || fecha >= inicio) && (!fin || fecha <= fin);

    const matchSearch =
      p.ID_usuario.toString().includes(searchTerm) ||
      p.Metodo_pago.toLowerCase().includes(searchTerm.toLowerCase());

    return matchFecha && matchSearch;
  });

  const handleExportPDF = () => {
    const columns = ["ID", "Usuario", "Monto", "Fecha", "Método", "Estado"];
    const rows = filteredPagos.map((p) => [
      p.ID_pago,
      p.ID_usuario,
      p.Monto,
      formatFecha(p.Fecha_pago),
      p.Metodo_pago,
      p.Estado_pago,
    ]);

    exportTableToPDF("Pagos Registrados", columns, rows);
  };

  // ===============================
  // RENDER
  // ===============================
  if (loading)
    return <p className="text-white text-center">Cargando pagos...</p>;

  if (error)
    return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-xl text-white border border-slate-700">
      <h2 className="text-2xl font-bold mb-4">Gestión de Pagos</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        <input
          type="number"
          name="ID_usuario"
          placeholder="ID Usuario"
          value={formData.ID_usuario}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
          required
        />

        <input
          type="number"
          name="Monto"
          placeholder="Monto"
          value={formData.Monto}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
          required
        />

        <input
          type="date"
          name="Fecha_pago"
          value={formData.Fecha_pago}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
          required
        />

        <input
          type="text"
          name="Metodo_pago"
          placeholder="Método de pago"
          value={formData.Metodo_pago}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
          required
        />

        <select
          name="Estado_pago"
          value={formData.Estado_pago}
          onChange={handleChange}
          className="p-2 bg-slate-700 rounded"
          required
        >
          <option value="">Estado del pago</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>

        <button className="col-span-1 md:col-span-3 bg-indigo-600 hover:bg-indigo-700 py-2 rounded">
          {editMode ? "Guardar cambios" : "Agregar pago"}
        </button>
      </form>

      {/* FILTERS */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar usuario o método"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="p-2 bg-slate-700 rounded"
        />

        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="p-2 bg-slate-700 rounded"
        />

        <button
          onClick={handleExportPDF}
          className="bg-green-600 px-4 py-2 rounded"
        >
          Exportar PDF
        </button>
      </div>

      {/* TABLE */}
      <table className="min-w-full bg-slate-900 border border-slate-700 rounded">
        <thead className="bg-blue-600">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Usuario</th>
            <th className="p-2">Monto</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Método</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {filteredPagos.map((p) => (
            <tr key={p.ID_pago} className="border-b border-slate-700">
              <td className="p-2">{p.ID_pago}</td>
              <td className="p-2">{p.ID_usuario}</td>
              <td className="p-2">${p.Monto}</td>
              <td className="p-2">{formatFecha(p.Fecha_pago)}</td>
              <td className="p-2">{p.Metodo_pago}</td>
              <td className="p-2">{p.Estado_pago}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.ID_pago)}
                  className="bg-red-600 px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PagosList;
