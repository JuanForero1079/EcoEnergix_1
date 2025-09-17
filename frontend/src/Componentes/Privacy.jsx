export default function Privacy() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-r from-[#0072ff] via-[#7d5fff] to-[#00c9a7]">
      <div className="max-w-3xl bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
        <p className="mb-4">
          En EcoEnergix respetamos tu privacidad y protegemos tus datos personales. Al usar nuestra plataforma:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Tu información no será compartida con terceros sin tu consentimiento.</li>
          <li>Los datos se usan únicamente para mejorar la experiencia de usuario.</li>
          <li>Podrás solicitar la eliminación de tus datos en cualquier momento.</li>
          <li>Implementamos medidas de seguridad para proteger tu información.</li>
        </ul>
        <p className="mt-6">
          Si tienes dudas sobre cómo usamos tu información, escríbenos a nuestro correo de soporte.
        </p>
      </div>
    </div>
  );
}
