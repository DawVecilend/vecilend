import { Link, useNavigate } from "react-router-dom";

function FeatureComingSoonPage() {
  const navigate = useNavigate();

  return (
    <section className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-[1380px] flex-col items-center justify-center px-4 py-12 md:px-8">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-app-border bg-app-bg-card p-10 text-center shadow-xl md:p-16">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-vecilend-dark-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-vecilend-dark-secondary/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-vecilend-dark-primary/10 text-vecilend-dark-primary">
            <span className="material-symbols-outlined text-5xl">
              construction
            </span>
          </div>

          <h1 className="mb-4 font-heading text-h1-mobile font-extrabold text-app-text md:text-h1-desktop">
            Funcionalidad en desarrollo
          </h1>

          <p className="mx-auto mb-2 max-w-md font-body text-body-base text-app-text-secondary">
            Esta funcionalidad se encuentra en fase de desarrollo y todavía no
            ha sido implementada.
          </p>

          <p className="mx-auto mb-8 max-w-md font-body text-label text-app-text-secondary">
            Estamos trabajando para que esté disponible muy pronto. Gracias por
            tu paciencia.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-app-border bg-app-bg-card px-6 py-3 font-body text-label font-bold text-app-text transition-colors hover:border-vecilend-dark-primary"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Volver atrás
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-vecilend-dark-primary px-6 py-3 font-body text-label font-bold text-[var(--color-app-success-on)] transition-colors hover:bg-vecilend-dark-primary-hover hover:text-white"
            >
              <span className="material-symbols-outlined text-base">home</span>
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureComingSoonPage;
