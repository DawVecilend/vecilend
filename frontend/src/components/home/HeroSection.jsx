import PrimaryButton from '../elementos/PrimaryButton'

function HeroSection() {
  return (
    <section className="w-full mt-[2rem]">
      <div className="relative mx-auto flex min-h-[420px] w-full items-center justify-center overflow-hidden rounded-[6px] border border-white/5">
        <img src="/assets/fondo-hero-section.jpg" alt="Personas intercambiando un objeto en la calle" className="absolute inset-0 h-full w-full object-cover"/>

        <div className="absolute inset-0 bg-black/45"></div>

        <div className="relative z-10 flex max-w-[780px] flex-col items-center px-6 text-center">
          <h1 className="font-heading text-h1-desktop font-bold leading-[1.15] text-vecilend-dark-text">
            Lo que necesitas, más barato que comprarlo.
          </h1>

          <p className="mt-3 max-w-[700px] font-[var(--font-body)] text-[13px] font-semibold leading-[1.35] text-white/90 md:text-[16px] md:leading-[1.45]">
            Objetos infrautilizados están a tu alrededor. Úsalos cuando los necesites, paga menos y evita llenar tu casa de cosas que apenas usarás.
          </p>

          <div className="mt-5">
            <PrimaryButton url="/objects" text="Alquilar" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection