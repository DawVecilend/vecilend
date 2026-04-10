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