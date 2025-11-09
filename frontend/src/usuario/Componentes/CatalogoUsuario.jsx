import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const productos = [
  {
    id: 1,
    nombre: "Panel Solar 300W",
    tipo: "Panel Monocristalino",
    precio: "$690.000",
    marca: "EcoSun",
    descripcion: "Ideal para hogares con consumo moderado. Alta durabilidad y eficiencia.",
    garantia: "10 años",
    imgSrc:
      "https://cdn.pixabay.com/photo/2016/10/29/10/16/solar-1781466_1280.jpg",
  },
  {
    id: 2,
    nombre: "Panel Solar 450W",
    tipo: "Panel Policristalino",
    precio: "$890.000",
    marca: "SolarMax",
    descripcion: "Mayor potencia para sistemas industriales o comerciales.",
    garantia: "12 años",
    imgSrc:
      "https://cdn.pixabay.com/photo/2014/04/03/11/53/solar-panels-311598_1280.png",
  },
  {
    id: 3,
    nombre: "Panel Solar 600W",
    tipo: "Alta Eficiencia",
    precio: "$1.250.000",
    marca: "SunPower",
    descripcion: "Excelente rendimiento para grandes instalaciones solares.",
    garantia: "15 años",
    imgSrc:
      "https://biosolarenergy.com.co/wp-content/uploads/2023/04/panel-60w.jpg",
  },
];

// Elimina tildes y pasa a minúsculas
const normalizeText = (text) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function CatalogoUsuario() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);

  const productosFiltrados = productos.filter((p) =>
    normalizeText(p.nombre).includes(normalizeText(busqueda))
  );

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-100 via-white to-green-50">
      {/* Barra superior */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-4 md:mb-0">
          Catálogo de Productos
        </h1>

        {/* Barra de búsqueda */}
        <input
          type="text"
          placeholder="🔍 Buscar panel solar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/3 p-3 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
        />
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productosFiltrados.map((producto) => (
          <motion.div
            key={producto.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-transform hover:-translate-y-1 overflow-hidden"
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={producto.imgSrc}
              alt={producto.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                {producto.nombre}
              </h2>
              <p className="text-green-600 font-bold text-xl mb-3">
                {producto.precio}
              </p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {producto.descripcion}
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
                  Agregar 🛒
                </button>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="bg-white rounded-3xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[85vh] overflow-auto relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
                onClick={() => setProductoSeleccionado(null)}
              >
                ✕
              </button>

              <img
                src={productoSeleccionado.imgSrc}
                alt={productoSeleccionado.nombre}
                className="w-full h-64 object-contain bg-gray-50 p-4 rounded-t-3xl"
              />

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  {productoSeleccionado.nombre}
                </h2>
                <p className="text-green-600 text-2xl font-bold mb-4">
                  {productoSeleccionado.precio}
                </p>
                <p className="text-gray-600 text-lg mb-6">
                  {productoSeleccionado.descripcion}
                </p>

                <div className="bg-green-50 p-5 rounded-2xl text-gray-700 grid grid-cols-2 gap-4">
                  <p>
                    <span className="font-semibold">Tipo:</span>{" "}
                    {productoSeleccionado.tipo}
                  </p>
                  <p>
                    <span className="font-semibold">Marca:</span>{" "}
                    {productoSeleccionado.marca}
                  </p>
                  <p>
                    <span className="font-semibold">Garantía:</span>{" "}
                    {productoSeleccionado.garantia}
                  </p>
                </div>

                <div className="mt-6 flex justify-end gap-4">
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
                    Agregar al carrito 🛒
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carrito pequeño (contador flotante) */}
      {carrito.length > 0 && (
        <motion.div
          className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-full shadow-lg cursor-pointer"
          whileHover={{ scale: 1.1 }}
        >
          🛍️ {carrito.length} producto{carrito.length > 1 ? "s" : ""}
        </motion.div>
      )}
    </div>
  );
}
