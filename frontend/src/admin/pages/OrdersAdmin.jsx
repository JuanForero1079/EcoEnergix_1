// src/admin/pages/OrdersAdmin.jsx
import React, { useState, useEffect } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/ordersServiceAdmin"; // ✅ ruta corregida al servicio admin

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    id: null,
    client: "",
    total: "",
    status: "Pendiente",
  });
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Carga inicial
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data || []);
    };
    fetchOrders();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.client || form.total === "") return;

    const payload = {
      client: form.client,
      total: parseFloat(form.total),
      status: form.status,
    };

    if (isEditing) {
      await updateOrder(form.id, payload);
      setIsEditing(false);
    } else {
      await createOrder(payload);
    }

    setForm({ id: null, client: "", total: "", status: "Pendiente" });
    const data = await getOrders();
    setOrders(data || []);
  };

  const handleEdit = (order) => {
    setForm({
      id: order.id,
      client: order.client,
      total: order.total,
      status: order.status,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteOrder(id);
    const data = await getOrders();
    setOrders(data || []);
  };

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
    <div className="p-8 space-y-8 relative">
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-20 blur-3xl"></span>

      {/* ENCABEZADO */}
      <div style={glassStyle} className="p-6">
        <h2 className="text-3xl font-bold text-white">Gestión de Pedidos</h2>
        <p className="text-sm text-white/70 mt-1">
          Administra los pedidos realizados por los clientes
        </p>
      </div>

      {/* FORMULARIO */}
      <div style={glassStyle} className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            name="client"
            placeholder="Cliente"
            value={form.client}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            name="total"
            placeholder="Total"
            value={form.total}
            onChange={handleChange}
            className="flex-1 min-w-[140px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="flex-1 min-w-[140px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En camino">En camino</option>
            <option value="Completado">Completado</option>
          </select>
          <button
            type="submit"
            className="relative px-6 py-3 rounded-xl font-medium text-white
                       bg-gradient-to-r from-teal-400 to-purple-500
                       shadow-[0_4px_15px_rgba(0,0,0,0.3)]
                       hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]
                       transition-transform duration-300 ease-out"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/20 transition text-white">
                  <td className="p-3 text-center">{o.id}</td>
                  <td className="p-3">{o.client}</td>
                  <td className="p-3">${o.total}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(o)}
                      className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="px-4 py-2 rounded-xl border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white/60">
                  No hay pedidos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
