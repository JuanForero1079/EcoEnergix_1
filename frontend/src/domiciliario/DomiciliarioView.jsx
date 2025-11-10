import React from "react";

export default function DomiciliarioView() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6">
      <h1>Bienvenido, {user?.nombre}</h1>
      <p>Esta es la vista simple para Domiciliario.</p>
    </div>
  );
}
