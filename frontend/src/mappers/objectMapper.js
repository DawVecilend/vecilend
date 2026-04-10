export function normalizeStatus(status) {
  const s = String(status || '').toLowerCase()

  if (s === 'reservado' || s === 'reservat' || s === 'reserved') return 'reserved'
  if (s === 'alquilado' || s === 'llogat' || s === 'rented') return 'rented'
  return 'available'
}

export function getStatusLabel(status) {
  const normalized = normalizeStatus(status)

  if (normalized === 'reserved') return 'Reservado'
  if (normalized === 'rented') return 'Alquilado'
  return 'Disponible'
}