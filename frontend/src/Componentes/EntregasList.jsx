// src/Componentes/EntregasList.jsx
import React, { useEffect, useState } from "react";
// 🔹 Importamos el API del admin
import API from "../admin/services/api";

function EntregasList() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEntregas();
  }, []);

  // 🔹 Obtener entregas desde la API del admin
  const fetchEntregas = async () => {
    try {
      const res = await API.get("/admin/entregas"); // ✅ Ruta correcta
      setEntregas(res.data);
    } catch (err) {
      console.error("❌ Error al cargar entregas:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando entregas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 text-white">
      <h2 className="text-2xl font-bold mb-4">📦 Lista de Entregas</h2>
      {entregas.length === 0 ? (
        <p>No hay entregas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-slate-900 text-gray-100 border border-slate-700 rounded-lg">
            <thead>
              <tr className="bg-indigo-700 text-left">
                <th className="py-3 px-4">ID Entrega</th>
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((e) => (
                <tr key={e.ID_entrega} className="border-b border-slate-700 hover:bg-slate-800">
                  <td className="py-2 px-4">{e.ID_entrega}</td>
                  <td className="py-2 px-4">{e.ID_usuario}</td>
                  <td className="py-2 px-4">{e.ID_producto}</td>
                  <td className="py-2 px-4">{e.Cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EntregasList;
