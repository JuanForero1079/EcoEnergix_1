import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCarrito as fetchCarritoBackend,
  agregarAlCarrito as agregarAlCarritoBackend,
  actualizarCantidad as actualizarCantidadBackend,
  eliminarDelCarrito as eliminarDelCarritoBackend,
  vaciarCarrito as vaciarCarritoBackend
} from '../services/carritoService';
import { getFullImageUrl } from "../../services/api.js";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar carrito desde backend al iniciar
  useEffect(() => {
    const cargarCarrito = async () => {
      try {
        const datos = await fetchCarritoBackend();
        const carritoFormateado = datos.map(item => ({
          id: item.ID_carrito,
          nombre: item.Nombre_producto,
          precio: item.Precio,
          cantidad: item.Cantidad,
          imagen: getFullImageUrl(item.Foto) || '/placeholder-product.png'
        }));
        setCarrito(carritoFormateado);
      } catch (err) {
        console.error('Error al cargar carrito:', err);
      } finally {
        setCargando(false);
      }
    };
    cargarCarrito();
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Carrito actualizado:', carrito);
  }, [carrito]);

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Agregar producto al carrito
  const agregarAlCarrito = async (producto) => {
    try {
      const nuevoItem = await agregarAlCarritoBackend(producto);
      setCarrito(prev => {
        const existe = prev.find(item => item.id === nuevoItem.ID_carrito);
        if (existe) {
          return prev.map(item =>
            item.id === nuevoItem.ID_carrito
              ? { ...item, cantidad: nuevoItem.Cantidad }
              : item
          );
        }
        return [...prev, {
          id: nuevoItem.ID_carrito,
          nombre: nuevoItem.Nombre_producto,
          precio: nuevoItem.Precio,
          cantidad: nuevoItem.Cantidad,
          imagen: getFullImageUrl(nuevoItem.Foto) || '/placeholder-product.png'
        }];
      });
    } catch (err) {
      console.error("Error agregando al carrito:", err);
    }
  };

  // Aumentar cantidad
  const aumentarCantidad = async (id) => {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    try {
      const actualizado = await actualizarCantidadBackend(id, item.cantidad + 1);
      setCarrito(prev =>
        prev.map(i =>
          i.id === id ? { ...i, cantidad: actualizado.Cantidad } : i
        )
      );
    } catch (err) {
      console.error("Error aumentando cantidad:", err);
    }
  };

  // Disminuir cantidad
  const disminuirCantidad = async (id) => {
    const item = carrito.find(i => i.id === id);
    if (!item || item.cantidad <= 1) return;
    try {
      const actualizado = await actualizarCantidadBackend(id, item.cantidad - 1);
      setCarrito(prev =>
        prev.map(i =>
          i.id === id ? { ...i, cantidad: actualizado.Cantidad } : i
        )
      );
    } catch (err) {
      console.error("Error disminuyendo cantidad:", err);
    }
  };

  // Eliminar producto
  const eliminarDelCarrito = async (id) => {
    try {
      await eliminarDelCarritoBackend(id);
      setCarrito(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("Error eliminando del carrito:", err);
    }
  };

  // Vaciar carrito
  const vaciarCarrito = async () => {
    if (!window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) return;
    try {
      await vaciarCarritoBackend();
      setCarrito([]);
    } catch (err) {
      console.error("Error vaciando carrito:", err);
    }
  };

  // Actualizar cantidad directamente
  const actualizarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    try {
      const actualizado = await actualizarCantidadBackend(id, nuevaCantidad);
      setCarrito(prev =>
        prev.map(i =>
          i.id === id ? { ...i, cantidad: actualizado.Cantidad } : i
        )
      );
    } catch (err) {
      console.error("Error actualizando cantidad:", err);
    }
  };

  const value = {
    carrito,
    total,
    cargando,
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    actualizarCantidad
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
