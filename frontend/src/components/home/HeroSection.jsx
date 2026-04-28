import { Link } from "react-router-dom"

function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-20">
      <div className="absolute left-0 top-10 h-[280px] w-[280px] rounded-full bg-vecilend-dark-primary/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-vecilend-dark-secondary/10 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="relative z-10">
          <span className="mb-6 inline-block rounded-full border border-vecilend-dark-primary/20 bg-vecilend-dark-primary/10 px-4 py-1.5 font-body text-caption font-bold uppercase tracking-[0.18em] text-vecilend-dark-primary">
            Comparte, no compres
          </span>

          <h1 className="max-w-[680px] font-heading text-[44px] font-extrabold leading-[1.08] tracking-[-0.04em] text-vecilend-dark-text md:text-[64px]">
            Alquila lo que necesitas, <span className="italic text-vecilend-dark-primary">cerca de ti.</span>
          </h1>

          <p className="mt-6 max-w-[600px] font-body text-body-base leading-body text-vecilend-dark-text-secondary md:text-[18px]">
            Encuentra herramientas, tecnología, material deportivo y objetos del día a día compartidos por vecinos de tu zona. Ahorra dinero, evita compras innecesarias y aprovecha lo que ya existe a tu alrededor.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/objects"
              className="inline-flex items-center justify-center rounded-[16px] bg-vecilend-dark-primary px-8 py-4 font-body text-body-base font-bold text-vecilend-dark-bg shadow-xl shadow-vecilend-dark-primary/20 transition-all hover:scale-[1.02] hover:bg-vecilend-dark-primary-hover active:scale-95"
            >
              Ver todos los productos
            </Link>

            <Link
              to="/upload-product"
              className="inline-flex items-center justify-center rounded-[16px] border border-vecilend-dark-border bg-white/5 px-8 py-4 font-body text-body-base font-bold text-vecilend-dark-text transition-all hover:border-vecilend-dark-primary hover:bg-vecilend-dark-primary/10 active:scale-95"
            >
              Subir producto
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 -top-10 h-[220px] w-[220px] rounded-full bg-vecilend-dark-primary/10 blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 h-[220px] w-[220px] rounded-full bg-vecilend-dark-secondary/10 blur-3xl"></div>

          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[18px] border border-vecilend-dark-border shadow-2xl shadow-black/30 rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
                <img
                  src="/assets/img1-hero-section.png"
                  alt="Vecinos compartiendo objetos"
                  className="h-[190px] w-full object-cover opacity-90"
                />
              </div>

              <div className="translate-x-4 overflow-hidden rounded-[18px] border border-vecilend-dark-border shadow-2xl shadow-black/30">
                <img
                  src="/assets/img2-hero-section.png"
                  alt="Herramientas disponibles para alquilar"
                  className="h-[260px] w-full object-cover opacity-90"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="-translate-x-4 overflow-hidden rounded-[18px] border border-vecilend-dark-border shadow-2xl shadow-black/30">
                <img
                  src="/assets/img3-hero-section.png"
                  alt="Bicicleta disponible para alquilar"
                  className="h-[260px] w-full object-cover opacity-90"
                />
              </div>

              <div className="overflow-hidden rounded-[18px] border border-vecilend-dark-border shadow-2xl shadow-black/30 rotate-[3deg] transition-transform duration-500 hover:rotate-0">
                <img
                  src="/assets/img4-hero-section.png"
                  alt="Cámara disponible para alquilar"
                  className="h-[190px] w-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection