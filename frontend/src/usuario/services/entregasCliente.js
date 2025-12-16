// src/services/entregasCliente.js
import API from "../../services/api";

export const crearEntrega = async (ID_pedido) => {
  try {
    const res = await API.post("/cliente/entrega", { ID_pedido });
    return res.data;
  } catch (error) {
    console.error("Error al crear entrega:", error);
    throw error;
  }
};
