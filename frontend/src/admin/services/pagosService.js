// src/admin/services/pagosService.js
import API from "./api";

// 🔹 Obtener todos los pagos
export const getPagos = async () => {
  const res = await API.get("/admin/pagos");
  return res.data;
};

// 🔹 Obtener pago por ID
export const getPagoById = async (id) => {
  const res = await API.get(`/admin/pagos/${id}`);
  return res.data;
};

// 🔹 Crear pago
export const createPago = async (data) => {
  const res = await API.post("/admin/pagos", data);
  return res.data;
};

// 🔹 Actualizar pago
export const updatePago = async (id, data) => {
  const res = await API.put(`/admin/pagos/${id}`, data);
  return res.data;
};

// 🔹 Eliminar pago
export const deletePago = async (id) => {
  const res = await API.delete(`/admin/pagos/${id}`);
  return res.data;
};
