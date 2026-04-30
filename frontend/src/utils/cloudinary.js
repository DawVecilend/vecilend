/**
 * Insereix transformacions Cloudinary entre /upload/ i la versió de la URL.
 * No fa res si la URL no és de Cloudinary.
 *
 * Exemple:
 *   ENTRADA:  https://res.cloudinary.com/x/image/upload/v123/file.jpg
 *   SORTIDA:  https://res.cloudinary.com/x/image/upload/c_fill,g_auto,w_400,h_300,q_auto,f_auto/v123/file.jpg
 */
const PRESETS = {
  thumb:  'c_fill,g_auto,w_200,h_200,q_auto,f_auto',
  card:   'c_fill,g_auto,w_400,h_300,q_auto,f_auto',
  detail: 'c_fill,g_auto,w_900,h_600,q_auto,f_auto',
}

export function cldTransform(url, preset = 'card') {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('/image/upload/')) return url
  // Si ja té transformació prèvia (per exemple, `/upload/c_fill,...`), la deixem
  if (url.includes('/image/upload/c_')) return url

  const t = PRESETS[preset] || PRESETS.card
  return url.replace('/image/upload/', `/image/upload/${t}/`)
}