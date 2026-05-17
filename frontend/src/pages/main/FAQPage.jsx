import { useState } from "react";
import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const faqData = {
    solicitantes: [
      {
        question: "¿Qué pasa si accidentalmente daño el objeto?",
        answer:
          "Si ocurre un daño accidental, revisa los términos del seguro incluido y ponte en contacto con el propietario. Nuestro equipo coordina la gestión para que el proceso sea claro y sin sorpresas.",
      },
      {
        question: "¿Cómo funcionan las recogidas y devoluciones?",
        answer:
          "La recogida y devolución se acuerdan directamente con el propietario. Puedes usar la plataforma para enviar mensajes, fijar horarios y confirmar el punto de encuentro antes de tu reserva.",
      },
      {
        question: "¿Se requiere un depósito de seguridad?",
        answer:
          "Algunos objetos pueden requerir un depósito según el acuerdo del propietario. Si aplica, lo verás al reservar y se mantiene bloqueado hasta la devolución en buen estado.",
      },
      {
        question: "¿Puedo alquilar artículos para llevarlos de viaje?",
        answer:
          "Sí, puedes alquilar para viajar siempre que lo acuerdes con el dueño y respetes las reglas de transporte y seguro. Asegúrate de notificar cualquier destino especial antes de reservar.",
      },
    ],
    propietarios: [
      {
        question: "¿Cómo gestiono el mantenimiento?",
        answer:
          "Los prestamistas son responsables de asegurar que el objeto esté en buenas condiciones de funcionamiento. Recomendamos hacer una revisión rápida entre alquileres. Si se necesita mantenimiento por desgaste normal, es responsabilidad del propietario, mientras que los daños causados por el arrendatario están cubiertos por la Protección Fluid.",
      },
      {
        question: "¿Qué pasa con las fianzas?",
        answer:
          "Retenemos automáticamente una fianza del arrendatario durante la duración del alquiler. Puedes elegir el importe de la fianza al publicar tu artículo, o usar nuestra recomendación por defecto basada en el valor del mismo.",
      },
      {
        question: "¿Cuándo recibiré mi pago?",
        answer:
          "Los pagos se inician automáticamente 24 horas después de que el período de alquiler concluya con éxito. Dependiendo de tu banco, los fondos suelen llegar a tu cuenta en 1-3 días laborables.",
      },
    ],
    general: [
      {
        question: "¿Es seguro usar Vecilend?",
        answer:
          "Sí, Vecilend cuenta con un sistema de verificación de identidad, valoraciones de usuarios, seguros incluidos y soporte 24/7 para garantizar la seguridad en cada transacción.",
      },
      {
        question: "¿Cuál es la comisión de Vecilend?",
        answer:
          "Tomamos una comisión pequeña en cada alquiler que se completa exitosamente. Esta comisión es transparente y se muestra en detalle antes de confirmar cualquier alquiler.",
      },
      {
        question: "¿Cómo contacto con soporte?",
        answer:
          "Puedes contactar con nuestro equipo de soporte a través del email support@vecilend.com. Disponemos de soporte 24/7 para resolver cualquier duda o problema.",
      },
      {
        question: "¿Qué sucede si necesito cancelar una reserva?",
        answer:
          "Las políticas de cancelación dependen del propietario del objeto. Pueden consultar los detalles de cancelación específicos antes de confirmar su reserva.",
      },
    ],
  };

  const categories = [
    { id: "all", label: "Todas las preguntas" },
    { id: "solicitantes", label: "Para Solicitantes" },
    { id: "propietarios", label: "Para Propietarios" },
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
        <div className="absolute left-0 top-10 h-[280px] w-[280px] rounded-full bg-vecilend-dark-primary/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-vecilend-dark-secondary/10 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12">
          <div className="relative z-10 text-center">
            <span className="mb-6 inline-block rounded-full border border-vecilend-dark-primary/20 bg-vecilend-dark-primary/10 px-4 py-1.5 font-body text-caption font-bold uppercase tracking-[0.18em] text-vecilend-dark-primary">
              Preguntas Frecuentes
            </span>

            <h1 className="max-w-[800px] mx-auto font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-app-text md:text-[64px]">
              Encontramos las respuestas a tus{" "}
              <span className="italic text-vecilend-dark-primary">
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
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat.id
                    ? "bg-vecilend-dark-primary text-[var(--color-app-success-on)]"
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
                {activeCategory === "solicitantes" && "Preguntas para Solicitantes"}
                {activeCategory === "propietarios" && "Preguntas para Propietarios"}
                {activeCategory === "general" && "Preguntas Generales"}
              </h2>
            </div>
          )}

          <div className="space-y-4">
            {getDisplayQuestions().map((item, idx) => (
              <div key={idx}>
                {activeCategory === "all" && (
                  <div className="mb-2">
                    <p className="text-sm font-bold text-vecilend-dark-primary uppercase tracking-wider">
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
              to="/how-it-works/renters"
              className="p-8 bg-white/5 hover:bg-white/10 rounded-[24px] border border-app-border transition-all group"
            >
              <span className="material-symbols-outlined text-7xl text-vecilend-dark-primary mb-4 block">
                shopping_bag
              </span>
              <h3 className="text-2xl font-bold text-app-text mb-3 group-hover:text-vecilend-dark-primary transition-colors">
                Cómo alquilar
              </h3>
              <p className="text-app-text-secondary">
                Aprende paso a paso cómo alquilar objetos en Vecilend y
                disfruta de todas las ventajas.
              </p>
            </Link>

            <Link
              to="/how-it-works/lenders"
              className="p-8 bg-white/5 hover:bg-white/10 rounded-[24px] border border-app-border transition-all group"
            >
              <span className="material-symbols-outlined text-7xl text-vecilend-dark-primary mb-4 block">
                trending_up
              </span>
              <h3 className="text-2xl font-bold text-app-text mb-3 group-hover:text-vecilend-dark-primary transition-colors">
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
              <span className="material-symbols-outlined text-7xl text-vecilend-dark-primary mb-4 block">
                info
              </span>
              <h3 className="text-2xl font-bold text-app-text mb-3 group-hover:text-vecilend-dark-primary transition-colors">
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
          <div className="relative bg-gradient-to-br from-vecilend-dark-primary/20 to-vecilend-dark-secondary/20 rounded-[3rem] p-12 md:p-16 overflow-hidden border border-vecilend-dark-primary/50">
            <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-10 hidden lg:block">
              <img
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
                  className="bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary text-[var(--color-app-success-on)] px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-vecilend-dark-primary/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Explorar Objetos
                </Link>
                <Link
                  to="/objects/create"
                  className="bg-white/10 backdrop-blur-md text-app-text border border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all"
                >
                  Publicar Objeto
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
