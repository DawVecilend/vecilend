import { Rating } from "@mui/material";
import { useState, useEffect } from "react";

/**
 * Filtre de valoració mínima del propietari.
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
    onChange?.({ minRating: newRating });
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-4">
      <div className="flex items-center justify-between">
        <span className="text-label text-vecilend-dark-text-secondary font-body">
          Valoración mínima del propietario
        </span>
        {rating > 0 && (
          <button
            type="button"
            onClick={() => {
              setRating(0);
              reportChange(0);
            }}
            className="text-caption text-vecilend-dark-primary underline"
          >
            Limpiar
          </button>
        )}
      </div>
      <Rating
        value={rating}
        onChange={(_, v) => {
          const newRating = v ?? 0;
          setRating(newRating);
          reportChange(newRating);
        }}
        precision={0.5}
        size="large"
        sx={{
          "& .MuiRating-iconFilled": { color: "#FBBF24" },
          "& .MuiRating-iconEmpty": { color: "#4B5563" },
        }}
      />
      <p className="mt-1 text-caption text-vecilend-dark-text-secondary font-body">
        {rating === 0
          ? "Sin filtro de valoración"
          : `Solo propietarios con ${rating}★ o más (excluye usuarios sin valoraciones)`}
      </p>
    </div>
  );
}

export default RatingFilter;
