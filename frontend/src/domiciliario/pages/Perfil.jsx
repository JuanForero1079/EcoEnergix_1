// src/pages/domiciliario/Perfil.jsx
import { useState } from "react";

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: "Juan Pérez",
    telefono: "3001234567",
    documento: "1029384756",
    vehiculo: "Moto",
    placa: "XYZ123",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-white mb-6">Mi Perfil</h1>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 max-w-xl">

        <h2 className="text-xl text-white font-semibold mb-4">Información Personal</h2>

        <form className="space-y-4 text-white">

          <div>
            <label className="block mb-1">Nombre completo</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Documento</label>
            <input
              name="documento"
              value={form.documento}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <h2 className="text-xl text-white font-semibold mt-6">Vehículo</h2>

          <div>
            <label className="block mb-1">Tipo de vehículo</label>
            <input
              name="vehiculo"
              value={form.vehiculo}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1">Placa</label>
            <input
              name="placa"
              value={form.placa}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          <button
            type="button"
            className="w-full bg-purple-600/80 hover:bg-purple-700 transition-all duration-300 p-3 rounded-xl text-white font-semibold mt-6"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}
