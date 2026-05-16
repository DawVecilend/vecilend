import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";

function TermsPage() {
  return (
    <section className="mx-auto w-full max-w-[900px] px-4 md:px-10 pt-6 pb-20">
      <BtnBack />

      <header className="mt-6 mb-10">
        <h1 className="font-heading text-h1-mobile md:text-h1-desktop text-app-text mb-3">
          Términos y condiciones
        </h1>
        <p className="text-app-text-secondary text-body-base">
          Última actualización: 18 de mayo de 2026
        </p>
      </header>

      <div className="space-y-8 text-app-text font-body leading-relaxed">
        <Section title="1. Aceptación de los términos">
          <p>
            Al registrarte y utilizar Vecilend aceptas estos términos y
            condiciones, así como nuestras{" "}
            <Link
              to="/politica-de-privacidad"
              className="text-app-primary hover:underline"
            >
              políticas de privacidad
            </Link>
            . Si no estás de acuerdo con alguna parte, por favor no uses la
            plataforma.
          </p>
        </Section>

        <Section title="2. Descripción del servicio">
          <p>
            Vecilend es una plataforma que pone en contacto a vecinos para el
            préstamo gratuito o el alquiler temporal de objetos. Vecilend actúa
            como intermediario y no es propietaria de los objetos compartidos ni
            responsable directa de las transacciones entre usuarios.
          </p>
        </Section>

        <Section title="3. Registro y cuenta">
          <ul className="list-disc pl-6 space-y-2 text-app-text-secondary">
            <li>
              Para usar Vecilend debes ser mayor de edad y tener capacidad
              legal.
            </li>
            <li>
              Debes proporcionar información veraz, completa y actualizada.
            </li>
            <li>Eres responsable de la confidencialidad de tu contraseña.</li>
            <li>Una sola persona física puede tener una sola cuenta activa.</li>
          </ul>
        </Section>

        <Section title="4. Uso aceptable">
          <p className="mb-2">No está permitido:</p>
          <ul className="list-disc pl-6 space-y-2 text-app-text-secondary">
            <li>
              Publicar objetos peligrosos, ilegales o que vulneren derechos de
              terceros.
            </li>
            <li>
              Suplantar a otras personas o crear cuentas con datos falsos.
            </li>
            <li>
              Acosar, intimidar o tratar de forma irrespetuosa a otros usuarios.
            </li>
            <li>
              Utilizar la plataforma para fines comerciales fuera del ámbito
              previsto.
            </li>
            <li>
              Intentar acceder a información, áreas o cuentas de otros usuarios.
            </li>
          </ul>
        </Section>

        <Section title="5. Préstamos y alquileres entre usuarios">
          <p>
            Los acuerdos de préstamo o alquiler se establecen directamente entre
            los usuarios implicados. Vecilend no garantiza el estado de los
            objetos, su disponibilidad real o el cumplimiento de las condiciones
            pactadas. Recomendamos comprobar el estado del objeto al recogerlo y
            comunicar cualquier incidencia mediante el chat interno.
          </p>
        </Section>

        <Section title="6. Responsabilidad del usuario">
          <p>
            El usuario que toma prestado o alquila un objeto se compromete a
            devolverlo en el plazo y condiciones acordados. Cualquier daño o
            pérdida deberá ser resarcida directamente al propietario del objeto.
            Vecilend no se hace responsable de los daños materiales o personales
            derivados del uso de objetos prestados.
          </p>
        </Section>

        <Section title="7. Reportes y moderación">
          <p>
            Cualquier usuario puede reportar comportamientos o publicaciones que
            considere inadecuados. El equipo de Vecilend revisa los reportes y
            puede bloquear cuentas o eliminar objetos cuando se incumplen estos
            términos. Las decisiones se comunican al reportador y al usuario
            afectado mediante notificaciones internas y, en su caso, por correo
            electrónico.
          </p>
        </Section>

        <Section title="8. Modificaciones">
          <p>
            Podemos modificar estos términos en cualquier momento. Si los
            cambios son significativos avisaremos por correo electrónico o
            mediante una notificación dentro de la aplicación. El uso continuado
            de la plataforma tras los cambios implica la aceptación de los
            nuevos términos.
          </p>
        </Section>

        <Section title="9. Contacto">
          <p>
            Para cualquier consulta sobre estos términos puedes contactar con
            nosotros respondiendo a las notificaciones del equipo de Vecilend.
          </p>
        </Section>
      </div>
    </section>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="font-heading text-h2-mobile md:text-h2-desktop text-app-text mb-3">
        {title}
      </h2>
      <div className="text-app-text-secondary text-body-base">{children}</div>
    </div>
  );
}

export default TermsPage;
