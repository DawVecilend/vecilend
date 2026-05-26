/**
 * Bounding boxes que cubren el territorio español:
 *   - Península + Baleares: lng [-9.5, 4.5], lat [35.8, 44.0]
 *   - Canarias: lng [-18.5, -13.3], lat [27.5, 29.5]
 *
 * Para validación dura (ObjectLocationPicker) usamos isInSpain().
 * Para acotar visualmente Leaflet usamos SPAIN_MAX_BOUNDS,
 * que es un rectángulo único que envuelve ambos bboxes.
 */

export function isInSpain(lat, lng) {
  const inPeninsula =
    lng >= -9.5 && lng <= 4.5 && lat >= 35.8 && lat <= 44.0;
  const inCanarias =
    lng >= -18.5 && lng <= -13.3 && lat >= 27.5 && lat <= 29.5;
  return inPeninsula || inCanarias;
}

export const SPAIN_MAX_BOUNDS = [
  [27.0, -19.0],
  [44.5, 5.0],
];
