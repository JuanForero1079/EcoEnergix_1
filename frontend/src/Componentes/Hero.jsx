export default function Hero() {
 
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          Bienvenido a <span className="bg-gradient-to-r from-[#4375b2] via-[#5f54b3] to-[#3dc692] bg-clip-text text-transparent drop-shadow-md ">EcoEnergix</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8">
          Poder natural, soluciones infinitas.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
          <a href="/services" className="w-full sm:w-auto px-6 py-3 bg-[#3dc692] text-white rounded-lg font-semibold shadow-md hover:bg-[#5f54b3] transition">
            Nuestros Servicios
          </a>
          <a href="/about" className="w-full sm:w-auto px-6 py-3 bg-[#5f54b3] text-white rounded-lg font-semibold shadow-md hover:bg-[#3dc692] transition">
            Conócenos
          </a>
        </div>
      </div>
    </section>
  );
}

