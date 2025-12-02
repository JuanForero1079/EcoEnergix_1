import API from "./api";

// Función auxiliar para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

// Obtener todos los soportes
export const getSoportes = async () => {
  const res = await API.get("/soportes", { headers: getAuthHeaders() });
  return res.data;
};

// Obtener soporte por ID
export const getSoporteById = async (id) => {
  const res = await API.get(`/soportes/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

// Crear soporte
export const createSoporte = async (data) => {
  const res = await API.post("/soportes", data, { headers: getAuthHeaders() });
  return res.data;
};

// Actualizar soporte
export const updateSoporte = async (id, data) => {
  const res = await API.put(`/soportes/${id}`, data, { headers: getAuthHeaders() });
  return res.data;
};

// Eliminar soporte
export const deleteSoporte = async (id) => {
  const res = await API.delete(`/soportes/${id}`, { headers: getAuthHeaders() });
  return res.data;
};
