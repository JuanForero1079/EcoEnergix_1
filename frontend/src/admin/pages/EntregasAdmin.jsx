import React, { useState, useEffect } from "react";
import {
  getEntregas,
  createEntrega,
  updateEntrega,
  deleteEntrega,
} from "../services/entregaService";
import camionSolar from "../../assets/camion-solar-1.jpg"; // 🚚 Imagen de fondo

export default function EntregasAdmin() {
  const [entregas, setEntregas] = useState([]);
  const [form, setForm] = useState({
    ID_entrega: null,
    Fecha_entrega: "",
    ID_usuario: "",
    ID_producto: "",
    Cantidad: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // 🧭 Cargar entregas al iniciar
  useEffect(() => {
    fetchEntregas();
  }, []);

  // 🗂️ Traer entregas desde el backend
  const fetchEntregas = async () => {
    try {
      const data = await getEntregas();
      console.log("📦 Datos recibidos desde backend:", data);
      if (Array.isArray(data)) {
        setEntregas(data);
      } else {
        console.warn("⚠️ La respuesta no es un array:", data);
      }
    } catch (err) {
      console.error("❌ Error al cargar entregas:", err);
    }
  };

  // 📝 Controlar los inputs del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Crear o actualizar entrega
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Fecha_entrega || !form.ID_usuario || !form.ID_producto || !form.Cantidad)
      return alert("⚠️ Todos los campos son obligatorios");

    try {
      if (isEditing) {
        await updateEntrega(form.ID_entrega, form);
        setIsEditing(false);
      } else {
        await createEntrega(form);
      }
      setForm({
        ID_entrega: null,
        Fecha_entrega: "",
        ID_usuario: "",
        ID_producto: "",
        Cantidad: "",
      });
      fetchEntregas();
    } catch (err) {
      console.error("❌ Error al guardar entrega:", err);
    }
  };

  // ✏️ Editar entrega
  const handleEdit = (entrega) => {
    setForm(entrega);
    setIsEditing(true);
  };

  // 🗑️ Eliminar entrega
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta entrega?")) return;
    try {
      await deleteEntrega(id);
      fetchEntregas();
    } catch (err) {
      console.error("❌ Error al eliminar entrega:", err);
    }
  };

  // 💎 Efecto vidrio (glassmorphism)
  const glassStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div
      className="p-8 space-y-8 relative min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${camionSolar})`,
      }}
    >
      {/* Oscurecer fondo */}
      <div className="absolute inset-0 bg-black/60 -z-10"></div>

      {/* Encabezado */}
      <div style={glassStyle} className="p-6 flex items-center gap-4">
        <img
          src="/assets/EcoEnergixLog.png"
          alt="EcoEnergix"
          className="w-12 h-12 object-contain drop-shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold text-white">Gestión de Entregas</h2>
          <p className="text-sm text-white/70 mt-1">
            Administra las entregas registradas en el sistema
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div style={glassStyle} className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-center justify-between"
        >
          <input
            type="date"
            name="Fecha_entrega"
            value={form.Fecha_entrega}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <input
            type="number"
            name="ID_usuario"
            placeholder="ID Usuario"
            value={form.ID_usuario}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <input
            type="number"
            name="ID_producto"
            placeholder="ID Producto"
            value={form.ID_producto}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <input
            type="number"
            name="Cantidad"
            placeholder="Cantidad"
            value={form.Cantidad}
            onChange={handleChange}
            className="flex-1 min-w-[150px] p-3 rounded-xl border border-white/30 bg-white/10 text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-teal-400 to-purple-500 hover:scale-105 transition"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Usuario</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Cantidad</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {entregas.length > 0 ? (
              entregas.map((e) => (
                <tr key={e.ID_entrega} className="hover:bg-white/20 text-white">
                  <td className="p-3">{e.ID_entrega}</td>
                  <td className="p-3">
                    {new Date(e.Fecha_entrega).toLocaleDateString("es-CO")}
                  </td>
                  <td className="p-3">{e.ID_usuario}</td>
                  <td className="p-3">{e.ID_producto}</td>
                  <td className="p-3">{e.Cantidad}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(e)}
                      className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(e.ID_entrega)}
                      className="px-4 py-2 rounded-xl border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-white/60">
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
