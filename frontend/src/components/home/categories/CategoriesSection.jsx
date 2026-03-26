import CategoryPill from './CategoryPill'

function CategoriesSection() {
  const categories = [
    'Viajes',
    'Electrodomésticos',
    'Contrucción',
    'Juegos de mesa',
    'Movilidad',
    'Herramientas',
    'Fitness',
    'Herramientas'
  ]

  return (
    <section className="w-full py-10 px-20">
      <div className="mx-auto flex w-full flex-col items-center">
        <h2 className="mb-8 font-heading text-h2-desktop font-bold text-white">
          Categorias
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <CategoryPill key={index} name={category} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoriesSection