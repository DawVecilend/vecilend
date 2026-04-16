import CategoryPill from './CategoryPill'

function CategoriesSection({ categories = [] }) {
  return (
    <section className="w-full px-20 py-10">
      <div className="mx-auto flex w-full flex-col items-center">
        <h2 className="mb-8 font-heading text-h2-desktop font-bold text-white">
          Categorías
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              name={category.name}
              slug={category.slug}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection