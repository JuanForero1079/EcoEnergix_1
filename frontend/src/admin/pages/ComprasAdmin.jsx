import React, { useState, useEffect } from "react";
import API from "../../services/api"; // usa Axios configurado con tu baseURL

export default function ComprasAdmin() {
  const [compras, setCompras] = useState([]);
  const [form, setForm] = useState({ id: null, fecha: "", total: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      const res = await API.get("/compras");
      setCompras(res.data);
    } catch (err) {
      console.error("Error al cargar compras:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fecha || !form.total) return;

    try {
      if (isEditing) {
        await API.put(`/compras/${form.id}`, form);
        setIsEditing(false);
      } else {
        await API.post("/compras", form);
      }
      setForm({ id: null, fecha: "", total: "" });
      fetchCompras();
    } catch (err) {
      console.error("Error al guardar compra:", err);
    }
  };

  const handleEdit = (compra) => {
    setForm(compra);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/compras/${id}`);
      fetchCompras();
    } catch (err) {
      console.error("Error al eliminar compra:", err);
    }
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

      <div style={glassStyle} className="p-6">
        <h2 className="text-3xl font-bold text-white">Gestión de Compras</h2>
        <p className="text-sm text-white/70 mt-1">
          Administra las compras registradas en la plataforma
        </p>
      </div>

      <div style={glassStyle} className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-center"
        >
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            name="total"
            placeholder="Total"
            value={form.total}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
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

      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {compras.length > 0 ? (
              compras.map((c) => (
                <tr key={c.id} className="hover:bg-white/20 transition text-white">
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.fecha}</td>
                  <td className="p-3">${c.total}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-4 py-2 rounded-xl border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-white/60">
                  No hay compras registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
