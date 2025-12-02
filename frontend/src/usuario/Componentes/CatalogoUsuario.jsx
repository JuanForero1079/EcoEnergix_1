import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api"; 
import { useCarrito } from "../context/CarritoContext";
import { FaSearch, FaShoppingCart, FaTimes } from "react-icons/fa";

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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#3dc692] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-xl">Cargando productos...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-red-400 text-xl">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 pt-24">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Título */}
      <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
        Catálogo de Productos
      </h1>
      <p className="text-center text-blue-200 text-lg mb-12">
        Encuentra los mejores paneles solares para tu hogar
      </p>

      {/* Buscador */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#3dc692] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id || producto.ID_producto}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-[#3dc692]/20 hover:border-[#3dc692]/50 transition-all"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative overflow-hidden bg-white/5">
                <img
                  src={producto.imagen || "https://via.placeholder.com/400"}
                  alt={producto.nombre || producto.Nombre_producto}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-5">
                <h2 className="text-lg font-bold text-white mb-2">
                  {producto.nombre || producto.Nombre_producto}
                </h2>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent mb-3">
                  ${producto.precio?.toLocaleString() || producto.Precio?.toLocaleString()}
                </p>
                <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                  {producto.descripcion || producto.detalles || producto.Tipo_producto}
                </p>

                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => setProductoSeleccionado(producto)}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#3dc692]/50 transition-all"
                  >
                    Agregar 
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-12 text-center">
            <p className="text-blue-200 text-lg">
              No se encontraron productos que coincidan con "{busqueda}"
            </p>
          </div>
        )}
      </div>

      {/* Modal Detalles */}
      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-800/95 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl max-w-3xl w-full p-8 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => setProductoSeleccionado(null)}
                className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              <img
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre || productoSeleccionado.Nombre_producto}
                className="w-full h-64 object-contain bg-white/5 p-4 rounded-2xl mb-5"
              />
              
              <h2 className="text-3xl font-bold text-white mb-3">
                {productoSeleccionado.nombre || productoSeleccionado.Nombre_producto}
              </h2>
              
              <p className="text-4xl font-bold bg-gradient-to-r from-[#3dc692] to-[#5f54b3] bg-clip-text text-transparent mb-4">
                ${productoSeleccionado.precio?.toLocaleString() || productoSeleccionado.Precio?.toLocaleString()}
              </p>
              
              <p className="text-blue-200 text-lg mb-6 leading-relaxed">
                {productoSeleccionado.descripcion || productoSeleccionado.detalles || productoSeleccionado.Tipo_producto}
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setProductoSeleccionado(null)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => agregarAlCarrito(productoSeleccionado)}
                  className="px-6 py-3 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-[#3dc692]/50 transition-all flex items-center gap-2"
                >
                  <FaShoppingCart className="w-5 h-5" />
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