export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-white/10 backdrop-blur-md border-t border-white/20 shadow-inner py-6">
      <div className="max-w-6xl mx-auto text-center text-white text-sm sm:text-base">
        © {new Date().getFullYear()} EcoEnergix. Todos los derechos reservados.
      </div>
    </footer>
  );
}