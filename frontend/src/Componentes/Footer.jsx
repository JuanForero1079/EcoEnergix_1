import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-white/10 backdrop-blur-md border-t border-white/20 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-12 text-white">

        {/* Grid principal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Marca */}
          <div>
            <h3 className="text-xl font-semibold tracking-wide">
              EcoEnergix
            </h3>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Soluciones energéticas sostenibles enfocadas en eficiencia,
              innovación y responsabilidad ambiental.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Navegación
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Proyectos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Legal
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition">
                  Aviso legal
                </a>
              </li>
            </ul>
          </div>

          {/* Redes */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90">
              Síguenos
            </h4>
            <div className="mt-4 flex gap-4">

              <a
                href="#"
                className="p-3 rounded-full bg-white/10 hover:bg-green-500 transition"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="p-3 rounded-full bg-white/10 hover:bg-green-500 transition"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="p-3 rounded-full bg-white/10 hover:bg-green-500 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="#"
                className="p-3 rounded-full bg-white/10 hover:bg-green-500 transition"
                aria-label="X"
              >
                <FaXTwitter />
              </a>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/20" />

        {/* Footer inferior */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/70">
          <span>
            © {new Date().getFullYear()} EcoEnergix. Todos los derechos reservados.
          </span>
          <span>
            Diseñado con tecnologías web modernas
          </span>
        </div>

      </div>
    </footer>
  );
}
