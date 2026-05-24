import React from "react";
import { Link } from "react-router-dom";
import HeaderDesktop from "../../components/layouts/header/HeaderDesktop";

function LenderPortalPage() {
  return (
    <div className="bg-app-bg-card font-inter text-app-text min-h-screen antialiased">
      {/* Cabecera Modular */}
      <HeaderDesktop />

      <section className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[819px] flex items-center px-8 md:px-24 overflow-hidden bg-app-bg-card">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-vecilend-dark-primary/10 text-vecilend-dark-primary font-bold text-sm mb-6 font-inter tracking-wide uppercase">
                Portal del Prestamista
              </span>
              <h1 className="font-inter text-5xl md:text-7xl font-extrabold text-app-text leading-[1.1] mb-8 tracking-tight">
                Convierte tu objeto en{" "}
                <span className="text-vecilend-dark-primary italic">ganancias</span>.
              </h1>
              <p className="text-xl text-app-text-secondary max-w-lg mb-10 leading-relaxed">
                Empieza a prestar en minutos. Únete a miles de propietarios que
                comparten equipamiento de alta calidad con una comunidad de
                confianza.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-vecilend-dark-primary/20 hover:scale-105 transition-transform active:scale-95">
                  Publicar objeto
                </button>
                <button className="bg-app-bg-card text-app-text px-8 py-4 rounded-full font-bold text-lg border border-app-border/15 hover:bg-app-bg-secondary transition-colors">
                  Calcular ganancias
                </button>
              </div>
            </div>
            <div className="relative">
              {/* Layout asimétrico de imágenes */}
              <div className="relative w-full aspect-square">
                <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-xl overflow-hidden shadow-2xl rotate-3 z-0">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk5gZta6rqCGvQvol41gBRdcoQ85JlOkx2IbvTgyI5LI6fnIg_R4Jr_XchUPmRvGgpC_UiRg0R6ChztjFb2GJQtuatDJgM_QbwszED3PjckkA4-OOvsEYw0E-9F3AVBorz9Wicdsbloq4stAqC6SPOcfnCTqMz7iYWOQiBLx-y_qz3Ev981MrDL7qS09atwdkBpZ1WRHK9-h2l0oz9uphVUCkCrvJCJjjpPhIO_gACBrG0r0J91EKdVdATmQvqc4wD_smMN4CW5Zpb"
                    alt="Equipo de cámara profesional"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-2/3 h-2/3 rounded-xl overflow-hidden shadow-2xl -rotate-6 z-10 border-8 border-white">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf4yR8uSGqycIXSPYEx6UuZ9eo9mlvKl-ibwCxOsHYpNKzmtDfzCEueTpxVBoe6WYSG1B1wHo9BVdZCSam23TmsQML0_SP6hYeE0p0xD7jzEIz_HZ7_fsQpc6c-M2rjf1YIzASm8Cwx84jR_lWhDdLsExk_9TWiFFVqfC9tjj-hljk4z4MpvvTc3RPKB6rkAFyyBXvD2tvDBScJjFgim1_25tfo4mZFSze_XthN9x8a0eSNaD6-Y1dVpQFWPpOm5OUxL0LGwY3CgBV"
                    alt="Bicicleta de montaña de alta gama"
                  />
                </div>
                {/* Etiqueta de confianza */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 backdrop-blur-[20px] bg-white/40 p-6 rounded-2xl shadow-xl border border-white/40 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-app-warning)] flex items-center justify-center text-[var(--color-app-warning-strong)]">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">
                      Verificado por Fluid
                    </p>
                    <p className="text-xs text-gray-800 opacity-75">
                      Solo transacciones seguras
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Process (Bento Grid) */}
        <section className="py-24 px-8 md:px-24 bg-app-bg-secondary">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-inter text-4xl font-bold mb-4 text-app-text">
                El Proceso
              </h2>
              <p className="text-app-text-secondary max-w-2xl mx-auto">
                Tres sencillos pasos para empezar a monetizar tu objeto con
                total tranquilidad.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Paso 1 */}
              <div className="bg-app-bg-card p-8 rounded-xl hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-vecilend-dark-primary/10 flex items-center justify-center text-vecilend-dark-primary mb-8">
                  <span className="material-symbols-outlined text-3xl">
                    add_a_photo
                  </span>
                </div>
                <h3 className="font-inter text-2xl font-bold mb-4 text-app-text">
                  1. Publica tu objeto
                </h3>
                <p className="text-app-text-secondary leading-relaxed mb-6">
                  Haz fotos, establece tu precio y publica gratis. Nuestra IA te
                  ayuda a establecer precios competitivos.
                </p>
                <div className="w-full h-40 bg-app-bg-secondary rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI-2vRCpmKMMZeP2FrpkMY6LmB2HSaxW3NOVVk7cl4lFyIwkJnfAXQCRgp6nQ0RxINqiZIXlfJ9BBPqYmhCiQm4PtdkH5oyPhqvobUZuoncUWODgnAENE76mq8WrhjG41lcRaNKDeDdWLQSXNQ9jFs-jznakh9G7s7vxOK_7aPieZ-xI6peYtQxZIvUmP1PHj4p_iLkuDDM2T3K-ii4yk-hwzDAU9k7or_ks_jC7gMfrK3ICIsdaggHBOLENCYKeE_850gBKVe8xTs"
                    alt="Interfaz de publicación"
                  />
                </div>
              </div>
              {/* Paso 2 */}
              <div className="bg-app-bg-card p-8 rounded-xl hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-vecilend-dark-primary/10 flex items-center justify-center text-vecilend-dark-primary mb-8">
                  <span className="material-symbols-outlined text-3xl">
                    check_circle
                  </span>
                </div>
                <h3 className="font-inter text-2xl font-bold mb-4 text-app-text">
                  2. Gestiona solicitudes
                </h3>
                <p className="text-app-text-secondary leading-relaxed mb-6">
                  Revisa los perfiles de los arrendatarios y acepta reservas a
                  tu conveniencia. Tú tienes el control.
                </p>
                <div className="w-full h-40 bg-app-bg-secondary rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoCCVCdjj8F74eGym6BtnP_yYzR6o6Hlzw_cGWIH2foCvuIGOcJW66F48L9j7wpg-798wlHPJRjcBvi35jYcVEnmlEksSCLjep35ElEKO85BAkkDu5YLqIWjjwjNuWEV0gG5mA9YB94_mEPine5DpUqOp4V5te2oQy0aRcor4jmXl74heBdqDERhHr3TXcxcQG0QdMpNlqaVxh_3Yq2OJAruKvCseTO2uhvmShsbH4TTyia7P91KfRCYT2hibxQ2FfiDuI2QP_e5Fz"
                    alt="Gestión de reservas"
                  />
                </div>
              </div>
              {/* Paso 3 */}
              <div className="bg-app-bg-card p-8 rounded-xl hover:translate-y-[-8px] transition-transform duration-300">
                <div className="w-14 h-14 rounded-full bg-vecilend-dark-primary/10 flex items-center justify-center text-vecilend-dark-primary mb-8">
                  <span className="material-symbols-outlined text-3xl">
                    payments
                  </span>
                </div>
                <h3 className="font-inter text-2xl font-bold mb-4 text-app-text">
                  3. Cobra de forma segura
                </h3>
                <p className="text-app-text-secondary leading-relaxed mb-6">
                  Recibe pagos automatizados directamente en tu cuenta bancaria
                  después de cada alquiler.
                </p>
                <div className="w-full h-40 bg-app-bg-secondary rounded-lg overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM9SmleWKoPk3PKl8q6fLRLUmCI9UO05y3O2g8v6zd0tbNnpTfTIu8IcgHrDDQ4dNt7Wg1OMaypWAQufiNq4upIjnmyd-UQB4R-UQ9CbmkANHLQrpkfsTauo-_GIICVtwKpeA1zc7-RRTDwGZA7ms0pMMQK7SWTwfsiWDUNa-nfJDI9baLtdQLHoQDReCDaz5gE4phu0xFRJcTao9ETDYaUjgm-uWplc2Cr-RKF68sMJIswX1N5YIDQymt6_UpIHwmFe9rVlAcXwQT"
                    alt="Terminal de pago"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lender Protection */}
        <section className="py-24 px-8 md:px-24 bg-app-bg-card overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="w-full md:w-1/2">
              <span className="text-vecilend-dark-primary font-bold font-inter mb-4 block uppercase tracking-widest text-sm">
                La seguridad es lo primero
              </span>
              <h2 className="font-inter text-4xl md:text-5xl font-bold mb-8 leading-tight text-app-text">
                Protección total para cada anuncio
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-app-warning)] flex items-center justify-center text-[var(--color-app-warning-strong)]">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-app-text">
                      Protección Fluid
                    </h4>
                    <p className="text-app-text-secondary">
                      Cobertura de seguro líder en la industria de hasta 10.000€
                      por artículo. Protegemos tu objeto contra daños o
                      pérdidas.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-app-warning)] flex items-center justify-center text-[var(--color-app-warning-strong)]">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      how_to_reg
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2 text-app-text">
                      Arrendatarios verificados
                    </h4>
                    <p className="text-app-text-secondary">
                      Cada arrendatario pasa por un riguroso proceso de
                      verificación de identidad y antecedentes antes de poder
                      reservar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="bg-vecilend-dark-primary/5 rounded-full absolute -top-12 -right-12 w-96 h-96 blur-3xl"></div>
              <div className="relative bg-app-bg-card p-8 rounded-xl shadow-2xl border border-app-border/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-vecilend-dark-primary/20 flex items-center justify-center text-vecilend-dark-primary">
                    <span className="material-symbols-outlined">security</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-app-text">
                      Garantía de tranquilidad
                    </h3>
                    <p className="text-xs text-app-text-secondary">
                      Incluido en cada transacción de alquiler
                    </p>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                    <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                      check_circle
                    </span>
                    0€ de franquicia para prestamistas
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                    <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                      check_circle
                    </span>
                    Equipo de soporte dedicado 24/7
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                    <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                      check_circle
                    </span>
                    Pagos seguros en depósito
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-app-text">
                    <span className="material-symbols-outlined text-[var(--color-app-warning)] text-lg">
                      check_circle
                    </span>
                    Reseñas y valoraciones de arrendatarios
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-8 md:px-24 bg-app-bg-secondary">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-inter text-4xl font-bold text-center mb-16 text-app-text">
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              <details className="group bg-app-bg-card rounded-xl">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                  ¿Cómo gestiono el mantenimiento?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                  Los prestamistas son responsables de asegurar que el objeto
                  esté en buenas condiciones de funcionamiento. Recomendamos
                  hacer una revisión rápida entre alquileres. Si se necesita
                  mantenimiento por desgaste normal, es responsabilidad del
                  propietario, mientras que los daños causados por el
                  arrendatario están cubiertos por la Protección Fluid.
                </div>
              </details>
              <details className="group bg-app-bg-card rounded-xl">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                  ¿Qué pasa con las fianzas?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                  Retenemos automáticamente una fianza del arrendatario durante
                  la duración del alquiler. Puedes elegir el importe de la
                  fianza al publicar tu artículo, o usar nuestra recomendación
                  por defecto basada en el valor del mismo.
                </div>
              </details>
              <details className="group bg-app-bg-card rounded-xl">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                  ¿Cuándo recibiré mi pago?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                  Los pagos se inician automáticamente 24 horas después de que
                  el período de alquiler concluya con éxito. Dependiendo de tu
                  banco, los fondos suelen llegar a tu cuenta en 1-3 días
                  laborables.
                </div>
              </details>
              <details className="group bg-app-bg-card rounded-xl">
                <summary className="flex justify-between items-center p-6 cursor-pointer list-none font-bold text-lg text-app-text">
                  ¿Puedo rechazar una solicitud de alquiler?
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-app-text-secondary leading-relaxed">
                  Por supuesto. Tienes control total sobre quién alquila tu
                  objeto. Puedes revisar perfiles, valoraciones y el historial
                  de alquileres anteriores antes de decidir aceptar o rechazar
                  cualquier solicitud.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-8 md:px-24 bg-app-bg-card">
          <div className="max-w-7xl mx-auto bg-gradient-to-br from-vecilend-dark-primary to-vecilend-dark-primary rounded-xl p-12 md:p-24 text-center text-white relative overflow-hidden">
            {/* Elementos Decorativos */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full preserve-3d" viewBox="0 0 100 100">
                <circle cx="20" cy="20" fill="white" r="15" />
                <circle cx="80" cy="80" fill="white" r="25" />
              </svg>
            </div>
            <h2 className="font-inter text-4xl md:text-6xl font-extrabold mb-8 relative z-10">
              ¿Listo para empezar a ganar?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto relative z-10">
              Únete a nuestra creciente comunidad de prestamistas y haz que tu
              objeto trabaje para ti.
            </p>
            <div className="relative z-10">
              <button className="bg-white text-vecilend-dark-primary px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-transform active:scale-95">
                Publicar mi objeto
              </button>
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <footer className="bg-app-bg-card w-full py-12 px-8 border-t border-app-border/50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto font-['Manrope'] text-sm leading-relaxed">
          <div>
            <div className="text-xl font-bold text-app-text mb-4">
              Kindred Share
            </div>
            <p className="text-app-text-secondary max-w-xs mb-6">
              © 2024 Kindred Share Marketplace. Construido para la comodidad
              moderna.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3 flex flex-col">
              <Link
                to="#"
                className="text-app-text-secondary hover:text-vecilend-dark-primary transition-all opacity-80 hover:opacity-100"
              >
                Términos de Servicio
              </Link>
              <Link
                to="#"
                className="text-app-text-secondary hover:text-vecilend-dark-primary transition-all opacity-80 hover:opacity-100"
              >
                Políticas de Privacidad
              </Link>
              <Link
                to="#"
                className="text-app-text-secondary hover:text-vecilend-dark-primary transition-all opacity-80 hover:opacity-100"
              >
                Cobertura de Seguro
              </Link>
            </div>
            <div className="space-y-3 flex flex-col">
              <Link
                to="#"
                className="text-app-text-secondary hover:text-vecilend-dark-primary transition-all opacity-80 hover:opacity-100"
              >
                Protección del Prestamista
              </Link>
              <Link
                to="#"
                className="text-app-text-secondary hover:text-vecilend-dark-primary transition-all opacity-80 hover:opacity-100"
              >
                Normas de la Comunidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LenderPortalPage;
