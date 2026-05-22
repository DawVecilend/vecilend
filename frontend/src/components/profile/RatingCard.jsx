
/**
 * Targeta compacta del perfil amb un valor + label.
 *
 * @param {string} value      Valor mostrat (number o string)
 * @param {string} label      Etiqueta a sota
 * @param {boolean} starred   Si afegim icona estrella al costat del valor
 */
function RatingCard({ value, label, starred = false }) {
  return (
    <div className="bg-app-bg-card px-6 py-3 rounded-lg flex flex-col items-center justify-center min-w-[110px]">
      <div className="flex items-center gap-1">
        <span className="text-vecilend-dark-primary font-bold text-xl">{value ?? "-"}</span>
        {starred && value != null && (
          <span className="material-symbols-outlined icon-filled text-orange-500 text-sm">
            star
          </span>
        )}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-app-text-secondary text-center">
        {label}
      </span>
    </div>
  );
}

export default RatingCard;
