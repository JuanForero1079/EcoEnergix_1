import React, { createContext, useContext, useState, useEffect } from 'react';

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    // Cargar carrito del localStorage al iniciar
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log('Carrito actualizado:', carrito); // Para debugging
  }, [carrito]);

  // Calcular total
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    console.log('Agregando producto:', producto); // Para debugging
    
    setCarrito((prevCarrito) => {
      // Buscar si el producto YA existe en el carrito usando su ID
      const productoExistente = prevCarrito.find(
        item => item.id === producto.id || item._id === producto._id
      );
      
      if (productoExistente) {
        // Si ya existe, solo aumentar la cantidad
        console.log('Producto existente, aumentando cantidad');
        return prevCarrito.map(item =>
          (item.id === producto.id || item._id === producto._id)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Si NO existe, agregarlo como nuevo producto con toda su información
        console.log('Producto nuevo, agregando al carrito');
        const nuevoProducto = {
          id: producto.id || producto._id,
          _id: producto._id || producto.id,
          nombre: producto.nombre || producto.name || producto.title || 'Producto sin nombre',
          precio: producto.precio || producto.price || 0,
          imagen: producto.imagen || producto.imagenUrl || producto.image || '/placeholder-product.png',
          descripcion: producto.descripcion || producto.description || '',
          cantidad: 1
        };
        return [...prevCarrito, nuevoProducto];
      }
    });
  };

  // Aumentar cantidad de un producto
  const aumentarCantidad = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map(item =>
        (item.id === id || item._id === id)
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // Disminuir cantidad de un producto
  const disminuirCantidad = (id) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map(item =>
        (item.id === id || item._id === id) && item.cantidad > 1
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => 
      prevCarrito.filter(item => item.id !== id && item._id !== id)
    );
  };

  // Vaciar carrito completo
  const vaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      setCarrito([]);
    }
  };

  // Actualizar cantidad directamente
  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito((prevCarrito) =>
      prevCarrito.map(item =>
        (item.id === id || item._id === id)
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const value = {
    carrito,
    total,
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