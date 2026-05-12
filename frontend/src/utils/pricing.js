export const COMISSIO_PCT = 0.05;
export const GARANTIA_PCT = 0.05;

function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}

/**
 * Retorna el detall del preu d'una sol·licitud de lloguer.
 *
 * @param {number} preuDiari  Preu per dia de l'objecte (€).
 * @param {number} dies       Número de dies seleccionats.
 * @returns {{subtotal: number, comissio: number, garantia: number, total: number}}
 */
export function calcPriceBreakdown(preuDiari, dies) {
  const subtotal = Number(preuDiari || 0) * Number(dies || 0);
  const comissio = subtotal * COMISSIO_PCT;
  const garantia = subtotal * GARANTIA_PCT;
  const total = subtotal + comissio + garantia;

  return {
    subtotal: round2(subtotal),
    comissio: round2(comissio),
    garantia: round2(garantia),
    total: round2(total),
  };
}
