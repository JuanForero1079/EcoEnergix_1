// src/admin/services/ordersServiceAdmin.js
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const STORAGE_KEY = "eco_orders_v1";
const API_URL = `${API_BASE_URL}/orders`;

const SAMPLE = [
  { id: 1, client: "Johan Castillo", total: 5000, status: "Pendiente" },
  { id: 2, client: "Emmanuel Torres", total: 1500, status: "Completado" },
];

export function getOrders() {
  // Backend real:
  // return axios.get(API_URL).then(res => res.data);

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
    return [...SAMPLE];
  }
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE));
    return [...SAMPLE];
  }
}

export function createOrder(payload) {
  // return axios.post(API_URL, payload);
  const list = getOrders();
  const newItem = { ...payload, id: Date.now() };
  list.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newItem;
}

export function updateOrder(id, payload) {
  // return axios.put(`${API_URL}/${id}`, payload);
  const list = getOrders().map((o) => (o.id === id ? { ...payload, id } : o));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function deleteOrder(id) {
  // return axios.delete(`${API_URL}/${id}`);
  const list = getOrders().filter((o) => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
