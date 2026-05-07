import { useState } from "react";

/**
 * Input de password amb botó d'ull per mostrar/ocultar.
 * Drop-in replacement de <input type="password" ... />.
 *
 * Pasa qualsevol prop d'input HTML i el component s'encarrega del type.
 */
function PasswordInput({ className = "", iconClassName = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-app-text-secondary hover:text-vecilend-dark-primary ${iconClassName}`}
      >
        <span className="material-symbols-outlined text-lg">
          {visible ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}

export default PasswordInput;
