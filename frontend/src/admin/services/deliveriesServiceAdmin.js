// src/admin/services/deliveriesServiceAdmin.js
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

const STORAGE_KEY = "eco_deliveries_v1";
const API_URL = `${API_BASE_URL}/deliveries`;

const SAMPLE = [
  { id: 1, orderId: "#1001", deliveryPerson: "Luis Gómez", status: "En camino" },
  { id: 2, orderId: "#1002", deliveryPerson: "Ana Martínez", status: "Entregado" },
];

export function getDeliveries() {
  // Si existe backend:
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

export function createDelivery(payload) {
  // return axios.post(API_URL, payload);
  const list = getDeliveries();
  const newItem = { ...payload, id: Date.now() };
  list.push(newItem);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return newItem;
}
