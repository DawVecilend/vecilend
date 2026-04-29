import { useNavigate } from 'react-router-dom'

function CategoryPill({ name, slug, icon }) {
  const navigate = useNavigate()

  function handleClick() {
    navigate(`/categorias/${slug}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group bg-[#333b39] p-6 rounded-xl text-center hover:bg-[#4fdbc8] transition-all duration-300 cursor-pointer border border-white/5">
      <div className="w-16 h-16 bg-[#1d2422] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
        <span className="material-symbols-outlined text-[#4fdbc8] group-hover:text-[#003730] text-3xl">{icon}</span>
      </div>
      <span className="font-bold text-sm text-[#e1e3e0] group-hover:text-[#003730]">{name}</span>
    </button>
  )
}

export default CategoryPill