import React, { useState, useEffect } from "react";

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: "Emmanuel Piñeros",
    correo: "emmanuel@ecoenergix.com",
    telefono: "+57 310 000 0000",
    direccion: "Calle 123 #45-67, Bogotá, Colombia",
  });

  // temp para editar sin afectar inmediatamente el estado real
  const [tempUsuario, setTempUsuario] = useState(usuario);
  const [editando, setEditando] = useState(false);

  // Sincronizar temp con usuario si usuario cambia por fuera
  useEffect(() => {
    setTempUsuario(usuario);
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempUsuario((prev) => ({ ...prev, [name]: value }));
  };

  // Aseguramos que Editar sea tipo button (no submit)
  const handleEditar = () => {
    console.log("handleEditar -> activando modo edición");
    setTempUsuario(usuario);
    setEditando(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault(); // evita submit por si acaso
    console.log("handleGuardar -> guardando", tempUsuario);
    setUsuario(tempUsuario);
    setEditando(false);
    // alerta solo al guardar
    alert("✅ Información actualizada correctamente");
  };

  const handleCancelar = () => {
    console.log("handleCancelar -> cancelando edición");
    setTempUsuario(usuario);
    setEditando(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Perfil <span className="text-green-600">del Usuario</span>
      </h1>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Información Personal</h2>

        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={editando ? tempUsuario.nombre : usuario.nombre}
              onChange={handleChange}
              disabled={!editando}
              className={`w-full p-2 border rounded-lg transition ${
                editando
                  ? "border-green-400 focus:ring-2 focus:ring-green-500 bg-white"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Correo:</label>
            <input
              type="email"
              name="correo"
              value={editando ? tempUsuario.correo : usuario.correo}
              onChange={handleChange}
              disabled={!editando}
              className={`w-full p-2 border rounded-lg transition ${
                editando
                  ? "border-green-400 focus:ring-2 focus:ring-green-500 bg-white"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Teléfono:</label>
            <input
              type="text"
              name="telefono"
              value={editando ? tempUsuario.telefono : usuario.telefono}
              onChange={handleChange}
              disabled={!editando}
              className={`w-full p-2 border rounded-lg transition ${
                editando
                  ? "border-green-400 focus:ring-2 focus:ring-green-500 bg-white"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Dirección:</label>
            <input
              type="text"
              name="direccion"
              value={editando ? tempUsuario.direccion : usuario.direccion}
              onChange={handleChange}
              disabled={!editando}
              className={`w-full p-2 border rounded-lg transition ${
                editando
                  ? "border-green-400 focus:ring-2 focus:ring-green-500 bg-white"
                  : "bg-gray-100 border-gray-300 cursor-not-allowed"
              }`}
            />
          </div>

          <div className="mt-8 flex justify-end gap-4">
            {!editando ? (
              // <- IMPORTANTE: type="button" para evitar submit accidental
              <button
                type="button"
                onClick={handleEditar}
                className="px-5 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Editar Información
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>

                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-5 py-2 border border-gray-400 text-gray-700 rounded-xl hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
