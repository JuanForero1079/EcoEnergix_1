import API from "../../services/api";

// ✅ Nota: la ruta correcta del backend es "/api/entregas"
export const getEntregas = async () => {
  const res = await API.get("/api/entregas");
  console.log("📦 Datos de entregas:", res.data);
  return res.data;
};

export const createEntrega = async (data) => {
  const res = await API.post("/api/entregas", data);
  return res.data;
};

export const updateEntrega = async (id, data) => {
  const res = await API.put(`/api/entregas/${id}`, data);
  return res.data;
};

export const deleteEntrega = async (id) => {
  const res = await API.delete(`/api/entregas/${id}`);
  return res.data;
};
