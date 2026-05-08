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
