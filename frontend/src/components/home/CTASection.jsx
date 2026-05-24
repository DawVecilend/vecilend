import { Link } from "react-router-dom";
import OptimizedImage from "../elementos/OptimizedImage";

function CTASection() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
      <div
        className="relative rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 overflow-hidden border border-app-border"
        style={{ backgroundColor: "var(--color-app-cta-bg)" }}
      >
        <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-10 hidden lg:block">
          <OptimizedImage
            className="w-full h-full object-cover grayscale"
            src="/assets/home-cta-coworking.jpg"
            alt="Co-working space"
          />
        </div>
        <div className="relative z-10 max-w-xl md:max-w-1/2 text-center md:text-left">
          <h2 className="font-inter text-3xl md:text-6xl font-extrabold leading-tight mb-6 md:mb-8" style={{ color: "var(--color-app-cta-text)" }}>
            ¿Listo para convertir tu objeto en{" "}
            <span className="text-app-primary">ingresos?</span>
          </h2>
          <p className="text-base md:text-lg mb-8 md:mb-10 leading-relaxed" style={{ color: "var(--color-app-cta-muted)" }}>
            Únete a la comunidad de Vecilend y comienza a generar ingresos con tu objeto.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            <Link
              to="/objects/create"
              className="bg-gradient-to-br from-app-primary to-app-primary-hover text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-2xl shadow-app-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              Comienza a alquilar
            </Link>
            <Link
              to="/how-it-works/requesters"
              className="bg-app-bg-card-secondary/50 backdrop-blur-md text-app-text border border-app-border px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-base md:text-lg hover:bg-app-bg-card-secondary transition-all"
            >
              ¿Cómo funciona?
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
