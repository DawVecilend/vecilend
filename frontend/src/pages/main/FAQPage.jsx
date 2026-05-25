import { useState } from "react";
import OptimizedImage from "../../components/elementos/OptimizedImage";
import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const faqData = {
    solicitantes: [
      {
        question: "¿Qué pasa si accidentalmente daño el objeto?",
        answer:
          "El acuerdo de préstamo o alquiler es directo entre tú y el propietario, por lo que cualquier daño debe resolverse entre ambos. Te recomendamos comunicarlo cuanto antes a través del chat interno. Si no llegáis a un acuerdo, puedes abrir un reporte desde el perfil del usuario o desde la página del objeto y nuestro equipo lo revisará.",
      },
      {
        question: "¿Cómo funcionan las recogidas y devoluciones?",
        answer:
          "La recogida y devolución se acuerdan directamente con el propietario. Puedes usar el chat interno para enviar mensajes, fijar horarios y confirmar el punto de encuentro antes de tu reserva.",
      },
      {
        question: "¿Se requiere un depósito de seguridad?",
        answer:
          "No. Vecilend no retiene depósitos ni fianzas. Al confirmar una reserva pagarás el subtotal del alquiler, una comisión de plataforma del 5% y una garantía de servicio del 5%, ambas no reembolsables y mostradas claramente en el desglose del precio antes de pagar.",
      },
      {
        question: "¿Puedo alquilar artículos para llevarlos de viaje?",
        answer:
          "Sí, siempre que lo acuerdes con el propietario. Comunícale el uso previsto y el lugar al que lo llevarás antes de reservar para evitar malentendidos.",
      },
    ],
    propietarios: [
      {
        question: "¿Cómo gestiono el mantenimiento?",
        answer:
          "El mantenimiento y el estado de conservación del objeto son responsabilidad del propietario. Recomendamos revisar el objeto antes de cada alquiler y dejar constancia por chat de su estado en el momento de la entrega y de la devolución.",
      },
      {
        question: "¿Qué cobra Vecilend en cada operación?",
        answer:
          "En cada alquiler el solicitante paga el subtotal + 5% de comisión de plataforma + 5% de garantía de servicio. Estos dos cargos no son reembolsables y cubren el coste del servicio (moderación, soporte por reportes, infraestructura). No retenemos fianzas ni cobramos comisión al propietario.",
      },
      {
        question: "¿Qué hago si el solicitante devuelve el objeto en mal estado?",
        answer:
          "Comunícalo primero con el solicitante a través del chat interno e intentad llegar a un acuerdo. Si no es posible, puedes abrir un reporte indicando el motivo (fraude, comportamiento inapropiado, etc.) y nuestro equipo revisará el caso. Las valoraciones públicas que dejes también ayudan al resto de la comunidad.",
      },
    ],
    general: [
      {
        question: "¿Cómo se garantiza la confianza entre usuarios?",
        answer:
          "A través de tres mecanismos: valoraciones públicas bidireccionales (propietario y solicitante se valoran tras cada operación), un sistema de reportes revisado por nuestro equipo, y un chat interno que deja constancia de los acuerdos. Vecilend no actúa como intermediario en los acuerdos: la responsabilidad sobre el objeto y su uso recae directamente en los usuarios.",
      },
      {
        question: "¿Cuál es la comisión de Vecilend?",
        answer:
          "Un 5% de comisión de plataforma más un 5% de garantía de servicio, ambos calculados sobre el subtotal del alquiler. Se muestran detalladamente en el desglose del precio antes de confirmar la reserva. En los préstamos gratuitos no se aplica ningún cargo.",
      },
      {
        question: "¿Cómo contacto con soporte?",
        answer:
          "Puedes escribirnos a support@vecilend.com. Para incidencias con otros usuarios u objetos, lo más rápido es abrir un reporte desde el perfil correspondiente.",
      },
      {
        question: "¿Qué sucede si necesito cancelar una reserva?",
        answer:
          "Las solicitudes pueden cancelarse mientras estén pendientes. Una vez confirmadas, te recomendamos coordinarte con la otra parte por chat para acordar la cancelación.",
      },
    ],
  };

  const categories = [
    { id: "all", label: "Todas las preguntas" },
    { id: "solicitantes", label: "Para solicitantes" },
    { id: "propietarios", label: "Para propietarios" },
    { id: "general", label: "General" },
  ];

  const getDisplayQuestions = () => {
    if (activeCategory === "all") {
      return [
        ...faqData.solicitantes.map((q) => ({ ...q, category: "Solicitantes" })),
        ...faqData.propietarios.map((q) => ({ ...q, category: "Propietarios" })),
        ...faqData.general.map((q) => ({ ...q, category: "General" })),
      ];
    }
    return faqData[activeCategory].map((q) => ({
      ...q,
      category: activeCategory,
    }));
  };

  return (
    <div className="w-full overflow-x-hidden font-inter text-app-text min-h-screen antialiased">
      {/* Back Button */}
      <section className="w-full px-4 md:px-10 pt-6">
        <div className="mx-auto max-w-7xl">
          <BtnBack />
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden py-12 md:py-20 px-4 md:px-10">
        <div className="absolute left-0 top-10 h-[280px] w-[280px] rounded-full bg-app-primary/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-app-secondary/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12">
          <div className="relative z-10 text-center">
            <span className="mb-6 inline-block rounded-full border border-app-primary/20 bg-app-primary/10 px-4 py-1.5 font-body text-caption font-bold uppercase tracking-[0.18em] text-app-primary">
              Preguntas frecuentes
            </span>

            <h1 className="max-w-[800px] mx-auto font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-app-text md:text-[64px]">
              Encontramos las respuestas a tus{" "}
              <span className="italic text-app-primary">
                preguntas.
              </span>
            </h1>

            <p className="mt-6 max-w-[600px] mx-auto font-body text-body-base leading-body text-app-text-secondary md:text-[18px]">
              ¿Tienes dudas sobre cómo funcionan los alquileres o cómo publicar
              tus objetos? Aquí encontrarás respuestas a las preguntas más
              comunes.
            </p>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="w-full py-8 px-4 md:px-10 bg-app-bg">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-app-primary text-[var(--color-app-success-on)]"
                    : "bg-white/5 text-app-text hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full py-20 px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          {activeCategory !== "all" && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8 text-app-text">
                {activeCategory === "solicitantes" && "Preguntas para solicitantes"}
                {activeCategory === "propietarios" && "Preguntas para propietarios"}
                {activeCategory === "general" && "Preguntas generales"}
              </h2>
            </div>
          )}

          <div className="space-y-4">
            {getDisplayQuestions().map((item, idx) => (
              <div key={idx}>
                {activeCategory === "all" && (
                  <div className="mb-2">
                    <p className="text-sm font-bold text-app-primary uppercase tracking-wider">
                      {item.category}
                    </p>
                  </div>
                )}
                <details className="group bg-white/5 hover:bg-white/10 rounded-[16px] border border-app-border transition-colors">
                  <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                    {item.question}
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-app-text-secondary leading-relaxed border-t border-app-border/50">
                    {item.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="w-full py-20 px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-app-text">
            Más información
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Link
              to="/how-it-works/requesters"
              className="p-8 bg-white/5 hover:bg-white/10 rounded-[24px] border border-app-border transition-all group"
            >
              <span className="material-symbols-outlined text-7xl text-app-primary mb-4 block">
                shopping_bag
              </span>
              <h3 className="text-2xl font-bold text-app-text mb-3 group-hover:text-app-primary transition-colors">
                Cómo alquilar
              </h3>
              <p className="text-app-text-secondary">
                Aprende paso a paso cómo alquilar objetos en Vecilend y
                disfruta de todas las ventajas.
              </p>
            </Link>

            <Link
              to="/how-it-works/owners"
              className="p-8 bg-white/5 hover:bg-white/10 rounded-[24px] border border-app-border transition-all group"
            >
              <span className="material-symbols-outlined text-7xl text-app-primary mb-4 block">
                trending_up
              </span>
              <h3 className="text-2xl font-bold text-app-text mb-3 group-hover:text-app-primary transition-colors">
                Cómo publicar
              </h3>
              <p className="text-app-text-secondary">
                Descubre cómo publicar tus objetos y comenzar a generar
                ingresos.
              </p>
            </Link>

            <Link
              to="/about-us"
              className="p-8 bg-white/5 hover:bg-white/10 rounded-[24px] border border-app-border transition-all group"
            >
              <span className="material-symbols-outlined text-7xl text-app-primary mb-4 block">
                info
              </span>
              <h3 className="text-2xl font-bold text-app-text mb-3 group-hover:text-app-primary transition-colors">
                Sobre Vecilend
              </h3>
              <p className="text-app-text-secondary">
                Conoce nuestra misión, valores y todo lo que nos hace especiales.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative bg-gradient-to-br from-app-primary/20 to-app-secondary/20 rounded-[3rem] p-12 md:p-16 overflow-hidden border border-app-primary/50">
            <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-10 hidden lg:block">
              <OptimizedImage
                className="w-full h-full object-cover grayscale"
                src="/assets/img3-hero-section.png"
                alt="Únete a Vecilend"
              />
            </div>
            <div className="relative z-10 max-w-xl">
              <h2 className="font-inter text-4xl md:text-5xl font-extrabold text-app-text leading-tight mb-6">
                ¿Listo para comenzar?
              </h2>
              <p className="text-app-text-secondary text-lg mb-10 leading-relaxed">
                Ya sea que quieras alquilar u ofrecer tus objetos, Vecilend te
                hace la vida más fácil y asequible.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/objects"
                  className="bg-gradient-to-br from-app-primary to-app-primary text-[var(--color-app-success-on)] px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-app-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Explorar objetos
                </Link>
                <Link
                  to="/objects/create"
                  className="bg-white/10 backdrop-blur-md text-app-text border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all"
                >
                  Publicar objeto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQPage;
