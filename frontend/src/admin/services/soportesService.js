// src/admin/services/soportesService.js
import API from "./api";

// Obtener todos los soportes
export const getSoportes = async () => {
  const res = await API.get("/soportes");
  return res.data;
};

// Obtener soporte por ID
export const getSoporteById = async (id) => {
  const res = await API.get(`/soportes/${id}`);
  return res.data;
};

// Crear soporte
export const createSoporte = async (data) => {
  const res = await API.post("/soportes", data);
  return res.data;
};

// Actualizar soporte
export const updateSoporte = async (id, data) => {
  const res = await API.put(`/soportes/${id}`, data);
  return res.data;
};

// Eliminar soporte
export const deleteSoporte = async (id) => {
  const res = await API.delete(`/soportes/${id}`);
  return res.data;
};
