function normalizeStatus(status) {
  const s = String(status || '').toLowerCase()
  if (['reserved', 'reservado', 'reservat'].includes(s)) return 'reserved'
  if (['rented', 'alquilado', 'llogat'].includes(s)) return 'rented'
  return 'available'
}

export function mapObjectToProduct(object) {
  return {
    id: object.id,
    image: object.imatge_principal || '/assets/product1-image.jpg',
    category: object.categoria?.nom || 'Sense categoria',
    title: object.nom || 'Objecte',
    userName: object.user?.nom || 'Usuari',
    userAvatar: object.user?.avatar_url || '/assets/avatar-omar.jpg',
    rating: object.valoracio_mitjana ?? 0,
    pricePerDay: object.preu_diari ? Number(object.preu_diari) : 0,
    status: normalizeStatus(object.estat),
    availableAt: null,
    created_at: object.created_at || null,
    preu_diari: object.preu_diari ? Number(object.preu_diari) : 0,
    distance_m: object.distancia_metres ?? null,
  }
}

export function mapObjectsToProducts(objects) {
  if (!Array.isArray(objects)) return []
  return objects.map(mapObjectToProduct)
}