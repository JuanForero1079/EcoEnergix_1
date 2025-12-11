import { useState } from "react";

export default function Direcciones() {
  const [direcciones, setDirecciones] = useState([
    {
      id: 1,
      nombre: "Casa Principal",
      direccion: "Cra 10 #20-30",
      ciudad: "Bogotá",
      detalles: "Puerta negra, timbre azul",
    },
    {
      id: 2,
      nombre: "Oficina",
      direccion: "Calle 45 #7-15",
      ciudad: "Bogotá",
      detalles: "Piso 3, oficina 305",
    },
  ]);

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    detalles: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const agregarDireccion = () => {
    if (!form.nombre || !form.direccion || !form.ciudad) return;

    const nueva = {
      id: Date.now(),
      ...form,
    };

    setDirecciones([...direcciones, nueva]);

    setForm({
      nombre: "",
      direccion: "",
      ciudad: "",
      detalles: "",
    });
  };

  const eliminarDireccion = (id) => {
    setDirecciones(direcciones.filter((d) => d.id !== id));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Direcciones Registradas</h1>

      {/* FORMULARIO */}
      <div className="bg-[#1e1f2b]/60 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/10 mb-8">
        <h2 className="text-xl font-bold mb-4">Agregar nueva dirección</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre (Ej: Casa, Oficina)"
            value={form.nombre}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
          />

          <input
            type="text"
            name="direccion"
            placeholder="Dirección"
            value={form.direccion}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
          />

          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
          />

          <input
            type="text"
            name="detalles"
            placeholder="Detalles adicionales"
            value={form.detalles}
            onChange={handleChange}
            className="p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none"
          />
        </div>

        <button
          onClick={agregarDireccion}
          className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 transition-all rounded-lg font-semibold"
        >
          Agregar dirección
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-[#1e1f2b]/60 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/10">
        <h2 className="text-xl font-bold mb-4">Mis direcciones</h2>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-purple-700/60">
              <th className="p-3">Nombre</th>
              <th className="p-3">Dirección</th>
              <th className="p-3">Ciudad</th>
              <th className="p-3">Detalles</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {direcciones.map((d) => (
              <tr key={d.id} className="text-center border-b border-white/10">
                <td className="p-3">{d.nombre}</td>
                <td className="p-3">{d.direccion}</td>
                <td className="p-3">{d.ciudad}</td>
                <td className="p-3">{d.detalles || "—"}</td>
                <td className="p-3">
                  <button
                    onClick={() => eliminarDireccion(d.id)}
                    className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition-all"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {direcciones.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-white/60 italic"
                >
                  No tienes direcciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
