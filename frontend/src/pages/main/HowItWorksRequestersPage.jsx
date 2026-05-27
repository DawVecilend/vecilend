import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";
import OptimizedImage from "../../components/elementos/OptimizedImage";

function HowItWorksRequestersPage() {
  return (
    <div className="font-inter text-app-text min-h-screen antialiased">
      <section className="w-full px-4 md:px-10 pt-6">
        <div className="mx-auto max-w-7xl">
          <BtnBack />
        </div>
      </section>
      <section className="relative w-full overflow-hidden py-12 md:py-20 px-4 md:px-10">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="relative z-10">
            <span className="mb-6 inline-block rounded-full border border-app-primary/20 bg-app-primary/10 px-4 py-1.5 font-body text-caption font-bold uppercase tracking-[0.18em] text-app-primary">
              Comparte con confianza
            </span>

            <h1 className="max-w-[680px] font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-app-text md:text-[64px]">
              Alquila objetos en <br />{" "}
              <span className="italic text-app-primary">
                3 sencillos pasos.
              </span>
            </h1>

            <p className="mt-6 max-w-[600px] font-body text-body-base leading-body text-app-text-secondary md:text-[18px]">
              Evita grandes inversiones y costosos mantenimientos. Accede a
              cámaras de cine profesionales, drones de gran altitud y kits de
              iluminación de fabricantes de confianza en tu comunidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/objects"
                className="inline-flex items-center justify-center rounded-[16px] bg-app-primary px-8 py-4 font-body text-body-base font-bold text-app-bg shadow-xl shadow-app-primary/20 transition-all hover:scale-[1.02] hover:bg-app-primary-hover active:scale-95"
              >
                Comienza a explorar
              </Link>
              <Link
                to="/how-it-works/owners"
                className="bg-app-bg-card-secondary text-app-text-secondary px-10 py-4 rounded-full font-bold text-lg hover:bg-app-bg-card-secondary transition-colors"
              >
                ¿Propietario?
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative top-12 left-12 w-lg h-lg rounded-xl overflow-hidden aspect-square shadow-2xl rotate-2">
              <OptimizedImage
                className="w-full h-full object-cover"
                src="/assets/requesters-hero-photographer.jpg"
                alt="Fotógrafo profesional"
              />
            </div>
            <div className="absolute -top-12 -left-12 w-64 h-64 rounded-xl overflow-hidden shadow-xl -rotate-6 z-0 md:block hidden border border-app-border">
              <OptimizedImage
                className="w-full h-full object-cover"
                src="/assets/requesters-hero-drone.jpg"
                alt="Dron"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-app-bg-secondary px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-app-text">
              Tu flujo de alquiler
            </h2>
            <p className="text-app-text-secondary">
              Hemos simplificado la logística para que puedas disfrutar de tus
              actividades sin complicaciones.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="group bg-app-bg p-6 md:p-10 rounded-lg transition-all duration-300 border border-app-border text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-app-primary/20 flex items-center justify-center text-app-primary mb-8 group-hover:bg-app-primary group-hover:text-app-bg transition-colors mx-auto md:mx-0">
                <span className="material-symbols-outlined text-4xl">
                  category
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-app-text">
                1. Busca
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Descubre miles de artículos de personas cerca de ti. Filtra por
                categoría, precio o proximidad para encontrar exactamente lo que
                buscas.
              </p>
            </div>
            {/* Step 2 */}
            <div className="group bg-app-bg p-6 md:p-10 rounded-lg transition-all duration-300 border border-app-border text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-app-primary/20 flex items-center justify-center text-app-primary mb-8 group-hover:bg-app-primary group-hover:text-app-bg transition-colors mx-auto md:mx-0">
                <span className="material-symbols-outlined text-4xl">
                  event_available
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-app-text">
                2. Reserva
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Selecciona tus fechas, envía un mensaje al dueño con tus dudas y
                confirma la reserva mediante el sistema de pago integrado.
              </p>
            </div>
            {/* Step 3 */}
            <div className="group bg-app-bg p-6 md:p-10 rounded-lg transition-all duration-300 border border-app-border text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-app-primary/20 flex items-center justify-center text-app-primary mb-8 group-hover:bg-app-primary group-hover:text-app-bg transition-colors mx-auto md:mx-0">
                <span className="material-symbols-outlined text-4xl">
                  handshake
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-app-text">
                3. Disfruta
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Recoge el artículo, úsalo para tu proyecto o aventura y
                devuélvelo al finalizar. ¡Es así de fácil compartir y ahorrar!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Rent with Us? (Bento Style) */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-center text-app-text">
          ¿Por qué alquilar con nosotros?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large Feature */}
          <div className="md:col-span-8 bg-app-bg-card rounded-lg p-10 flex flex-col md:flex-row gap-8 items-center overflow-hidden border border-app-border">
            <div className="flex-1">
              <span className="text-app-primary font-bold tracking-widest text-xs uppercase mb-2 block">
                Reglas claras
              </span>
              <h3 className="text-3xl font-bold mb-4 text-app-text">
                Sabes qué pagas antes de reservar
              </h3>
              <p className="text-app-text-secondary mb-6">
                El acuerdo es directo entre tú y el propietario. Vecilend te
                ofrece el chat interno para coordinar, el desglose claro del
                precio antes de pagar y el sistema de reportes si surge un
                problema.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-app-text font-medium">
                  <span className="material-symbols-outlined text-app-primary">
                    check_circle
                  </span>{" "}
                  Desglose detallado del precio antes de confirmar
                </li>
                <li className="flex items-center gap-3 text-app-text font-medium">
                  <span className="material-symbols-outlined text-app-primary">
                    check_circle
                  </span>{" "}
                  Reportes revisados por nuestro equipo
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full h-full min-h-[300px] rounded-lg overflow-hidden">
              <OptimizedImage
                className="w-full h-full object-cover"
                src="/assets/requesters-car-protection.jpg"
                alt="Vehículo todoterreno disponible en alquiler"
              />
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-4 bg-app-primary text-[var(--color-app-success-on)] rounded-lg p-10 flex flex-col">
            <span className="material-symbols-outlined text-5xl mb-6">
              eco
            </span>
            <h3 className="text-2xl font-bold mb-4">Sostenibilidad</h3>
            <p className="text-[var(--color-app-success-on)]/80 mb-4">
              Alquilar en lugar de comprar reduce el desperdicio y fomenta una
              economía circular en tu comunidad local.
            </p>
            <p className="text-[var(--color-app-success-on)]/80">
              Cada objeto compartido evita la fabricación de uno nuevo: menos
              emisiones, menos residuos y un uso más eficiente de los recursos
              que ya existen en tu barrio.
            </p>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-4 bg-app-primary/20 text-app-primary rounded-lg p-10">
            <span className="material-symbols-outlined text-5xl mb-6">
              handshake
            </span>
            <h3 className="text-2xl font-bold mb-4">Confianza vecinal</h3>
            <p className="text-app-primary/80 font-medium">
              Valoraciones públicas bidireccionales y sistema de reportes para
              que la comunidad se autogestione con transparencia.
            </p>
          </div>

          {/* Small Feature 3 */}
          <div className="md:col-span-8 bg-app-bg-card-secondary border border-app-border rounded-lg p-10 flex items-center gap-8">
            <div className="hidden sm:block w-40 h-40 rounded-full overflow-hidden flex-shrink-0">
              <OptimizedImage
                className="w-full h-full object-cover"
                src="/assets/requesters-creator-support.jpg"
                alt="Soporte al creador"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-app-text">
                Soporte cercano
              </h3>
              <p className="text-app-text-secondary">
                Escríbenos a support@vecilend.com si necesitas ayuda con la
                plataforma. Para incidencias con otros usuarios u objetos, lo
                más rápido es abrir un reporte desde el perfil correspondiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-24 bg-app-bg-secondary">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl font-bold text-center mb-16 text-app-text">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Qué pasa si accidentalmente daño el objeto?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                El acuerdo es directo entre tú y el propietario, por lo que
                cualquier daño debe resolverse entre ambos. Comunícalo cuanto
                antes por el chat interno. Si no llegáis a un acuerdo, puedes
                abrir un reporte y nuestro equipo lo revisará.
              </div>
            </details>
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Cómo funcionan las recogidas y devoluciones?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                La recogida y devolución se acuerdan directamente con el
                propietario. Puedes usar la plataforma para enviar mensajes,
                fijar horarios y confirmar el punto de encuentro antes de tu
                reserva.
              </div>
            </details>
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Se requiere un depósito de seguridad?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                No. Vecilend no retiene depósitos ni fianzas. Al confirmar
                pagas el subtotal del alquiler + 5% de comisión + 5% de
                garantía de servicio, ambos cargos no reembolsables y mostrados
                claramente antes de pagar.
              </div>
            </details>
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Puedo alquilar artículos para llevarlos de viaje?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                Sí, siempre que lo acuerdes con el propietario. Comunícale el
                uso previsto y el destino antes de reservar para evitar
                malentendidos.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-24">
        <div className="max-w-7xl mx-auto bg-app-primary rounded-xl p-12 md:p-20 relative overflow-hidden text-center text-[var(--color-app-success-on)]">
          <div className="absolute inset-0 bg-gradient-to-tr from-app-primary to-app-primary opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 max-w-2xl mx-auto">
              ¿Listo para comenzar tu próxima aventura?
            </h2>
            <p className="text-xl text-[var(--color-app-success-on)]/80 mb-12 max-w-xl mx-auto">
              Únete a miles de personas que ya están ahorrando dinero y cuidando
              el planeta compartiendo en lugar de comprar.
            </p>
            <Link
              to="/objects"
              className="inline-block whitespace-nowrap bg-app-bg-card text-app-primary px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:scale-105 transition-transform active:scale-95"
            >
              Explorar ahora
            </Link>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorksRequestersPage;
