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
  return {
    id: category.id,
    name: category.nom,
    slug: category.slug,
    icon: category.icona,
    description: category.descripcio,
  }
}

export function mapCategories(categories) {
  if (!Array.isArray(categories)) return []
  return categories.map(mapCategory)
}