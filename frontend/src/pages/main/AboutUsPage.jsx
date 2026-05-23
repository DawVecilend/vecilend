import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";
import OptimizedImage from "../../components/elementos/OptimizedImage";

function AboutUsPage() {
  const stats = [
    { number: "5K+", label: "Usuarios Activos" },
    { number: "12K+", label: "Objetos en Circulación" },
    { number: "€250K", label: "Ahorros Generados" },
    { number: "98%", label: "Confianza Comunidad" },
  ];

  const values = [
    {
      icon: "public",
      title: "Sostenibilidad",
      description:
        "Reducimos el consumo innecesario dando nueva vida a los objetos que ya existen.",
    },
    {
      icon: "handshake",
      title: "Comunidad",
      description:
        "Conectamos vecinos para crear relaciones basadas en la confianza y el apoyo mutuo.",
    },
    {
      icon: "savings",
      title: "Económico",
      description:
        "Ahorra dinero alquilando lo que necesitas sin cargarte de cosas innecesarias.",
    },
    {
      icon: "lock",
      title: "Seguridad",
      description:
        "Un sistema de valoraciones, seguros y políticas claras para proteger a todos.",
    },
  ];

  const milestones = [
    {
      date: "2024",
      title: "El Comienzo",
      description: "Vecilend nace con la visión de revolucionar el consumo local.",
    },
    {
      date: "2025",
      title: "Primera Comunidad",
      description:
        "Alcanzamos 1,000 usuarios y publicamos nuestros primeros 5,000 objetos.",
    },
    {
      date: "2026",
      title: "Expansión",
      description:
        "Llegamos a 5,000 usuarios activos y expandimos nuestro sistema de pagos.",
    },
    {
      date: "Ahora",
      title: "Crecimiento Continuo",
      description:
        "Seguimos innovando para mejorar la experiencia de nuestra comunidad.",
    },
  ];

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
              Sobre Nosotros
            </span>

            <h1 className="max-w-[800px] mx-auto font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-app-text md:text-[64px]">
              Compartir es el futuro del{" "}
              <span className="italic text-vecilend-dark-primary">consumo.</span>
            </h1>

            <p className="mt-6 max-w-[600px] mx-auto font-body text-body-base leading-body text-app-text-secondary md:text-[18px]">
              Vecilend es una plataforma comunitaria que te permite alquilar y
              compartir objetos con tus vecinos. Ahorra dinero, cuida el planeta
              y construye relaciones locales significativas.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 md:py-24 px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-[24px] border border-app-border bg-white/5 backdrop-blur-md p-8 text-center hover:border-vecilend-dark-primary/50 transition-colors"
              >
                <p className="font-heading text-[48px] font-extrabold text-vecilend-dark-primary mb-2">
                  {stat.number}
                </p>
                <p className="text-app-text-secondary font-body">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden px-4 md:px-10">
        <div className="absolute inset-0 bg-gradient-to-r from-vecilend-dark-primary/5 via-transparent to-vecilend-dark-secondary/5 -z-10"></div>
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-[44px] font-extrabold mb-6 text-app-text">
                Nuestra Misión
              </h2>
              <p className="text-app-text-secondary text-lg leading-relaxed mb-6">
                En Vecilend creemos que la prosperidad no viene del consumo
                ilimitado, sino de la colaboración. Nuestra misión es
                transformar la manera en que consumimos, creando una economía
                circular donde cada objeto tiene el máximo valor posible.
              </p>
              <p className="text-app-text-secondary text-lg leading-relaxed">
                Conectamos vecinos para compartir recursos, generar ingresos
                adicionales y construir comunidades más fuertes, sostenibles e
                inclusivas. Porque lo mejor que puedes tener es lo que
                comparten tus vecinos.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-10 -top-10 h-[240px] w-[240px] rounded-full bg-vecilend-dark-primary/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 h-[240px] w-[240px] rounded-full bg-vecilend-dark-secondary/10 blur-3xl"></div>

              <div className="relative grid grid-cols-2 gap-4 items-start">
                <div className="overflow-hidden rounded-[18px] border border-app-border shadow-2xl shadow-black/30">
                  <OptimizedImage
                    src="/assets/img2-hero-section.png"
                    alt="Comunidad Vecilend"
                    className="h-[200px] md:h-[240px] w-full object-cover opacity-90"
                  />
                </div>
                <div className="overflow-hidden rounded-[18px] border border-app-border shadow-2xl shadow-black/30 mt-8">
                  <OptimizedImage
                    src="/assets/img4-hero-section.png"
                    alt="Objetos compartidos"
                    className="h-[200px] md:h-[240px] w-full object-cover opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-20 md:py-32 bg-app-bg px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-[44px] font-extrabold text-app-text mb-4">
              Nuestros Valores
            </h2>
            <p className="text-app-text-secondary text-lg max-w-2xl mx-auto">
              Los principios que guían cada decisión que tomamos en Vecilend.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="rounded-[24px] border border-app-border bg-white/5 backdrop-blur-md p-8 hover:border-vecilend-dark-primary/50 hover:bg-white/10 transition-all group"
              >
                <span className="material-symbols-outlined text-7xl text-vecilend-dark-primary mb-4 block transform group-hover:scale-110 transition-transform">
                  {value.icon}
                </span>
                <h3 className="font-heading text-xl font-bold text-app-text mb-3">
                  {value.title}
                </h3>
                <p className="text-app-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="w-full py-20 md:py-32 px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-[44px] font-extrabold text-app-text mb-4">
              Nuestro Viaje
            </h2>
            <p className="text-app-text-secondary text-lg max-w-2xl mx-auto">
              Desde una idea hasta convertirse en una comunidad vibrante.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-vecilend-dark-primary via-vecilend-dark-primary to-transparent top-0"></div>

            <div className="space-y-8 md:space-y-16">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={`relative flex gap-8 ${
                    idx % 2 === 0
                      ? "md:flex-row-reverse"
                      : "md:flex-row"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex w-1/2 justify-center">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-vecilend-dark-primary border-4 border-app-border top-1/2 z-10"></div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2">
                    <div className="rounded-[24px] border border-app-border bg-white/5 backdrop-blur-md p-8 hover:border-vecilend-dark-primary/50 transition-colors">
                      <p className="text-vecilend-dark-primary font-bold text-sm uppercase tracking-wider mb-2">
                        {milestone.date}
                      </p>
                      <h3 className="font-heading text-2xl font-bold text-app-text mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-app-text-secondary leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="w-full py-20 md:py-32 bg-app-bg px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-[44px] font-extrabold mb-8 text-app-text">
                ¿Por qué unirse a Vecilend?
              </h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Ahorra Dinero",
                    desc: "Alquila lo que necesitas por menos del 50% del precio de compra.",
                  },
                  {
                    title: "Gana Ingresos",
                    desc: "Monetiza tus objetos ociosos alquilándolos a tus vecinos.",
                  },
                  {
                    title: "Cuida el Planeta",
                    desc: "Reduce tu huella de carbono compartiendo en lugar de comprar.",
                  },
                  {
                    title: "Conoce tu Comunidad",
                    desc: "Construye relaciones significativas con tus vecinos.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-vecilend-dark-primary">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-app-text">
                        {item.title}
                      </h3>
                      <p className="text-app-text-secondary">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 -top-10 h-[240px] w-[240px] rounded-full bg-vecilend-dark-primary/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 h-[240px] w-[240px] rounded-full bg-vecilend-dark-secondary/10 blur-3xl"></div>

              <div className="relative overflow-hidden rounded-[24px] border border-app-border shadow-2xl shadow-black/30">
                <OptimizedImage
                  src="/assets/img1-hero-section.png"
                  alt="Comunidad Vecilend"
                  className="h-[500px] w-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
            <div className="relative bg-gradient-to-br from-vecilend-dark-primary/20 to-vecilend-dark-secondary/20 rounded-[3rem] p-12 md:p-16 overflow-hidden border border-vecilend-dark-primary/50">
            <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-10 hidden lg:block">
              <OptimizedImage
                className="w-full h-full object-cover grayscale"
                src="/assets/img3-hero-section.png"
                alt="Únete a Vecilend"
              />
            </div>
            <div className="relative z-10 max-w-xl">
              <h2 className="font-inter text-4xl md:text-5xl font-extrabold text-app-text leading-tight mb-6">
                Comienza tu viaje en{" "}
                <span className="text-vecilend-dark-primary">Vecilend</span>
              </h2>
              <p className="text-app-text-secondary text-lg mb-10 leading-relaxed">
                Únete a miles de vecinos que ya están ahorrando dinero,
                generando ingresos y construyendo una comunidad más fuerte.
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

      {/* Footer Info */}
      <section className="w-full py-16 border-t border-app-border px-4 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h3 className="font-bold text-lg text-app-text mb-3">Visión</h3>
              <p className="text-app-text-secondary leading-relaxed">
                Ser la plataforma de referencia para el consumo colaborativo en
                la Península Ibérica.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-app-text mb-3">Compromiso</h3>
              <p className="text-app-text-secondary leading-relaxed">
                Cada día trabajamos para crear una plataforma más segura, justa
                y sostenible.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-app-text mb-3">
                Transparencia
              </h3>
              <p className="text-app-text-secondary leading-relaxed">
                Creemos en la honestidad y la comunicación abierta con nuestra
                comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
