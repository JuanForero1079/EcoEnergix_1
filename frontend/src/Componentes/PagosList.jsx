import React, { useEffect, useState } from "react";
import API from "../admin/services/api"; // Axios configurado con baseURL /api/admin
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
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    fetchPagos();
  }, []);

  // -----------------------
  // Funciones de API
  // -----------------------
  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/pagos"); // ruta correcta
      setPagos(res.data);
    } catch (err) {
      console.error("Error al obtener pagos:", err);
      setError("No se pudieron cargar los pagos.");
    } finally {
      setLoading(false);
    }
  };

  const createPago = async (data) => await API.post("/pagos", data);
  const updatePago = async (id, data) => await API.put(`/pagos/${id}`, data);
  const deletePago = async (id) => await API.delete(`/pagos/${id}`);

  // -----------------------
  // Handlers
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      setFormData({
        ID_pago: null,
        ID_usuario: "",
        Monto: "",
        Fecha_pago: "",
        Metodo_pago: "",
      });
      setEditMode(false);
      fetchPagos();
    } catch (err) {
      console.error("Error al guardar pago:", err);
      alert("Error al guardar el pago.");
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

  // -----------------------
  // Utilidades
  // -----------------------
  const formatFecha = (fechaString) => {
    if (!fechaString) return "";
    const fecha = new Date(fechaString);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

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

  const handleExportPDF = () => {
    const columns = ["ID", "Usuario", "Monto", "Fecha", "Método"];
    const rows = filteredPagos.map((p) => [
      p.ID_pago,
      p.ID_usuario,
      p.Monto,
      formatFecha(p.Fecha_pago),
      p.Metodo_pago,
    ]);
    exportTableToPDF("Pagos Registrados", columns, rows);
  };

  // -----------------------
  // Render
  // -----------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-full text-white">
        <p>Cargando pagos...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 font-semibold text-center mt-10">{error}</div>
    );

  return (
    <div className="p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">Gestión de Pagos</h2>

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
          type="number"
          name="Monto"
          placeholder="Monto"
          value={formData.Monto}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="date"
          name="Fecha_pago"
          value={formData.Fecha_pago}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <input
          type="text"
          name="Metodo_pago"
          placeholder="Método de pago"
          value={formData.Metodo_pago}
          onChange={handleChange}
          className="p-2 rounded bg-slate-700 text-white"
          required
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition"
        >
          {editMode ? "Guardar Cambios" : "Agregar Pago"}
        </button>
      </form>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por Usuario o Método..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
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
      {filteredPagos.length === 0 ? (
        <p>No hay pagos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-left">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPagos.map((pago) => (
                <tr
                  key={pago.ID_pago}
                  className="border-b border-slate-700 hover:bg-slate-800"
                >
                  <td className="py-2 px-4">{pago.ID_pago}</td>
                  <td className="py-2 px-4">{pago.ID_usuario}</td>
                  <td className="py-2 px-4 text-center">${pago.Monto}</td>
                  <td className="py-2 px-4">{formatFecha(pago.Fecha_pago)}</td>
                  <td className="py-2 px-4">{pago.Metodo_pago}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(pago)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-1 px-3 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pago.ID_pago)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
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

export default PagosList;
