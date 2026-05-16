/**
 * Format de data segons les regles del sprint 3:
 *   - Si la data és d'avui  → només l'hora en format 24h "HH:mm"
 *   - Si no                 → "DD/MM/AA HH:mm"
 *
 * @param {string|Date} iso
 * @returns {string}
 */
export function formatDateTimeSmart(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  const hour = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (sameDay) {
    return hour;
  }

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  return `${dd}/${mm}/${yy} ${hour}`;
}

/**
 * Format curt només data: "DD/MM/AA"
 */
export function formatDateShort(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  return `${dd}/${mm}/${yy}`;
}


/**
 * Formatea un rango de fechas "YYYY-MM-DD" a "10 → 12 nov 2026" en castellano.
 * El año siempre se muestra (al final si coinciden, en cada lado si difieren).
 */
export function formatDateRangeShort(start, end) {
  if (!start || !end) return "";
  try {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return `${start} → ${end}`;

    const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
    const sDay = s.getDate(), sMonth = months[s.getMonth()], sYear = s.getFullYear();
    const eDay = e.getDate(), eMonth = months[e.getMonth()], eYear = e.getFullYear();

    if (sYear !== eYear) {
      return `${sDay} ${sMonth} ${sYear} → ${eDay} ${eMonth} ${eYear}`;
    }
    if (sMonth === eMonth) {
      return `${sDay} → ${eDay} ${eMonth} ${sYear}`;
    }
    return `${sDay} ${sMonth} → ${eDay} ${eMonth} ${sYear}`;
  } catch {
    return `${start} → ${end}`;
  }
}
