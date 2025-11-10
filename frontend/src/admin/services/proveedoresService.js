// src/admin/services/proveedoresService.js
import API from "./api";

export const getProveedores = async () => {
  const res = await API.get("/admin/proveedores");
  return res.data;
};

export const getProveedorById = async (id) => {
  const res = await API.get(`/admin/proveedores/${id}`);
  return res.data;
};

export const createProveedor = async (data) => {
  const res = await API.post("/admin/proveedores", data);
  return res.data;
};

export const updateProveedor = async (id, data) => {
  const res = await API.put(`/admin/proveedores/${id}`, data);
  return res.data;
};

export const deleteProveedor = async (id) => {
  const res = await API.delete(`/admin/proveedores/${id}`);
  return res.data;
};
