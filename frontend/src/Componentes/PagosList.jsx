import React, { useEffect, useState } from "react";
import {
  getPagos,
  createPago,
  updatePago,
  deletePago,
} from "../admin/services/pagosService";

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

  //  Obtener pagos
  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getPagos();
      setPagos(res);
    } catch (err) {
      console.error("Error al obtener pagos:", err);
      setError("No se pudieron cargar los pagos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPagos();
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
        await updatePago(formData.ID_pago, formData);
        alert("  Pago actualizado correctamente");
      } else {
        await createPago(formData);
        alert("  Pago creado correctamente");
      }
      setFormData({
        ID_pago: null,
        ID_usuario: "",
        Monto: "",
        Fecha_pago: "",
        Metodo_pago: "",
        Estado_pago: "",
      });
      setEditMode(false);
      fetchPagos();
    } catch (err) {
      console.error("Error al guardar pago:", err);
      alert(" Error al guardar el pago.");
    }
  };

  const handleEdit = (pago) => {
    setFormData({
      ID_pago: pago.ID_pago,
      ID_usuario: pago.ID_usuario,
      Monto: pago.Monto,
      Fecha_pago: pago.Fecha_pago?.split("T")[0] || "",
      Metodo_pago: pago.Metodo_pago,
      Estado_pago: pago.Estado_pago,
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
      alert(" No se pudo eliminar el pago");
    }
  };

  if (loading) return <p>Cargando pagos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">💳 Gestión de Pagos</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="number" name="ID_usuario" placeholder="ID Usuario" value={formData.ID_usuario} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="number" name="Monto" placeholder="Monto" value={formData.Monto} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="date" name="Fecha_pago" value={formData.Fecha_pago} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Metodo_pago" placeholder="Método de pago" value={formData.Metodo_pago} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <input type="text" name="Estado_pago" placeholder="Estado" value={formData.Estado_pago} onChange={handleChange} className="p-2 rounded bg-slate-700 text-white" required />
        <button type="submit" className="col-span-1 md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded">
          {editMode ? " Guardar Cambios" : " Agregar Pago"}
        </button>
      </form>

      {/* Tabla */}
      {pagos.length === 0 ? (
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
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.ID_pago} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{pago.ID_pago}</td>
                  <td className="py-2 px-4">{pago.ID_usuario}</td>
                  <td className="py-2 px-4 text-center">${pago.Monto}</td>
                  <td className="py-2 px-4">{pago.Fecha_pago?.split("T")[0]}</td>
                  <td className="py-2 px-4">{pago.Metodo_pago}</td>
                  <td className="py-2 px-4">{pago.Estado_pago}</td>
                  <td className="py-2 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(pago)} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded"></button>
                    <button onClick={() => handleDelete(pago.ID_pago)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"></button>
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
