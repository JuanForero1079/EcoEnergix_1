// src/usuario/services/detallePedidoService.js
import API from "../../services/api"; // <-- ruta corregida

// Obtener detalles de un pedido por ID
export const getDetallePedido = async (ID_pedido) => {
  try {
    const res = await API.get(`/detalle/${ID_pedido}`); // asumiendo tu ruta /detalle/:id
    return res.data;
  } catch (err) {
    console.error("Error al obtener detalle del pedido:", err);
    throw err;
  }
};
