// src/admin/pages/DeliveriesAdmin.jsx
import React, { useState, useEffect } from "react";
import {
  getDeliveries,
  createDelivery,
  updateDelivery,
  deleteDelivery,
} from "../services/deliveriesServiceAdmin"; // 🔁 ruta corregida

export default function DeliveriesAdmin() {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    id: null,
    orderId: "",
    deliveryPerson: "",
    status: "Pendiente",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Si los servicios usan fetch o axios, esto debería ser asíncrono
    const fetchData = async () => {
      const data = await getDeliveries();
      setDeliveries(data || []);
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.orderId || !form.deliveryPerson || !form.status) return;

    const payload = {
      orderId: form.orderId,
      deliveryPerson: form.deliveryPerson,
      status: form.status,
    };

    if (isEditing) {
      await updateDelivery(form.id, payload);
    } else {
      await createDelivery(payload);
    }

    setIsEditing(false);
    setForm({ id: null, orderId: "", deliveryPerson: "", status: "Pendiente" });
    const data = await getDeliveries();
    setDeliveries(data || []);
  };

  const handleEdit = (delivery) => {
    setForm({
      id: delivery.id,
      orderId: delivery.orderId,
      deliveryPerson: delivery.deliveryPerson,
      status: delivery.status,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteDelivery(id);
    const data = await getDeliveries();
    setDeliveries(data || []);
  };

  // 🎨 Estilos Glass
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div className="p-6 space-y-6">
      {/* ENCABEZADO */}
      <div style={glassStyle} className="p-6 text-white">
        <h2 className="text-3xl font-bold">Gestión de Entregas</h2>
        <p className="text-sm text-white/70">
          Administra y controla el proceso de entregas
        </p>
      </div>

      {/* FORMULARIO */}
      <div style={glassStyle} className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-center"
        >
          <input
            type="text"
            name="orderId"
            placeholder="ID de la Orden"
            value={form.orderId}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <input
            type="text"
            name="deliveryPerson"
            placeholder="Persona de Entrega"
            value={form.deliveryPerson}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-lg border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-lg border border-white/30 bg-white/10 text-white focus:outline-none"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Camino">En Camino</option>
            <option value="Entregado">Entregado</option>
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-400 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div style={glassStyle} className="p-4 overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">ID Orden</th>
              <th className="p-3">Persona de Entrega</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length > 0 ? (
              deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-white/20 transition text-white">
                  <td className="p-3 text-center">{d.id}</td>
                  <td className="p-3 text-center">{d.orderId}</td>
                  <td className="p-3 text-center">{d.deliveryPerson}</td>
                  <td className="p-3 text-center">{d.status}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="px-3 py-1 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="px-3 py-1 rounded-lg border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-300">
                  No hay entregas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
