export function mapCategory(category) {
  return {
    id: category.id,
    name: category.nom || category.name || 'Categoría',
    slug: category.slug ?? null,
    icon: category.icona || category.icon || null,
    description: category.descripcio || category.description || '',
    active: category.activa ?? category.active ?? true,
  }
}

export function mapCategories(categories) {
  if (!Array.isArray(categories)) return []
  return categories.map(mapCategory)
}