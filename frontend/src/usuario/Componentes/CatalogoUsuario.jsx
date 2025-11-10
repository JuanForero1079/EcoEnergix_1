import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";

const productos = [
  {
    id: 1,
    nombre: "Panel Solar 450W Monocristalino",
    descripcion: "Alta eficiencia y durabilidad para sistemas residenciales.",
    precio: 850000,
    imagen: "https://cdn.pixabay.com/photo/2017/01/22/19/20/solar-panel-1995075_1280.jpg",
  },
  {
    id: 2,
    nombre: "Inversor Solar 5kW",
    descripcion: "Convierte energía DC a AC para uso doméstico o comercial.",
    precio: 1200000,
    imagen: "https://cdn.pixabay.com/photo/2018/02/27/22/44/inverter-3181260_1280.jpg",
  },
  {
    id: 3,
    nombre: "Batería de Litio 10kWh",
    descripcion: "Almacenamiento confiable de energía para sistemas solares.",
    precio: 5600000,
    imagen: "https://cdn.pixabay.com/photo/2020/03/06/09/10/energy-4906361_1280.jpg",
  },
  {
    id: 4,
    nombre: "Controlador de Carga MPPT 60A",
    descripcion: "Optimiza la carga de tus baterías con tecnología MPPT.",
    precio: 450000,
    imagen: "https://cdn.pixabay.com/photo/2017/12/12/20/05/electricity-3017410_1280.jpg",
  },
];

export default function CatalogoUsuario() {
  const { agregarAlCarrito } = useCarrito();
  const [busqueda, setBusqueda] = useState("");

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <h1 className="text-4xl font-semibold text-center mb-10">
        Catálogo de <span className="text-green-600">Paneles Solares</span>
      </h1>

      {/* 🔍 Buscador */}
      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      {/* 🟩 Catálogo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <motion.div
              key={producto.id}
              whileHover={{ scale: 1.05 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden group"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  {producto.nombre}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {producto.descripcion}
                </p>
                <p className="text-green-600 font-semibold mt-2">
                  ${producto.precio.toLocaleString()}
                </p>
              </div>

              {/* 🔘 Botón Comprar */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => agregarAlCarrito(producto)}
                className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
              >
                Comprar
              </motion.button>

              {/* 🟡 Mensaje flotante sin bloquear clics */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium opacity-0 group-hover:opacity-100 transition rounded-2xl pointer-events-none"
              >
                Conoce más sobre este producto
              </motion.div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No se encontraron productos que coincidan con “{busqueda}”
          </p>
        )}
      </div>
    </div>
  );
}
