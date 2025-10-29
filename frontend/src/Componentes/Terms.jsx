export default function Terms() {
  return (
    <section className="relative min-h-screen bg-[url('/img/solar-panels.jpg')] bg-cover bg-center flex items-center justify-center px-4 sm:px-6 py-17 sm:py-10">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-4xl p-6 sm:p-8 md:p-10 text-white ">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Términos y Condiciones
        </h1>

        <p className="mb-4 text-sm sm:text-base leading-relaxed">
          Al registrarte en{" "}
          <span className="font-extrabold sm:text-xl bg-gradient-to-r from-[#5f54b3] via-[#4375b2] to-[#3dc692] bg-clip-text text-transparent">
            EcoEnergix
          </span>
          , aceptas los siguientes términos y condiciones:
        </p>

        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base leading-relaxed">
          <li>Usarás la plataforma únicamente para fines legales.</li>
          <li>No compartirás tu cuenta con terceros.</li>
          <li>
            EcoEnergix puede actualizar estos términos en cualquier momento.
          </li>
          <li>
            El incumplimiento puede resultar en la suspensión de tu cuenta.
          </li>
        </ul>

        <div className="mt-6 space-y-6 text-sm sm:text-base leading-relaxed">
          {/* 1 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              1. Alcance del servicio
            </h2>
            <p>
              EcoEnergix es una plataforma que facilita la{" "}
              <span className="font-semibold">
                compra y venta de paneles solares
              </span>{" "}
              y productos relacionados. No somos fabricantes directos salvo que
              se indique expresamente. La responsabilidad final de cada
              transacción recae en compradores y vendedores.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              2. Registro y cuentas
            </h2>
            <p>
              Para utilizar servicios específicos es necesario registrarse con
              información{" "}
              <span className="font-semibold">veraz y actualizada</span>. El
              usuario es responsable de mantener la seguridad de su cuenta y de
              no compartir credenciales. EcoEnergix puede suspender o eliminar
              cuentas por incumplimiento.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              3. Responsabilidades de los usuarios
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Garantizar veracidad de descripciones, términos y precios.
              </li>
              <li>
                Abstenerse de usar la plataforma para fraudes o actividades
                ilícitas.
              </li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              4. Pagos y transacciones
            </h2>
            <p>
              EcoEnergix no gestiona directamente los pagos salvo que se
              especifique lo contrario. Los usuarios deben asegurarse de
              utilizar métodos de pago seguros. Las tarifas aplicables, si las
              hubiera, serán notificadas previamente.
            </p>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              5. Devoluciones y garantías
            </h2>
            <p>
              Todos los productos adquiridos a través de EcoEnergix cuentan con
              una <span className="font-semibold">garantía de calidad</span>{" "}
              respaldada por los fabricantes o proveedores autorizados. La
              cobertura y duración de la garantía dependerá del producto
              adquirido y será informada al momento de la compra.
              <p className="mt-2">
                En caso de defectos de fabricación o fallas de funcionamiento,
                EcoEnergix apoyará al usuario en el proceso de reclamación de
                garantía frente al proveedor. Asimismo, se podrán gestionar{" "}
                <span className="font-semibold">devoluciones o reembolsos</span>{" "}
                conforme a la normativa vigente y las políticas de la
                plataforma.
              </p>
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              6. Limitación de responsabilidad
            </h2>
            <p>
              EcoEnergix no garantiza la disponibilidad continua del servicio ni
              se responsabiliza por pérdidas derivadas del uso de la plataforma.
              El uso es bajo responsabilidad del usuario.
            </p>
          </div>

          {/* 7 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              7. Propiedad intelectual
            </h2>
            <p>
              Todos los derechos de marca, logos, imágenes y contenido
              pertenecen a EcoEnergix o a sus respectivos propietarios. No está
              permitido el uso sin autorización expresa.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">
              8. Modificaciones
            </h2>
            <p>
              EcoEnergix podrá modificar estos términos en cualquier momento.
              Las modificaciones se publicarán en esta página y entrarán en
              vigor de inmediato.
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl mb-2">9. Contacto</h2>
            <p>
              Si tienes dudas o reclamos sobre estos Términos y Condiciones,
              puedes escribirnos a nuestro correo oficial.
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
