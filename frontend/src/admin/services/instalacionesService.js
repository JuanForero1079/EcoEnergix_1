import API from "./api";

export const getInstalaciones = async () => {
  const res = await API.get("/admin/instalaciones"); // 
  return res.data;
};

export const getInstalacionById = async (id) => {
  const res = await API.get(`/admin/instalaciones/${id}`);
  return res.data;
};

export const createInstalacion = async (data) => {
  const res = await API.post("/admin/instalaciones", data);
  return res.data;
};

export const updateInstalacion = async (id, data) => {
  const res = await API.put(`/admin/instalaciones/${id}`, data);
  return res.data;
};

export const deleteInstalacion = async (id) => {
  const res = await API.delete(`/admin/instalaciones/${id}`);
  return res.data;
};
