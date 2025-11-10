import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api"; 

export default function ComprasUsuario() {
  const { userId } = useParams(); 
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const res = await API.get(`/api/compras/usuario/${userId}`);
        setCompras(res.data);
      } catch (err) {
        console.error("Error al cargar compras:", err);
        setError("No se pudieron cargar tus compras.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, [userId]);

  if (loading) return <div className="text-center mt-10">Cargando compras...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (compras.length === 0) return <div className="text-center mt-10">No tienes compras registradas.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Compras</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {compras.map((compra) => (
          <div key={compra.ID_compra} className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">{compra.nombre_producto || "Producto"}</h2>
            <p className="text-gray-600 mb-1">Cantidad: {compra.cantidad || 1}</p>
            <p className="text-gray-600 mb-1">Precio: ${compra.Monto_total}</p>
            <p className="text-gray-500 text-sm">Fecha: {new Date(compra.Fecha_compra).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">Estado: {compra.Estado}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
