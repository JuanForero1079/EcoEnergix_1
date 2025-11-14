import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api"; // importa tu Axios base

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // =========================================
  // Cargar productos desde el backend
  // =========================================
  useEffect(() => {
    API.get("/api/productos")
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error obteniendo productos:", error);
      });
  }, []);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Título */}
      <h2 className="text-3xl font-bold text-center mb-10 text-white">
        Nuestro Catálogo
      </h2>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productos.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            Cargando productos...
          </p>
        ) : (
          productos.map((producto) => (
            <motion.div
              key={producto.ID_producto}
              className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition"
              whileHover={{ scale: 1.03 }}
              onClick={() => setProductoSeleccionado(producto)}
            >
              <img
                src={producto.imagen || "https://via.placeholder.com/300"}
                alt={producto.Nombre_producto}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {producto.Nombre_producto}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {producto.Descripcion || "Sin descripción disponible."}
                </p>

                <p className="text-green-600 font-bold mt-3 text-lg">
                  ${producto.Precio?.toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* ============================== */}
      {/* MODAL DE DETALLES */}
      {/* ============================== */}
      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-4">
                {productoSeleccionado.Nombre_producto}
              </h3>

              <img
                src={
                  productoSeleccionado.imagen ||
                  "https://via.placeholder.com/300"
                }
                alt={productoSeleccionado.Nombre_producto}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <p className="text-gray-700 mb-4">
                {productoSeleccionado.Descripcion ||
                  "Sin descripción disponible."}
              </p>

              <p className="text-green-600 font-bold text-xl mb-4">
                ${productoSeleccionado.Precio?.toLocaleString()}
              </p>

              <button
                className="w-full bg-red-500 text-white py-2 rounded-lg mt-2 hover:bg-red-600"
                onClick={() => setProductoSeleccionado(null)}
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalogo;
