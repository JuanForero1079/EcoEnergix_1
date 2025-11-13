import API from "../../services/api";

//   Ajustar ruta con /api/admin
export const getEntregas = async () => {
  const res = await API.get("/api/admin/entregas"); // ⚡ CORREGIDO
  console.log("  Datos de entregas:", res.data);
  return res.data;
};

export const createEntrega = async (data) => {
  const res = await API.post("/api/admin/entregas", data);
  return res.data;
};

export const updateEntrega = async (id, data) => {
  const res = await API.put(`/api/admin/entregas/${id}`, data);
  return res.data;
};

export const deleteEntrega = async (id) => {
  const res = await API.delete(`/api/admin/entregas/${id}`);
  return res.data;
};
