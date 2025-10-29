export default function About() {
  return (
    <section
      id="about"
      className="w-full flex items-center justify-center py-17 sm:py-30 px-4"
    >
      <div className=" font-sans w-full max-w-5xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl rounded-2xl p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6">
          Conócenos
        </h2>

        <p className="text-base sm:text-lg text-white/90 text-center max-w-3xl mx-auto leading-relaxed mb-10">
          En{" "}
          <span className="font-extrabold sm:text-2xl bg-gradient-to-r from-[#5f54b3] via-[#4375b2] to-[#3dc692] bg-clip-text text-transparent">
            EcoEnergix
          </span>{" "}
          creemos que el futuro es sostenible . Ofrecemos soluciones en energía
          solar que ayudan a reducir costos, proteger el medio ambiente y
          construir un mañana más limpio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md text-center">
            <h3 className="text-2xl font-semibold text-white mb-3"> Misión</h3>
            <p className="text-white/80 text-sm sm:text-base">
              Promover la educación y sensibilización sobre los beneficios de
              las energías renovables, fomentando un cambio hacia un futuro más
              sostenible y responsable con el medio ambiente.
            </p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-md text-center">
            <h3 className="text-2xl font-semibold text-white mb-3"> Visión</h3>
            <p className="text-white/80 text-sm sm:text-base">
              Ser el sistema de información líder en la compra y venta de
              paneles solares, impulsando la adopción global de la energía solar
              como una solución sostenible, accesible y eficiente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
