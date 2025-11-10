import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api"; // Axios configurado

export default function SoporteUsuario() {
  const { userId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await API.get(`/api/soporte/usuario/${userId}`);
        setTickets(res.data);
      } catch (err) {
        console.error("Error al cargar tickets de soporte:", err);
        setError("No se pudieron cargar tus tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [userId]);

  if (loading) return <div className="text-center mt-10">Cargando soporte...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (tickets.length === 0) return <div className="text-center mt-10">No tienes tickets de soporte.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Soporte Técnico</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.ID_ticket} className="bg-white p-5 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Ticket #{ticket.ID_ticket}</h2>
            <p className="text-gray-600 mb-1">Asunto: {ticket.Asunto}</p>
            <p className="text-gray-600 mb-1">Categoría: {ticket.Categoria}</p>
            <p className="text-gray-500 text-sm">Fecha: {new Date(ticket.Fecha_creacion).toLocaleDateString()}</p>
            <p className="text-gray-500 text-sm">Estado: {ticket.Estado || "Pendiente"}</p>
            <p className="text-gray-600 mt-2">Descripción: {ticket.Descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
