import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const productos = [
  {
    id: 1,
    nombre: "Panel Solar 300W",
    tipo: "Panel Solar Monocristalino",
    precio: "$690.000",
    marca: "EcoSun",
    fechaFabricacion: "2023-05-12",
    garantia: "10 años",
    idProveedor: "PRV-001",
    descripcion: "Ideal para hogares con consumo moderado.",
    imgSrc:
      "https://cdn.pixabay.com/photo/2016/10/29/10/16/solar-1781466_1280.jpg",
  },
  {
    id: 2,
    nombre: "Panel Solar 450W",
    tipo: "Panel Solar Policristalino",
    precio: "$890.000",
    marca: "SolarMax",
    fechaFabricacion: "2023-08-01",
    garantia: "12 años",
    idProveedor: "PRV-002",
    descripcion:
      "Mayor potencia para sistemas industriales y comerciales con alto consumo.",
    imgSrc:
      "https://cdn.pixabay.com/photo/2014/04/03/11/53/solar-panels-311598_1280.png",
  },
  {
    id: 3,
    nombre: "Panel Solar 600W",
    tipo: "Panel Solar Alta Eficiencia",
    precio: "$1.250.000",
    marca: "SunPower",
    fechaFabricacion: "2024-01-20",
    garantia: "15 años",
    idProveedor: "PRV-003",
    descripcion: "Alta eficiencia para grandes instalaciones solares.",
    imgSrc:
      "https://biosolarenergy.com.co/wp-content/uploads/2023/04/panel-60w.jpg",
  },
];

// Función para normalizar texto y eliminar tildes
const normalizeText = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Catalogo() {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter((p) =>
    normalizeText(p.nombre).includes(normalizeText(busqueda))
  );
    const breadcrumbItems = [
    { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/about" },
    { label: "Catalogo", href: "/catalogo" },
  ];

  return (

    <div className="p-8 min-h-screen">
      {/* Barra de búsqueda */}
      <div className="mb-12 flex justify-center mt-8">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 bg-white/70 backdrop-blur-sm"
        />
      </div>

      {/* Grid de productos (fondo semitransparente para slider) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="bg-white/80 border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer overflow-hidden backdrop-blur-sm"
            onClick={() => setProductoSeleccionado(producto)}
          >
            <img
              src={producto.imgSrc}
              alt={producto.nombre}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h2 className="font-bold text-xl text-gray-800 mb-2">
                {producto.nombre}
              </h2>
              <p className="text-green-600 font-semibold text-lg">
                {producto.precio}
              </p>
              <p className="text-gray-500 mt-2 text-sm">{producto.tipo}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {productoSeleccionado && (
          <motion.div
            className="fixed inset-0 pt-16 bg-black bg-opacity-60 flex justify-center items-start z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[85vh] flex flex-col overflow-hidden relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Botón cerrar */}
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 font-bold text-2xl"
                onClick={() => setProductoSeleccionado(null)}
              >
                ✕
              </button>

              {/* Contenido */}
              <div className="overflow-y-auto px-8 py-6">
                <img
                  src={productoSeleccionado.imgSrc}
                  alt={productoSeleccionado.nombre}
                  className="w-full max-h-96 object-contain rounded-xl mb-6 shadow-inner"
                />
                <h2 className="text-3xl font-bold mb-2 text-gray-800">
                  {productoSeleccionado.nombre}
                </h2>
                <p className="text-2xl text-green-600 font-bold mb-4">
                  {productoSeleccionado.precio}
                </p>
                <p className="text-gray-700 text-lg mb-6">
                  {productoSeleccionado.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-6 rounded-2xl shadow-inner text-gray-700">
                  <div>
                    <p className="font-semibold">ID:</p>
                    <p>{productoSeleccionado.id}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Tipo:</p>
                    <p>{productoSeleccionado.tipo}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Marca:</p>
                    <p>{productoSeleccionado.marca}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Fabricación:</p>
                    <p>{productoSeleccionado.fechaFabricacion}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Garantía:</p>
                    <p>{productoSeleccionado.garantia}</p>
                  </div>
                  <div>
                    <p className="font-semibold">ID Proveedor:</p>
                    <p>{productoSeleccionado.idProveedor}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
