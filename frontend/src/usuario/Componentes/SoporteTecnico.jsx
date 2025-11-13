import React, { useState } from "react";

export default function SoporteTecnico() {
  const [mensaje, setMensaje] = useState("");

  const enviarSoporte = (e) => {
    e.preventDefault();
    alert("Tu solicitud ha sido enviada al soporte técnico. ");
    setMensaje("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Soporte <span className="text-green-600">Técnico</span>
      </h1>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-8">
        <p className="mb-6 text-gray-600">
          ¿Tienes algún inconveniente con tu compra, instalación o pago?
          Escríbenos y nuestro equipo te ayudará lo antes posible.
        </p>

        <form onSubmit={enviarSoporte}>
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Describe tu problema..."
            className="w-full h-32 p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            type="submit"
            className="mt-4 px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  );
}
