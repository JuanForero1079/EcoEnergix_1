// src/usuario/services/pedidoService.js
import API from "../../services/api";

// Crear un nuevo pedido
export const crearPedido = async () => {
  try {
    const res = await API.post("/pedido");
    return res.data;
  } catch (err) {
    console.error("Error al crear pedido:", err);
    throw err;
  }
};

// Obtener pedidos del usuario
export const getPedidos = async () => {
  try {
    const res = await API.get("/pedido");
    return res.data;
  } catch (err) {
    console.error("Error al obtener pedidos:", err);
    throw err;
  }
};

// Obtener detalles de un pedido
export const getDetallePedido = async (ID_pedido) => {
  try {
    const res = await API.get(`/pedido/${ID_pedido}`);
    return res.data;
  } catch (err) {
    console.error("Error al obtener detalle del pedido:", err);
    throw err;
  }
};
