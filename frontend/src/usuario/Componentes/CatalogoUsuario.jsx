import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api"; 
import { useCarrito } from "../context/CarritoContext";
import { FaSearch, FaShoppingCart, FaTimes } from "react-icons/fa";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const normalizeText = (text) =>
  text?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() || "";

export default function CatalogoUsuario() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await API.get("/productos");
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3dc692]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5f54b3]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
        Catálogo de Productos
      </h1>
      <p className="text-center text-blue-200 text-lg mb-12">
        Encuentra los mejores paneles solares para tu hogar
      </p>

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

      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProductoSeleccionado(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="my-8"
            >
              <BackgroundGradient className="rounded-[22px] max-w-md w-full p-6 sm:p-10 bg-slate-900 relative max-h-[85vh] overflow-y-auto">
                <button
                  onClick={() => setProductoSeleccionado(null)}
                  className="absolute top-4 right-4 p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-full transition-all z-10"
                >
                  <FaTimes className="w-5 h-5" />
                </button>

                <img
                  src={productoSeleccionado.imagen || "https://via.placeholder.com/400"}
                  alt={productoSeleccionado.nombre || productoSeleccionado.Nombre_producto}
                  height="400"
                  width="400"
                  className="object-contain w-full h-64 mb-6 rounded-xl bg-white/5 p-4"
                />

                <p className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {productoSeleccionado.nombre || productoSeleccionado.Nombre_producto}
                </p>

                <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-[#3dc692] mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#3dc692] to-[#5f54b3] rounded-full"></span>
                    Descripción del Producto
                  </h3>
                  <p className="text-sm sm:text-base text-blue-200 leading-relaxed">
                    {productoSeleccionado.descripcion || productoSeleccionado.detalles || productoSeleccionado.Tipo_producto}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Potencia</p>
                    <p className="text-sm font-semibold text-white">
                      {productoSeleccionado.potencia || "300W"}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Eficiencia</p>
                    <p className="text-sm font-semibold text-white">
                      {productoSeleccionado.eficiencia || "Alta"}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Garantía</p>
                    <p className="text-sm font-semibold text-white">
                      {productoSeleccionado.garantia || "25 años"}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Tipo</p>
                    <p className="text-sm font-semibold text-white">
                      {productoSeleccionado.Tipo_producto || "Monocristalino"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    agregarAlCarrito(productoSeleccionado);
                    setProductoSeleccionado(null);
                  }}
                  className="rounded-full pl-6 pr-2 py-2 text-white flex items-center gap-2 bg-gradient-to-r from-[#3dc692] to-[#5f54b3] mt-4 text-sm font-bold hover:shadow-lg hover:shadow-[#3dc692]/50 transition-all"
                >
                  <FaShoppingCart className="w-4 h-4" />
                  <span>Agregar al carrito</span>
                  <span className="bg-slate-800 rounded-full text-xs px-3 py-1 text-white">
                    ${productoSeleccionado.precio?.toLocaleString() || productoSeleccionado.Precio?.toLocaleString()}
                  </span>
                </button>
              </BackgroundGradient>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}