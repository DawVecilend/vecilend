function CategoryPill({ name }) {
  return (
    <button className="rounded-[15px] border border-vecilend-dark-primary px-5 py-3 font-body text-label font-semibold text-vecilend-dark-primary transition hover:bg-vecilend-dark-primary hover:text-white">
      {name}
    </button>
  )
}

export default CategoryPill