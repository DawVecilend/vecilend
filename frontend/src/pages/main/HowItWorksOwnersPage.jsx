import React, { useState } from "react";
import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";
import OptimizedImage from "../../components/elementos/OptimizedImage";

const faqItems = [
  {
    question: "¿Qué pasa si el objeto vuelve dañado?",
    answer:
      "El acuerdo es directo entre propietario y solicitante: comunícalo primero a la otra parte por el chat interno. Si no llegáis a un acuerdo, puedes abrir un reporte y nuestro equipo revisará el caso. Las valoraciones públicas también ayudan al resto de la comunidad.",
  },
  {
    question: "¿Cómo funcionan las recogidas y devoluciones?",
    answer:
      "La recogida y devolución se acuerdan directamente entre las dos partes a través del chat interno: horario, punto de encuentro y estado del objeto en la entrega.",
  },
  {
    question: "¿Vecilend retiene una fianza?",
    answer:
      "No. Al confirmar la reserva, el solicitante paga el subtotal + 5% de comisión de plataforma + 5% de garantía de servicio. Ambos cargos no son reembolsables y se muestran claramente antes de pagar.",
  },
  {
    question: "¿Puedo limitar quién alquila mi objeto?",
    answer:
      "Sí. Tienes control sobre cada solicitud entrante: puedes revisar el perfil del solicitante, sus valoraciones previas, y aceptar o rechazar la solicitud antes de que se convierta en reserva.",
  },
];

function HowItWorksOwnersPage() {
  const [openFaqs, setOpenFaqs] = useState([]);

  const toggleFaq = (index) => {
    setOpenFaqs((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

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
              Convierte objetos en{" "}
              <span className="italic text-app-primary">ingresos.</span>
            </h1>

            <p className="mt-6 max-w-[600px] font-body text-body-base leading-body text-app-text-secondary md:text-[18px]">
              Desde herramientas y material deportivo hasta electrodomésticos.
              Únete a miles de personas que comparten artículos de calidad con
              una comunidad de confianza.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/objects/create"
                className="inline-flex items-center justify-center rounded-[16px] bg-app-primary px-8 py-4 font-body text-body-base font-bold text-app-bg shadow-xl shadow-app-primary/20 transition-all hover:scale-[1.02] hover:bg-app-primary-hover active:scale-95"
              >
                Subir objeto
              </Link>
              <Link
                to="/how-it-works/requesters"
                className="bg-app-bg-card-secondary text-app-text-secondary px-10 py-4 rounded-full font-bold text-lg hover:bg-app-bg-card-secondary transition-colors"
              >
                ¿Solicitante?
              </Link>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative top-0 right-0 w-lg h-lg rounded-xl overflow-hidden shadow-2xl -rotate-3 z-0">
              <OptimizedImage
                className="w-full h-full object-cover"
                src="/assets/owners-hero-camera.jpg"
                alt="Camera gear"
              />
            </div>
            <div className="absolute top-2 right-2 w-64 h-64 rounded-xl overflow-hidden shadow-2xl rotate-6 z-10 border-8 border-white">
              <OptimizedImage
                className="w-full h-full object-cover"
                src="/assets/owners-hero-bike.jpg"
                alt="Mountain bike"
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
              El proceso de alquiler
            </h2>
            <p className="text-app-text-secondary">
              Tres pasos sencillos para empezar a monetizar tus pertenencias con
              total tranquilidad.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="group bg-app-bg p-6 md:p-10 rounded-lg transition-all duration-300 border border-app-border text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-app-primary/20 flex items-center justify-center text-app-primary mb-8 group-hover:bg-app-primary group-hover:text-app-bg transition-colors mx-auto md:mx-0">
                <span className="material-symbols-outlined">add_a_photo</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-app-text">
                Publica tu objeto
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Haz fotos, fija tu precio y publica gratis. Establece precios
                competitivos y reglas claras para atraer a los mejores
                inquilinos en tu comunidad.
              </p>
            </div>
            {/* Step 2 */}
            <div className="group bg-app-bg p-6 md:p-10 rounded-lg transition-all duration-300 border border-app-border text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-app-primary/20 flex items-center justify-center text-app-primary mb-8 group-hover:bg-app-primary group-hover:text-app-bg transition-colors mx-auto md:mx-0">
                <span className="material-symbols-outlined">fact_check</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-app-text">
                Gestiona solicitudes
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Revisa los perfiles de los arrendatarios y acepta reservas según
                tu disponibilidad. Tú tienes el control.
              </p>
            </div>
            {/* Step 3 */}
            <div className="group bg-app-bg p-6 md:p-10 rounded-lg transition-all duration-300 border border-app-border text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-app-primary/20 flex items-center justify-center text-app-primary mb-8 group-hover:bg-app-primary group-hover:text-app-bg transition-colors mx-auto md:mx-0">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-app-text">
                Recibe tus pagos
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Recibe pagos automáticos directamente en tu cuenta bancaria
                después de cada alquiler finalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Protection Section */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          <div className="w-full md:w-1/2">
            <span className="text-app-primary font-bold font-inter mb-4 block uppercase tracking-widest text-sm">
              La seguridad es lo primero
            </span>
            <h2 className="font-inter text-4xl md:text-5xl font-bold mb-8 leading-tight text-app-text">
              Protección total para cada anuncio
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-app-warning)] flex items-center justify-center text-[var(--color-app-warning-strong)]">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-app-text">
                    Sistema de reportes
                  </h4>
                  <p className="text-app-text-secondary">
                    Si surge un problema con un solicitante, puedes abrir un
                    reporte desde su perfil. Nuestro equipo revisa cada caso y
                    puede bloquear cuentas o eliminar objetos que incumplan los
                    términos.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-app-warning)] flex items-center justify-center text-[var(--color-app-warning-strong)]">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    how_to_reg
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-2 text-app-text">
                    Valoraciones públicas
                  </h4>
                  <p className="text-app-text-secondary">
                    Tras cada operación, propietario y solicitante se valoran
                    mutuamente. La reputación pública de cada usuario es visible
                    antes de aceptar una solicitud.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="bg-app-primary/5 rounded-full absolute -top-12 -right-12 w-96 h-96 blur-3xl"></div>
            <div className="relative bg-app-bg-card p-8 rounded-xl shadow-2xl border border-app-border/10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-app-primary/20 flex items-center justify-center text-app-primary">
                  <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-app-text">
                    Garantía de tranquilidad
                  </h3>
                  <p className="text-xs text-app-text-secondary">
                    Incluido en cada transacción de alquiler
                  </p>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                  <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                    check_circle
                  </span>
                  Sin comisión para el propietario
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                  <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                    check_circle
                  </span>
                  Soporte por reportes revisado por nuestro equipo
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                  <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                    check_circle
                  </span>
                  Pago integrado al confirmar la reserva
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                  <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                    check_circle
                  </span>
                  Valoraciones públicas bidireccionales
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-inter text-3xl md:text-4xl font-bold text-center mb-16 text-app-text">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Cómo gestiono el mantenimiento?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                El mantenimiento y el estado del objeto son responsabilidad del
                propietario. Recomendamos revisar el objeto entre alquileres y
                dejar constancia por chat de su estado en la entrega y en la
                devolución. Si hay un desacuerdo sobre daños, comunícalo primero
                al solicitante; si no llegáis a un acuerdo, abre un reporte y
                nuestro equipo revisará el caso.
              </div>
            </details>
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Vecilend retiene una fianza?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                No. Al confirmar la reserva, el solicitante paga el subtotal +
                5% de comisión de plataforma + 5% de garantía de servicio. Ambos
                cargos no son reembolsables y cubren el coste del servicio.
                Vecilend no retiene depósitos ni fianzas adicionales.
              </div>
            </details>
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Cuándo recibiré mi pago?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                El sistema gestiona el cobro al solicitante en el momento de
                confirmar la reserva. La liquidación al propietario depende de
                los métodos de pago integrados; consulta los términos y
                condiciones para los detalles concretos del flujo de fondos.
              </div>
            </details>
            <details className="group bg-app-bg-card rounded-xl">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                ¿Puedo rechazar una solicitud de alquiler?
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                Por supuesto. Tienes control total sobre quién alquila tu
                objeto. Puedes revisar perfiles, valoraciones y tu mismo valorar
                la opción al decidir aceptar o rechazar cualquier solicitud.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-10 lg:px-24">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-app-primary to-app-primary rounded-xl p-8 md:p-16 lg:p-24 text-center text-white relative overflow-hidden">
          {/* Elementos Decorativos */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="w-full h-full preserve-3d" viewBox="0 0 100 100">
              <circle cx="20" cy="20" fill="white" r="15" />
              <circle cx="80" cy="80" fill="white" r="25" />
            </svg>
          </div>
          <h2 className="font-inter text-4xl md:text-6xl font-extrabold mb-8 relative z-10">
            ¿Listo para empezar a ganar?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto relative z-10">
            Únete a nuestra creciente comunidad de prestamistas y haz que tu
            objeto trabaje para ti.
          </p>
          <div className="relative z-10">
            <Link
              to="/objects/create"
              className="bg-white text-app-primary px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl shadow-2xl hover:scale-105 transition-transform active:scale-95"
            >
              Publicar objeto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HowItWorksOwnersPage;
