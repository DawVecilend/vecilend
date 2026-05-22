import { Link } from "react-router-dom";
import BtnBack from "../../components/elementos/BtnBack";

function PrivacyPolicyPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 md:px-10 pt-6 pb-20">
      <BtnBack />

      <header className="mt-6 mb-10">
        <h1 className="font-heading text-h1-mobile md:text-h1-desktop text-app-text mb-3">
          Políticas de privacidad
        </h1>
        <p className="text-app-text-secondary text-body-base">
          Última actualización: 18 de mayo de 2026
        </p>
      </header>

      <div className="space-y-8 text-app-text font-body leading-relaxed">
        <Section title="1. Responsable del tratamiento">
          <p>
            El responsable del tratamiento de los datos personales en Vecilend
            es el equipo de la plataforma. Cualquier solicitud relacionada con
            tus datos personales puede dirigirse a través de los canales
            internos de la aplicación.
          </p>
        </Section>

        <Section title="2. Datos que recogemos">
          <ul className="list-disc pl-6 space-y-2 text-app-text-secondary">
            <li>
              <strong>Identificación:</strong> nombre, apellidos, nombre de
              usuario, email y, opcionalmente, foto de perfil y biografía.
            </li>
            <li>
              <strong>Contacto:</strong> teléfono y dirección o municipio
              (opcional).
            </li>
            <li>
              <strong>Ubicación:</strong> coordenadas aproximadas asociadas al
              municipio que indicas, para mostrar objetos cercanos.
            </li>
            <li>
              <strong>Contenidos:</strong> objetos publicados, mensajes en el
              chat, valoraciones y reportes.
            </li>
            <li>
              <strong>Datos técnicos:</strong> dirección IP, registros de
              actividad y datos de inicio de sesión.
            </li>
          </ul>
        </Section>

        <Section title="3. Finalidad del tratamiento">
          <ul className="list-disc pl-6 space-y-2 text-app-text-secondary">
            <li>
              Prestar el servicio: gestión de cuentas, publicaciones,
              solicitudes y transacciones.
            </li>
            <li>Mostrar objetos cercanos a tu ubicación.</li>
            <li>
              Comunicaciones operativas: verificación de email, recuperación de
              contraseña, avisos de solicitudes y transacciones.
            </li>
            <li>Moderación, seguridad y prevención del fraude.</li>
            <li>
              Mejora continua de la plataforma de forma agregada y anonimizada.
            </li>
          </ul>
        </Section>

        <Section title="4. Base legal">
          <p>
            Tratamos tus datos en base a la ejecución del contrato que aceptas
            al registrarte (los{" "}
            <Link
              to="/terminos-y-condiciones"
              className="text-app-primary hover:underline"
            >
              Términos y condiciones
            </Link>
            ), al cumplimiento de obligaciones legales y al interés legítimo en
            mantener la plataforma segura.
          </p>
        </Section>

        <Section title="5. Compartición de datos">
          <p>
            Algunos datos son visibles para otros usuarios de la plataforma
            (nombre, foto, biografía, objetos publicados, valoraciones recibidas
            y municipio aproximado). Los datos sensibles (email, teléfono,
            dirección exacta) no se muestran públicamente.
          </p>
          <p className="mt-2">
            Únicamente compartimos datos con terceros proveedores de
            infraestructura imprescindibles para prestar el servicio (envío de
            emails, almacenamiento de imágenes). Estos proveedores actúan bajo
            acuerdos de confidencialidad y de tratamiento de datos.
          </p>
        </Section>

        <Section title="6. Cookies y tecnologías similares">
          <p>
            Utilizamos almacenamiento local del navegador para mantener tu
            sesión iniciada, recordar tus preferencias de visualización (como el
            tema claro u oscuro) y registrar tu consentimiento de cookies. Detalles completos en la sección "Política de cookies" más abajo. No usamos cookies de
            seguimiento publicitario.
          </p>
        </Section>

        <Section title="7. Tiempo de conservación">
          <p>
            Conservamos tus datos mientras tu cuenta esté activa. Si solicitas
            la eliminación de tu cuenta, eliminamos los datos personales en un
            plazo razonable, manteniendo únicamente la información mínima
            necesaria para cumplir obligaciones legales o resolver disputas
            abiertas. Los registros de auditoría se conservan un máximo de 90
            días.
          </p>
        </Section>

        <Section title="8. Tus derechos">
          <p>
            Puedes ejercer en cualquier momento los derechos de acceso,
            rectificación, supresión, oposición, limitación del tratamiento y
            portabilidad de tus datos personales contactando con el equipo de
            Vecilend. También tienes derecho a presentar una reclamación ante la
            Agencia Española de Protección de Datos si consideras que el
            tratamiento no cumple la normativa.
          </p>
        </Section>

        <Section title="9. Seguridad">
          <p>
            Aplicamos medidas técnicas y organizativas razonables para proteger
            tus datos: contraseñas cifradas, conexiones HTTPS, control de acceso
            interno y registro de acciones administrativas.
          </p>
        </Section>

        <Section title="10. Cambios en la políticas">
          <p>
            Podemos actualizar estas políticas para reflejar cambios legales o
            mejoras del servicio. Si los cambios son significativos los
            anunciaremos en la plataforma y, cuando proceda, por correo
            electrónico.
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

export default PrivacyPolicyPage;
