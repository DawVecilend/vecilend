import { Link, useLocation } from "react-router-dom";

function NotFoundPage({
  title = "Página no encontrada",
  message = "Lo que buscas no existe o se ha movido a otro sitio.",
  backofficeMode = null,
}) {
  const location = useLocation();
  const isBackoffice = backofficeMode ?? location.pathname.startsWith("/backoffice");

  if (isBackoffice) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-app-bg">
        <div className="mx-auto max-w-md">
          <p className="font-heading text-[120px] leading-none font-extrabold text-app-primary">
            404
          </p>
          <h1 className="mt-2 font-heading text-2xl font-bold text-app-text">
            {title}
          </h1>
          <p className="mt-3 text-app-text-secondary">{message}</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link
              to="/backoffice/dashboard"
              className="rounded-full bg-app-primary px-6 py-3 text-sm font-bold text-white"
            >
              Volver al panel
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="mx-auto max-w-md">
        <p className="font-heading text-[120px] leading-none font-extrabold bg-gradient-to-br from-app-primary to-app-primary bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-2 font-heading text-h2-desktop text-app-text">
          {title}
        </h1>
        <p className="mt-3 text-body-base text-app-text-secondary">{message}</p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link
            to="/"
            className="rounded-full bg-app-primary px-6 py-3 text-body-base font-bold text-[var(--color-app-success-on)] active:scale-95"
          >
            Volver al inicio
          </Link>
          <Link
            to="/objects"
            className="rounded-full border border-app-border px-6 py-3 text-body-base text-app-text hover:border-app-primary"
          >
            Explorar objetos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
