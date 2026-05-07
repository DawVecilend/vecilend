import { useState, useEffect } from "react";

const OPTIONS = [
  { value: 0, label: "Sin filtro" },
  { value: 4, label: "4 estrellas o más" },
  { value: 5, label: "5 estrellas" },
];

/**
 * Filtre de valoració mínima del propietari.
 * Limitat a 4 i 5 estrelles.
 *
 * @param {Object} value             {minRating}
 * @param {Function} onChange        (newValue) => void
 */
function RatingFilter({ value = {}, onChange }) {
  const [rating, setRating] = useState(value.minRating ?? 0);

  useEffect(() => {
    setRating(value.minRating ?? 0);
  }, [value.minRating]);

  const reportChange = (newRating) => {
    setRating(newRating);
    onChange?.({ minRating: newRating });
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <span className="text-label text-app-text-secondary font-body">
        Valoración mínima del propietario
      </span>
      <div className="flex gap-2 flex-wrap">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => reportChange(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
              rating === opt.value
                ? "bg-vecilend-dark-primary text-[#003730]"
                : "bg-app-card border border-app-border text-app-text hover:border-vecilend-dark-primary"
            }`}
          >
            {opt.value > 0 && (
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            )}
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-caption text-app-text-secondary font-body italic">
        {rating === 0
          ? "No se aplicará filtro de valoración."
          : rating === 5
            ? "Solo verás objetos con propietarios de 5★."
            : `Solo verás objetos con propietarios de ${rating}★ o más.`}
      </p>
    </div>
  );
}

export default RatingFilter;
