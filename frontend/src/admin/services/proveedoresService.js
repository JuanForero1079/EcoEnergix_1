// src/admin/services/proveedoresService.js
import API from "./api";

export const getProveedores = async () => {
  return API.get("/proveedores");
};

export const getProveedorById = async (id) => {
  return API.get(`/proveedores/${id}`);
};

export const createProveedor = async (data) => {
  return API.post("/proveedores", data);
};

export const updateProveedor = async (id, data) => {
  return API.put(`/proveedores/${id}`, data);
};

export const deleteProveedor = async (id) => {
  return API.delete(`/proveedores/${id}`);
};
