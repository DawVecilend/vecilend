function createSlug(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function mapCategory(category) {
  const name = category.name || category.nom || 'Categoría'

  return {
    id: category.id,
    name,
    slug: category.slug || createSlug(name),
  }
}

export function mapCategories(categories) {
  if (!Array.isArray(categories)) return []
  return categories.map(mapCategory)
}