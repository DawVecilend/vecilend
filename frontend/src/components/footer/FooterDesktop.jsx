import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'

function FooterDesktop() {
  return (
    <footer className="flex bg-vecilend-dark-bg-secondary h-[226px] items-center justify-center">
      <div className="mx-auto flex items-start justify-around gap-75">
        <div className="flex min-w-[180px] flex-col">
          <h3 className="mb-4 font-heading text-h3-desktop font-semibold text-white">
            Empresa
          </h3>

          <Link
            to="/sobre-nosotros"
            className="mb-[9px] font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary"
          >
            Sobre Nosotros
          </Link>

          <Link
            to="/faq"
            className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary"
          >
            FAQ
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center gap-[20px] text-center">
          <Link to="/" className="flex items-center justify-center">
            <img
              src={LogoDark}
              alt="Logo Vecilend"
              className="h-[45px] w-auto object-contain"
            />
          </Link>

          <div className="flex flex-col items-center gap-[32px]">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                to="/terminos-y-condiciones"
                className="font-body text-body-base text-white underline underline-offset-4 transition-colors duration-200 hover:text-vecilend-dark-primary"
              >
                Términos & Condiciones
              </Link>

              <Link
                to="/politica-de-privacidad"
                className="font-body text-body-base text-white underline underline-offset-4 transition-colors duration-200 hover:text-vecilend-dark-primary"
              >
                Políticas de Privacidad
              </Link>
            </div>

            <p className="font-body text-body-base text-vecilend-dark-text">
              © 2026 Todos los derechos reservados
            </p>
          </div>
        </div>

        <div className="flex min-w-[180px] flex-col items-start">
          <h3 className="mb-4 font-heading text-h3-desktop font-semibold text-white">
            Síguenos
          </h3>

          <a
            href="#"
            className="mb-[9px] font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary"
          >
            Instagram
          </a>

          <a
            href="#"
            className="mb-[9px] font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary"
          >
            Facebook
          </a>

          <a
            href="#"
            className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary"
          >
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}

export default FooterDesktop