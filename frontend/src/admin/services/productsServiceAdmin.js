// src/admin/services/productsServiceAdmin.js

const API_URL = "http://localhost:3001/api/admin/productos";

// ===== Modo pruebas: false → usar token real; true → deshabilita token
const modoPruebas = false;

const getHeaders = () => {
  if (modoPruebas) return { "Content-Type": "application/json" };
  
  const token = localStorage.getItem("token"); // o de donde guardes tu JWT
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const ProductosService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      const res = await fetch(API_URL, { headers: getHeaders() });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error en ProductosService.getAll:", err);
      throw err;
    }
  },

  // Crear producto
  create: async (productoData) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(productoData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error en ProductosService.create:", err);
      throw err;
    }
  },

  // Actualizar producto
  update: async (id, productoData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(productoData),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error en ProductosService.update:", err);
      throw err;
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error en ProductosService.delete:", err);
      throw err;
    }
  },

  // Subir imagen de producto
  uploadImage: async (id, formData) => {
    try {
      const res = await fetch(`${API_URL}/${id}/imagen`, {
        method: "POST",
        headers: modoPruebas ? {} : { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData, // formData ya tiene "imagen"
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error en ProductosService.uploadImage:", err);
      throw err;
    }
  },

  // Carga masiva CSV
  bulkUpload: async (formDataCSV) => {
    try {
      const res = await fetch(`${API_URL}/carga-masiva`, { // ojo: tu ruta en server.js
        method: "POST",
        headers: modoPruebas ? {} : { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formDataCSV,
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Error en ProductosService.bulkUpload:", err);
      throw err;
    }
  },
};

export default ProductosService;
