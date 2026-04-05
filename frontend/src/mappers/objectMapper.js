function normalizeStatus(status) {
  const normalizedStatus = String(status || '').toLowerCase()

  if (
    normalizedStatus === 'reserved' ||
    normalizedStatus === 'reservado' ||
    normalizedStatus === 'reservat'
  ) {
    return 'reserved'
  }

  if (
    normalizedStatus === 'rented' ||
    normalizedStatus === 'alquilado' ||
    normalizedStatus === 'llogat'
  ) {
    return 'rented'
  }

  return 'available'
}

export function mapObjectToProduct(object) {
  return {
    id: object.id,
    image: object.image || object.imatge || '/assets/product1-image.jpg',
    category: object.category?.nom || object.categoria?.nom || 'Sin categoría',
    title: object.title || object.titol || 'Objeto',
    userName: object.user?.nom || object.owner?.nom || 'Usuario',
    userAvatar: object.user?.avatar || object.owner?.avatar || '/assets/avatar-omar.jpg',
    rating: object.rating || object.valoracio_mitjana || 0,
    pricePerDay: object.pricePerDay || object.preu_diari || 0,
    status: normalizeStatus(object.status || object.estat),
    availableAt: object.availableAt || object.available_at || object.data_fi || null,
  }
}

export function mapObjectsToProducts(objects) {
  if (!Array.isArray(objects)) return []
  return objects.map(mapObjectToProduct)
}