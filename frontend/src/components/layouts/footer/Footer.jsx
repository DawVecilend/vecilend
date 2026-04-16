import { Link } from 'react-router-dom'
import LogoDark from '/assets/logos/LogoDark.svg'

function Footer() {
  return (
    <footer className="mt-[68px] bg-vecilend-dark-bg-secondary px-6 py-10 md:h-[226px] md:px-10 md:py-0">
      <div className="mx-auto flex max-w-[1380px] flex-col md:h-full md:flex-row md:items-center md:justify-around md:gap-20 xl:gap-75">

        <div className="order-1 flex flex-col">
          <h3 className="mb-4 font-heading text-h2-mobile font-semibold text-white md:text-h3-desktop">
            Empresa
          </h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-x-0 md:gap-y-0">
            <Link to="/sobre-nosotros" className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary md:mb-[9px]">
              Sobre Nosotros
            </Link>

            <Link to="/faq" className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary">
              FAQ
            </Link>
          </div>
        </div>

        <div className="order-2 my-8 h-px w-full bg-vecilend-dark-border md:hidden" />

        <div className="order-3 flex flex-col">
          <h3 className="mb-4 font-heading text-h2-mobile font-semibold text-white md:text-h3-desktop">
            Síguenos
          </h3>

          <div className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-x-0 md:gap-y-0">
            <a href="#" className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary md:mb-[9px]">
              Instagram
            </a>

            <a href="#" className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary md:mb-[9px]">
              Facebook
            </a>

            <a href="#" className="font-body text-body-base text-vecilend-light-text-secondary hover:text-vecilend-dark-primary">
              Twitter
            </a>
          </div>
        </div>

        <div className="order-4 flex flex-col items-center pt-10 text-center md:order-2 md:pt-0">
          <Link to="/" className="flex items-center justify-center">
            <img src={LogoDark} alt="Logo Vecilend" className="h-[45px] w-auto object-contain"/>
          </Link>

          <div className="mt-8 flex flex-col items-center gap-4 md:mt-[20px] md:gap-[32px]">
            <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-6">
              <Link to="/terminos-y-condiciones" className="font-body text-body-base text-white underline underline-offset-4 transition-colors duration-200 hover:text-vecilend-dark-primary">
                Términos & Condiciones
              </Link>

              <Link to="/politica-de-privacidad" className="font-body text-body-base text-white underline underline-offset-4 transition-colors duration-200 hover:text-vecilend-dark-primary">
                Políticas de Privacidad
              </Link>
            </div>

            <p className="font-body text-body-base text-white md:text-vecilend-dark-text">
              © 2026 Todos los derechos reservados
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer