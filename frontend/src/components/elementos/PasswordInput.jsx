import { useState } from "react";

function PasswordInput({
  className = "",
  iconClassName = "",
  leftIcon = null,
  ...props
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative group">
      {leftIcon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary group-focus-within:text-app-primary text-lg transition-colors pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input aria-label="Contraseña"
        {...props}
        type={visible ? "text" : "password"}
        className={`${leftIcon ? "pl-10 " : ""}pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className={`absolute right-3 top-1/2 -translate-y-1/2 text-app-text-secondary hover:text-app-primary ${iconClassName}`}
      >
        <span className="material-symbols-outlined text-lg">
          {visible ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}

export default PasswordInput;
