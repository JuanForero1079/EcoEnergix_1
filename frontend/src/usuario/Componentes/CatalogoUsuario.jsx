
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api"; 
import { useCarrito } from "../context/CarritoContext";

// Función para normalizar texto (sin tildes y minúsculas)
const normalizeText = (text) =>
  text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

export default function CatalogoUsuario() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { agregarAlCarrito } = useCarrito();

  //  Cargar productos desde la BD
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/api/productos");
        setProductos(res.data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // Filtrado según búsqueda
  const productosFiltrados = productos.filter((p) =>
    normalizeText(p.nombre || p.Nombre_producto).includes(normalizeText(busqueda))
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-green-700 text-xl">
        Cargando productos...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-100 via-white to-green-50">
      {/* Título */}
      <h1 className="text-4xl font-bold text-green-700 text-center mb-8">
        Catálogo de Productos
      </h1>
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Buscador */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id || producto.ID_producto}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={producto.imagen || "https://via.placeholder.com/400"}
                alt={producto.nombre || producto.Nombre_producto}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  {producto.nombre || producto.Nombre_producto}
                </h2>
                <p className="text-green-600 font-bold text-xl mb-3">
                  ${producto.precio?.toLocaleString() || producto.Precio?.toLocaleString()}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {producto.descripcion || producto.detalles || producto.Tipo_producto}
                </p>

                <div className="flex justify-between">
                  <button
                    onClick={() => setProductoSeleccionado(producto)}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition-colors"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
                  >
                    Agregar 
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No se encontraron productos que coincidan con “{busqueda}”
          </p>
        )}
      </div>

      {/* Modal Detalles */}
      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-lg max-w-3xl w-full p-6 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <img
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre || productoSeleccionado.Nombre_producto}
                className="w-full h-64 object-contain bg-gray-50 p-4 rounded-2xl mb-5"
              />
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {productoSeleccionado.nombre || productoSeleccionado.Nombre_producto}
              </h2>
              <p className="text-green-600 text-xl font-bold mb-4">
                ${productoSeleccionado.precio?.toLocaleString() || productoSeleccionado.Precio?.toLocaleString()}
              </p>
              <p className="text-gray-600 text-lg mb-6">
                {productoSeleccionado.descripcion || productoSeleccionado.detalles || productoSeleccionado.Tipo_producto}
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setProductoSeleccionado(null)}
                  className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => agregarAlCarrito(productoSeleccionado)}
                  className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-colors"
                >
                  Agregar al carrito 
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
