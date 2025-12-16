// src/services/pedidosCliente.js
import API from "../../services/api";

export const crearPedido = async (ID_pago) => {
  try {
    // Solo envías el ID del pago si tu backend lo requiere
    const res = await API.post("/cliente/pedido", { ID_pago });
    return res.data;
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
};
