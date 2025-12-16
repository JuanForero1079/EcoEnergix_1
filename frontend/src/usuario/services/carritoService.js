// src/usuario/services/carritoService.js
import API from "../../services/api"; // <-- ruta corregida

// Obtener carrito del usuario
export const getCarrito = async () => {
  try {
    const res = await API.get("/carrito");
    return res.data;
  } catch (err) {
    console.error("Error al obtener carrito:", err);
    throw err;
  }
};

// Agregar producto al carrito
export const agregarAlCarrito = async (producto) => {
  try {
    const payload = {
      ID_producto: producto.ID_producto,
      Cantidad: producto.cantidad || 1,
    };
    const res = await API.post("/carrito", payload);
    return res.data;
  } catch (err) {
    console.error("Error al agregar al carrito:", err);
    throw err;
  }
};

// Actualizar cantidad de un producto en carrito
export const actualizarCantidad = async (ID_carrito, cantidad) => {
  try {
    const res = await API.put(`/carrito/${ID_carrito}`, { Cantidad: cantidad });
    return res.data;
  } catch (err) {
    console.error("Error al actualizar cantidad:", err);
    throw err;
  }
};

// Eliminar producto del carrito
export const eliminarDelCarrito = async (ID_carrito) => {
  try {
    const res = await API.delete(`/carrito/${ID_carrito}`);
    return res.data;
  } catch (err) {
    console.error("Error al eliminar del carrito:", err);
    throw err;
  }
};

// Vaciar todo el carrito
export const vaciarCarrito = async () => {
  try {
    const carrito = await getCarrito();
    await Promise.all(carrito.map(item => eliminarDelCarrito(item.ID_carrito)));
    return true;
  } catch (err) {
    console.error("Error al vaciar carrito:", err);
    throw err;
  }
};
