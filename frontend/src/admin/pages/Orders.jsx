// Orders.jsx
import React, { useState, useEffect } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../services/ordersService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ id: null, client: "", total: "", status: "Pendiente" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.client || form.total === "") return;

    const payload = { client: form.client, total: parseFloat(form.total), status: form.status };

    if (isEditing) {
      updateOrder(form.id, payload);
      setIsEditing(false);
    } else {
      createOrder(payload);
    }

    setForm({ id: null, client: "", total: "", status: "Pendiente" });
    setOrders(getOrders());
  };

  const handleEdit = (o) => {
    setForm({ id: o.id, client: o.client, total: o.total, status: o.status });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    deleteOrder(id);
    setOrders(getOrders());
  };

  return (
    <div className="p-6 space-y-6">
      {/* ENCABEZADO */}
      <div className="glass-container text-white">
        <h2 className="text-3xl font-bold">Gestión de Pedidos</h2>
        <p className="text-sm text-white/70">Administra los pedidos realizados por los clientes</p>
      </div>

      {/* FORMULARIO */}
      <div className="glass-container">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            name="client"
            placeholder="Cliente"
            value={form.client}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <input
            type="number"
            name="total"
            placeholder="Total"
            value={form.total}
            onChange={handleChange}
            className="flex-1 min-w-[140px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="flex-1 min-w-[140px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En camino">En camino</option>
            <option value="Completado">Completado</option>
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div className="glass-container">
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white">
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
                        className="px-3 py-1 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
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
                    No hay pedidos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}