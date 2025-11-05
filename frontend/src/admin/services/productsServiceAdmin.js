// src/admin/services/productsServiceAdmin.js
import axios from "axios";

// ✅ Conecta al backend
const API = axios.create({
  baseURL: "http://localhost:3001/api", // NO incluyas /productos aquí
});

// 🔹 Obtener todos los productos
export async function getProducts() {
  try {
    const res = await API.get("/productos");
    return res.data;
  } catch (err) {
    console.error("❌ Error al obtener productos:", err.response?.data || err.message);
    throw new Error("No se pudo obtener la lista de productos. Verifica el backend.");
  }
}

// 🔹 Crear producto
export async function createProduct(payload) {
  try {
    const res = await API.post("/productos", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error al crear producto:", err.response?.data || err.message);
    throw new Error("Error al crear el producto.");
  }
}

// 🔹 Actualizar producto
export async function updateProduct(id, payload) {
  try {
    const res = await API.put(`/productos/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("❌ Error al actualizar producto:", err.response?.data || err.message);
    throw new Error("Error al actualizar el producto.");
  }
}

// 🔹 Eliminar producto
export async function deleteProduct(id) {
  try {
    const res = await API.delete(`/productos/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error al eliminar producto:", err.response?.data || err.message);
    throw new Error("Error al eliminar el producto.");
  }
}
