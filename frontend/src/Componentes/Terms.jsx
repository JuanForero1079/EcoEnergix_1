export default function Terms() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-r from-[#0072ff] via-[#7d5fff] to-[#00c9a7]">
      <div className="max-w-3xl bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
        <p className="mb-4">
          Al registrarte en EcoEnergix, aceptas los siguientes términos y condiciones:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Usarás la plataforma únicamente para fines legales.</li>
          <li>No compartirás tu cuenta con terceros.</li>
          <li>EcoEnergix puede actualizar estos términos en cualquier momento.</li>
          <li>El incumplimiento puede resultar en la suspensión de tu cuenta.</li>
        </ul>
        <p className="mt-6">
          Si tienes dudas, por favor contáctanos a nuestro correo oficial.
        </p>
      </div>
    </div>
  );
}
