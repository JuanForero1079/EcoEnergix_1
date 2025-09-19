export default function PrivacyPolicy() {
  return (
    <section className="relative min-h-screen bg-[url('/img/solar-panels.jpg')] bg-cover bg-center flex items-center justify-center px-4 sm:px-6 py-30 sm:py-30">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-4xl p-6 sm:p-8 md:p-10 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Política de Privacidad
        </h1>

        <p className="mb-4 text-sm sm:text-base leading-relaxed">
          En {" "} <span className="font-extrabold sm:text-xl bg-gradient-to-r from-[#5f54b3] via-[#4375b2] to-[#3dc692] bg-clip-text text-transparent"> EcoEnergix </span> 
          respetamos tu privacidad y protegemos tus datos personales. Al usar nuestra plataforma,
          aceptas las prácticas descritas en esta Política de Privacidad.
        </p>

        <div className="space-y-6 text-sm sm:text-base leading-relaxed">
          {/* 1 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">1. Datos que recopilamos</h2>
            <p>
              Recopilamos información que proporcionas al registrarte o realizar una compra,
              incluyendo nombre, correo electrónico y datos de contacto. También recolectamos
              información técnica como dirección IP, dispositivo, navegador y cookies para
              mejorar tu experiencia en la plataforma.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">2. Finalidad del uso de datos</h2>
            <p>
              Utilizamos tus datos personales para:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Procesar compras, ventas y pagos de forma segura.</li>
              <li>Personalizar y mejorar tu experiencia en la plataforma.</li>
              <li>Cumplir con obligaciones legales y fiscales.</li>
              <li>Comunicarnos contigo respecto a tu cuenta o transacciones.</li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">3. Compartición con terceros</h2>
            <p>
              No compartimos tu información personal con terceros sin tu consentimiento,
              salvo en los siguientes casos:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Proveedores de servicios de pago y logística.</li>
              <li>Soporte técnico y mantenimiento de la plataforma.</li>
              <li>Cuando lo requiera la ley o autoridades competentes.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">4. Derechos de los usuarios</h2>
            <p>
              Puedes ejercer tus derechos de <span className="font-semibold">acceso, rectificación, cancelación y oposición (ARCO)</span>, 
              así como solicitar la eliminación de tus datos en cualquier momento. 
              Para hacerlo, escríbenos a nuestro correo de soporte oficial.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">5. Cookies y tecnologías similares</h2>
            <p>
              Usamos cookies para recordar tu sesión, analizar el uso de la plataforma
              y mejorar la seguridad. Puedes desactivarlas en la configuración de tu navegador,
              aunque esto puede limitar algunas funcionalidades.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">6. Retención de datos</h2>
            <p>
              Conservamos tus datos únicamente durante el tiempo necesario para los fines
              descritos en esta política y de acuerdo con la normativa aplicable. Una vez
              cumplido dicho plazo, los eliminaremos de forma segura.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">7. Seguridad de la información</h2>
            <p>
              Implementamos medidas de seguridad técnicas, administrativas y físicas
              para proteger tu información contra accesos no autorizados, pérdidas o
              alteraciones.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">8. Modificaciones</h2>
            <p>
              Podemos actualizar esta Política de Privacidad en cualquier momento. 
              Las modificaciones se publicarán en esta página y entrarán en vigor de inmediato.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">9. Contacto</h2>
            <p>
              Si tienes dudas sobre cómo usamos tu información, contáctanos en nuestro{" "}
              <span className="font-semibold">correo de soporte oficial</span>.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm sm:text-base">
          Última actualización: Septiembre 2025
        </p>
      </div>
    </section>
  );
}

