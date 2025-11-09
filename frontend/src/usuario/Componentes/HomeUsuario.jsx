import React from "react";

export default function HomeUsuario() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      {/* Fondo oscuro semitransparente encima del slider */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Título principal */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
          ¡Hola,{" "}
          <span className="bg-gradient-to-r from-[#3dc692] via-[#5f54b3] to-[#4375b2] bg-clip-text text-transparent">
            usuario EcoEnergix
          </span>
          !
        </h1>

        {/* Subtítulo */}
        <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-md">
          Aquí podrás gestionar tus compras, instalaciones, pagos y más, todo en
          un solo lugar. 🌞
        </p>

        {/* Botones de navegación del usuario */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6">
          <a
            href="/usuario/compras"
            className="px-6 py-3 bg-[#3dc692] text-white rounded-xl font-semibold shadow-md hover:bg-[#5f54b3] transition"
          >
            Mis Compras
          </a>
          <a
            href="/usuario/pagos"
            className="px-6 py-3 bg-[#5f54b3] text-white rounded-xl font-semibold shadow-md hover:bg-[#3dc692] transition"
          >
            Mis Pagos
          </a>
          <a
            href="/usuario/soporte"
            className="px-6 py-3 bg-[#4375b2] text-white rounded-xl font-semibold shadow-md hover:bg-[#3dc692] transition"
          >
            Soporte Técnico
          </a>
        </div>

        {/* Tarjetas de información */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-[#3dc692] mb-2">
              Energía Activa
            </h3>
            <p className="text-gray-200 text-sm">
              Consulta tu consumo energético y rendimiento de tus paneles
              solares.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-[#5f54b3] mb-2">
              Historial
            </h3>
            <p className="text-gray-200 text-sm">
              Revisa tus pedidos, pagos e instalaciones realizadas con
              EcoEnergix.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-[#4375b2] mb-2">
              Perfil
            </h3>
            <p className="text-gray-200 text-sm">
              Edita tu información personal, cambia tu contraseña y gestiona tu
              cuenta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
