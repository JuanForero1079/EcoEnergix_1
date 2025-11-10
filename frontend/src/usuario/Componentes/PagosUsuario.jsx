import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api"; // Axios configurado

export default function PagosUsuario() {
  const { userId } = useParams();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await API.get(`/api/pagos/usuario/${userId}`);
        setPagos(res.data);
      } catch (err) {
        console.error("Error al cargar pagos:", err);
        setError("No se pudieron cargar tus pagos.");
      } finally {
        setLoading(false);
      }
    };
    fetchPagos();
  }, [userId]);

  if (loading) return <div className="text-center mt-10">Cargando pagos...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (pagos.length === 0) return <div className="text-center mt-10">No tienes pagos registrados.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Pagos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pagos.map((pago) => (
          <div key={pago.ID_pago} className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Pago #{pago.ID_pago}</h2>
            <p className="text-gray-600 mb-1">Monto: ${pago.Monto}</p>
            <p className="text-gray-600 mb-1">Método: {pago.Metodo}</p>
            <p className="text-gray-500 text-sm">Fecha: {new Date(pago.Fecha_pago).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">Estado: {pago.Estado || "Pendiente"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
