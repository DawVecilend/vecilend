function ProductCard({ image, category, title, userName, userAvatar, rating, pricePerDay }) {
  return (
    <article className="w-[255px] overflow-hidden rounded-[12px] border border-vecilend-dark-border bg-vecilend-dark-card">
      <div className="relative">
        <img src={image} alt={title} className="h-[194px] w-full object-cover" />

        <button className="absolute top-3 right-3 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-vecilend-dark-primary-hover">
          <img src="/assets/icons/bookmark-icon.svg" alt="Guardar producto" className="h-[18px] w-[18px]" />
        </button>

        <span className="absolute bottom-3 left-3 rounded-[8px] bg-vecilend-dark-primary-hover px-4 py-1 font-body text-label text-vecilend-dark-text">
          {category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="mb-3 font-heading text-h3-desktop leading-h3 font-semibold text-vecilend-dark-text">
          {title}
        </h3>

        <div className="mb-4 flex items-center gap-2">
          <img src={userAvatar} alt={userName} className="h-[28px] w-[28px] rounded-full object-cover" />
          <span className="font-body text-label leading-label text-vecilend-dark-text">
            {userName}
          </span>
        </div>

        <div className="mb-3 h-px w-full bg-vecilend-dark-border"></div>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-vecilend-dark-primary">★★★★☆</span>
          <span className="font-body text-label leading-label text-vecilend-dark-text-secondary">
            {rating}
          </span>
        </div>

        <p className="font-body text-body-base leading-body text-vecilend-dark-text">
          <span className="font-semibold">{pricePerDay}€</span> / día
        </p>
      </div>
    </article>
  )
}

export default ProductCard