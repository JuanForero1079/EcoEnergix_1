import React, { createContext, useContext, useState } from "react";

// Creamos el contexto
const CarritoContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useCarrito = () => useContext(CarritoContext);

// Proveedor del contexto
export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  //  Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      // Verificar si ya existe en el carrito
      const productoExistente = prevCarrito.find((p) => p.id === producto.id);

      if (productoExistente) {
        // Si ya está, aumentar la cantidad
        return prevCarrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        // Si no está, agregarlo con cantidad = 1
        return [...prevCarrito, { ...producto, cantidad: 1 }];
      }
    });
  };

  //  Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter((p) => p.id !== id));
  };

  //  Vaciar carrito
  const vaciarCarrito = () => setCarrito([]);

  //  Calcular total siempre como número
  const total = carrito.reduce(
    (acc, item) => acc + Number(item.precio || 0) * (item.cantidad || 1),
    0
  );

  //  Calcular cantidad total de productos
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        total,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
