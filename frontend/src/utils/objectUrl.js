/**
 * Construye la URL canónica de detalle de un objeto.
 *
 * Patrón: /objects/{id}/{slug}
 *
 * El backend resuelve siempre por id (es el único identificador único).
 * El slug es decorativo: aporta legibilidad cuando se comparte el enlace
 * pero no se usa para el lookup. Si el slug ha cambiado, el frontend
 * redirige al slug actual transparentemente.
 *
 * @param {Object|null|undefined} obj  Objeto con `id` y opcionalmente `slug` o `nom`
 * @param {?string} [search]           Querystring opcional (sin "?")
 * @returns {string|null}
 */
export function objectUrl(obj, search = "") {
  if (!obj?.id) return null;
  const slug = obj.slug || slugify(obj.nom);
  const base = slug ? `/objects/${obj.id}/${slug}` : `/objects/${obj.id}`;
  return search ? `${base}?${search}` : base;
}

/**
 * Slugifica un string básico — solo se usa como fallback si el backend
 * no nos da el slug. La canónica es la que viene de BD.
 */
export function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
