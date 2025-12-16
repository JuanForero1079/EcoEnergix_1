// src/usuario/services/pagosCliente.js
import API from "../../services/api";

export const crearPagoCliente = async (Metodo_pago, Monto) => {
  try {
    // No enviamos Fecha_pago, el backend la genera
    const response = await API.post("/cliente/pago", { Metodo_pago, Monto });
    return response.data;
  } catch (error) {
    console.error("Error al crear pago:", error);
    throw error;
  }
};
