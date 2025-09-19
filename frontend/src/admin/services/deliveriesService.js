// src/admin/services/deliveriesService.js
import API from "../../services/api";

export async function getDeliveries() {
  const res = await API.get("/api/entrega");
  return res.data;
}

export async function createDelivery(data) {
  const res = await API.post("/api/entrega", data);
  return res.data;
}

export async function updateDelivery(id, data) {
  const res = await API.put(`/api/entrega/${id}`, data);
  return res.data;
}

export async function deleteDelivery(id) {
  const res = await API.delete(`/api/entrega/${id}`);
  return res.data;
}
