import CategoryPill from './CategoryPill'
import { Link } from 'react-router-dom'

function CategoriesSection({ categories = [] }) {
  return (

    <section className="bg-[#1d2422] py-20">
      <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
              <div>
                  <h2 className="font-inter text-3xl font-extrabold tracking-tight mb-2 text-[#e1e3e0]">Descubre nuestras categorías</h2>
                  <p className="text-[#aebdb9]">Encuentra todo lo que necesitas en una sola ubicación</p>
              </div>
              <Link className="text-[#4fdbc8] font-bold text-sm flex items-center gap-1 hover:underline" to="#">
                  Ver todas las categorías <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {/* Category Cards */}
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  icon={category.icon || 'category'}
                />
              ))}
          </div>
      </div>
  </section>
  )
}

export default CategoriesSection