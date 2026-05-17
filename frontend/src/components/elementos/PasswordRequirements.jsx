const REQUIREMENTS = [
  { id: "len", label: "Mínimo 8 caracteres", test: (v) => v.length >= 8 },
  { id: "upper", label: "Una mayúscula", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "Una minúscula", test: (v) => /[a-z]/.test(v) },
  { id: "num", label: "Un número", test: (v) => /\d/.test(v) },
  {
    id: "sym",
    label: "Un carácter especial (!@#$…)",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

/**
 * Llista de requisits de contrasenya amb check ✓/✗ en temps real.
 *
 * @param {string} password   Contrasenya actual
 */
function PasswordRequirements({ password = "" }) {
  return (
    <ul className="mt-2 space-y-1">
      {REQUIREMENTS.map((req) => {
        const ok = req.test(password);
        return (
          <li
            key={req.id}
            className={
              "flex items-center gap-2 text-xs font-body transition-colors " +
              (ok ? "text-vecilend-dark-primary" : "text-app-text-secondary")
            }
          >
            <span
              className={
                "material-symbols-outlined text-base " +
                (ok ? "text-vecilend-dark-primary" : "text-app-text-secondary opacity-60")
              }
              style={{ fontVariationSettings: ok ? "'FILL' 1" : undefined }}
            >
              {ok ? "check_circle" : "radio_button_unchecked"}
            </span>
            <span>{req.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function isPasswordValid(password) {
  return REQUIREMENTS.every((r) => r.test(password));
}

export default PasswordRequirements;
