// src/admin/services/usersServiceAdmin.js
import API from "../../services/api";

// 🔹 Obtener todos los usuarios (con token)
export const getUsuarios = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/api/usuarios", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// 🔹 Crear un nuevo usuario (solo admin)
export const createUsuario = async (data) => {
  const token = localStorage.getItem("token");

  const res = await API.post("/api/usuarios", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// 🔹 Actualizar usuario existente
export const updateUsuario = async (id, data) => {
  const token = localStorage.getItem("token");

  const res = await API.put(`/api/usuarios/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

// 🔹 Eliminar usuario (solo admin)
export const deleteUsuario = async (id) => {
  const token = localStorage.getItem("token");

  const res = await API.delete(`/api/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};
