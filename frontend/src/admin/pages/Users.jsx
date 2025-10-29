// src/admin/pages/Users.jsx
import React, { useState, useEffect } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/usersService";

export default function Users() {
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

  return (
    <div className="p-6 space-y-6">
      {/* ENCABEZADO */}
      <div className="glass-container text-white">
        <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
        <p className="text-sm text-white/70">
          Administra los usuarios de la plataforma
        </p>
      </div>

      {/* FORMULARIO */}
      <div className="glass-container">
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
            className="flex-1 min-w-[180px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="flex-1 min-w-[180px] p-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none"
          >
            <option value="">Seleccionar rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Cliente">Cliente</option>
            <option value="Domiciliario">Domiciliario</option>
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      {/* TABLA */}
      <div className="glass-container">
        <div className="overflow-x-auto">
          <table className="w-full rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-[#00C9A7] to-[#7D5FFF] text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Correo</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/20 transition text-white"
                  >
                    <td className="p-3 text-center">{user.id}</td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1 rounded-lg border border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 rounded-lg border border-red-400 text-red-400 hover:bg-red-500 hover:text-white transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-300">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
