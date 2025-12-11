import React from "react";

export default function Configuracion() {
  return (
    <div className="p-6">
      <h1 className="text-3xl text-white font-bold mb-6">
        Configuración del Sistema
      </h1>

      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow max-w-xl">
        <label className="text-white">Notificaciones</label>
        <select className="w-full p-3 bg-white/20 text-white rounded-xl mt-2">
          <option className="text-black">Activadas</option>
          <option className="text-black">Desactivadas</option>
        </select>

        <button className="mt-6 bg-teal-500 hover:bg-teal-600 w-full p-3 rounded-xl text-white font-bold">
          Guardar
        </button>
      </div>
    </div>
  );
}
