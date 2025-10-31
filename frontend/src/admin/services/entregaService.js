// src/admin/services/entregaService.js
import API from "../../services/api";

export const getEntregas = async () => {
  const res = await API.get("/entrega");
  console.log("📦 Datos de entregas:", res.data); // 👈 esto te mostrará si llegan los datos
  return res.data;
};

export const createEntrega = async (data) => {
  const res = await API.post("/entrega", data);
  return res.data;
};

export const updateEntrega = async (id, data) => {
  const res = await API.put(`/entrega/${id}`, data);
  return res.data;
};

export const deleteEntrega = async (id) => {
  const res = await API.delete(`/entrega/${id}`);
  return res.data;
};
