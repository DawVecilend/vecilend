import React, { useState } from "react";
import { Rating } from "@mui/material";
import { createReview } from "../../services/reviews";

function ReviewModal({
  open,
  transactionId,
  otherUserName,
  onClose,
  onSuccess,
}) {
  const [puntuacio, setPuntuacio] = useState(0);
  const [comentari, setComentari] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setError(null);
    if (puntuacio < 1 || puntuacio > 5) {
      setError("Selecciona una puntuación entre 1 y 5 estrellas.");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(transactionId, {
        puntuacio,
        comentari: comentari.trim() || null,
      });
      onSuccess?.();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "No se ha podido enviar la valoración. Inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4">
      <div className="bg-[#161d1b] border border-[#3c4947] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <h2 className="text-app-text font-heading text-h2-desktop">
          Valorar a {otherUserName}
        </h2>
        <p className="text-app-text-secondary text-body-base">
          Tu opinión ayuda al resto de vecinos. Solo se guardan números enteros
          (1–5).
        </p>

        <div className="flex items-center justify-center py-2">
          <Rating
            value={puntuacio}
            onChange={(_, v) => setPuntuacio(v ?? 0)}
            precision={1}
            size="large"
            sx={{
              "& .MuiRating-iconFilled": { color: "#f97316" },
              "& .MuiRating-iconEmpty": { color: "#f97316", opacity: 0.3 },
            }}
          />
        </div>

        <textarea
          value={comentari}
          onChange={(e) => setComentari(e.target.value)}
          placeholder="Comentario (opcional)"
          rows={4}
          maxLength={1000}
          className="w-full rounded-xl bg-vecilend-dark-neutral border border-app-border p-3 text-app-text"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2 rounded-full border border-app-border text-app-text disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || puntuacio < 1}
            className="px-5 py-2 rounded-full bg-vecilend-dark-primary text-[#003730] font-bold disabled:opacity-50"
          >
            {submitting ? "Enviando…" : "Enviar valoración"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
