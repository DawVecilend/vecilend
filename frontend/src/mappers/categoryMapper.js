export function mapCategory(category) {
  return {
    id: category.id,
    name: category.nom,
    slug: category.slug,
    icon: category.icona,
    description: category.descripcio,
    subcategories: Array.isArray(category.subcategories)
      ? category.subcategories.map((subcategory) => ({
          id: subcategory.id,
          name: subcategory.nom,
          slug: subcategory.slug,
        }))
      : [],
  };
}

export function mapCategories(categories) {
  if (!Array.isArray(categories)) return [];
  return categories.map(mapCategory);
}