export default function Services() {
  return (
    <section className="w-full py-45 px-6 sm:px-12 lg:px-20 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-10">
        Nuestros Servicios
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md hover:scale-115 hover:bg-[#4375b2] transition">
          <h3 className="text-xl font-semibold text-[#3dc692] mb-2">Paneles Solares</h3>
          <p className="text-gray-200 text-sm sm:text-base">Instalación de sistemas solares personalizados.</p>
        </div>
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md hover:scale-115 hover:bg-[#4375b2] transition">
          <h3 className="text-xl font-semibold text-[#3dc692] mb-2">Ahorro Energético</h3>
          <p className="text-gray-200 text-sm sm:text-base">Soluciones para reducir costos de energía.</p>
        </div>
        <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md hover:scale-115 hover:bg-[#4375b2] transition">
          <h3 className="text-xl font-semibold text-[#3dc692] mb-2">Mantenimiento</h3>
          <p className="text-gray-200 text-sm sm:text-base">Revisión y soporte técnico especializado.</p>
        </div>
         <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md hover:scale-115 hover:bg-[#4375b2] transition lg:col-span-3 lg:w-1/3 lg:mx-auto ">
          <h3 className="text-xl font-semibold text-[#3dc692] mb-2">Asesoria</h3>
          <p className="text-gray-200 text-sm sm:text-base">Brindamos todo tipo de información sobre energia renovable.</p>
        </div>
      </div>
    </section>
  );
}
