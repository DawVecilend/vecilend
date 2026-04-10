import { useNavigate } from 'react-router-dom'

function CategoryPill({ name, slug }) {
  const navigate = useNavigate()

  function handleClick() {
    if (!slug) return
    navigate(`/categorias/${slug}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-[15px] border border-vecilend-dark-primary px-5 py-3 font-body text-label font-semibold text-vecilend-dark-primary transition hover:bg-vecilend-dark-primary hover:text-white"
    >
      {name}
    </button>
  )
}

export default CategoryPill