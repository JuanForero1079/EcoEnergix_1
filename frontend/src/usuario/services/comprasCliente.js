// src/services/comprasCliente.js
import API from "../../services/api";

export const crearCompra = async (carrito, ID_pago, ID_pedido) => {
  try {
    const res = await API.post("/cliente/compra", { carrito, ID_pago, ID_pedido });
    return res.data;
  } catch (error) {
    console.error("Error al crear compra:", error);
    throw error;
  }
};
