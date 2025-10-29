// src/admin/pages/UsersAdmin.jsx
import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersServiceAdmin"; // ✅ ruta corregida

export default function UsersAdmin() { // ✅ nombre corregido
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", email: "", role: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;

    if (isEditing) {
      updateUser(form.id, form);
      setIsEditing(false);
    } else {
      createUser(form);
    }

    setForm({ id: null, name: "", email: "", role: "" });
    setUsers(getUsers());
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    deleteUser(id);
    setUsers(getUsers());
  };

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(2, 6, 23, 0.18)",
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div className="p-8 space-y-8 relative">
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 opacity-20 blur-3xl"></span>

      <div style={glassStyle} className="p-6">
        <h2 className="text-3xl font-bold text-white">Gestión de Usuarios</h2>
        <p className="text-sm text-white/70 mt-1">
          Administra los usuarios de la plataforma
        </p>
      </div>

      <div style={glassStyle} className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-center"
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Seleccionar rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
          </select>
          <button
            type="submit"
            className="relative px-6 py-3 rounded-xl font-medium text-white
                       bg-gradient-to-r from-teal-400 to-purple-500
                       shadow-[0_4px_15px_rgba(0,0,0,0.3)]
                       hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)]
                       transition-transform duration-300 ease-out"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      <div style={glassStyle} className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-teal-400 to-purple-500 text-white">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Correo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-white/20 transition text-white"
                >
                  <td className="p-3">{user.id}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 rounded-xl border border-blue-400 text-blue-400
                                 hover:bg-blue-500 hover:text-white transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-2 rounded-xl border border-red-400 text-red-400
                                 hover:bg-red-500 hover:text-white transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white/60">
                  No hay usuarios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
