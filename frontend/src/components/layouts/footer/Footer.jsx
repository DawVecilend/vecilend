import { Link } from "react-router-dom";
import Logo from "../../elementos/Logo";

function Footer() {
  return (
    <footer className="bg-app-bg-secondary px-6 py-10 md:h-[226px] md:px-10 md:py-0">
      <div className="mx-auto flex max-w-[1380px] flex-col items-center text-center md:h-full md:flex-row md:items-center md:justify-around md:gap-20 md:text-left xl:gap-75">
        <div className="order-1 flex flex-col items-center md:items-start">
          <h2 className="mb-4 font-heading text-h2-mobile font-semibold text-app-text md:text-h3-desktop">
            Empresa
          </h2>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:flex-col md:items-start md:justify-start md:gap-x-0 md:gap-y-0">
            <Link
              to="/about-us"
              className="font-body text-body-base text-app-text-secondary hover:text-app-primary md:mb-[9px]"
            >
              Sobre nosotros
            </Link>

            <Link
              to="/faq"
              className="font-body text-body-base text-app-text-secondary hover:text-app-primary"
            >
              Preguntas frecuentes
            </Link>
          </div>
        </div>

        <div className="order-2 my-8 h-px w-full bg-app-border md:hidden" />

        <div className="order-3 flex flex-col items-center md:items-start">
          <h2 className="mb-4 font-heading text-h2-mobile font-semibold text-app-text md:text-h3-desktop">
            Síguenos
          </h2>

          <div className="flex flex-row items-center justify-center gap-4 md:justify-start">
            <a
              href="https://www.instagram.com/vecilend.official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-app-text-secondary hover:text-app-primary transition-colors"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.05 1.8.25 2.2.41.6.22 1 .48 1.4.9.4.4.7.83.9 1.4.16.4.36 1 .4 2.2.06 1.27.08 1.65.08 4.83s-.02 3.55-.07 4.82c-.05 1.2-.25 1.8-.41 2.2-.22.6-.48 1-.9 1.4-.4.4-.83.7-1.4.9-.4.16-1 .36-2.2.4-1.27.06-1.65.08-4.83.08s-3.55-.02-4.82-.07c-1.2-.05-1.8-.25-2.2-.41-.6-.22-1-.48-1.4-.9-.4-.4-.7-.83-.9-1.4-.16-.4-.36-1-.4-2.2-.06-1.27-.08-1.65-.08-4.83s.02-3.55.07-4.82c.05-1.2.25-1.8.41-2.2.22-.6.48-1 .9-1.4.4-.4.83-.7 1.4-.9.4-.16 1-.36 2.2-.4C8.45 2.2 8.83 2.2 12 2.2zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.78.3-1.45.7-2.12 1.37C1.35 2.67.95 3.34.65 4.12.35 4.88.15 5.76.09 7.03.03 8.31.02 8.72.02 12s.01 3.69.07 4.97c.06 1.27.26 2.15.56 2.91.3.78.7 1.45 1.37 2.12.67.67 1.34 1.07 2.12 1.37.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.78-.3 1.45-.7 2.12-1.37.67-.67 1.07-1.34 1.37-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.97s-.01-3.69-.07-4.97c-.06-1.27-.26-2.15-.56-2.91-.3-.78-.7-1.45-1.37-2.12C21.33 1.35 20.66.95 19.88.65 19.12.35 18.24.15 16.97.09 15.69.03 15.28.02 12 .02V0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.4-11.84a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
              </svg>
            </a>

            <a
              href="https://www.x.com/vecilend"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (antes Twitter)"
              className="text-app-text-secondary hover:text-app-primary transition-colors"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@vecilend"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-app-text-secondary hover:text-app-primary transition-colors"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.85a8.16 8.16 0 004.77 1.52V6.93a4.85 4.85 0 01-1.84-.24z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="order-4 flex flex-col items-center pt-10 text-center md:order-2 md:pt-0">
          <Link to="/" className="flex items-center justify-center">
            <Logo className="h-[45px] w-auto object-contain" />
          </Link>

          <div className="mt-8 flex flex-col items-center gap-4 md:mt-[20px] md:gap-[32px]">
            <div className="flex flex-col items-center gap-4 md:flex-row md:flex-wrap md:justify-center md:gap-6">
              <Link
                to="/terms-and-conditions"
                className="font-body text-body-base text-app-text underline underline-offset-4 transition-colors duration-200 hover:text-app-primary"
              >
                Términos y condiciones
              </Link>

              <Link
                to="/privacy-policy"
                className="font-body text-body-base text-app-text underline underline-offset-4 transition-colors duration-200 hover:text-app-primary"
              >
                Política de privacidad
              </Link>
            </div>

            <p className="font-body text-body-base text-app-text md:text-app-text">
              © 2026 Todos los derechos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
