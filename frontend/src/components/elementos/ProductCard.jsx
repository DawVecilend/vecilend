function getAvailabilityLabel(status, availableAt = null) {
  const now = new Date()

  if (status === 'available') {
    return 'Disponible'
  }

  if (status === 'reserved') {
    return 'Reservado'
  }

  if (status === 'rented') {
    if (!availableAt) {
      return 'Alquilado'
    }

    const endDate = new Date(availableAt)
    const diffMs = endDate - now

    if (Number.isNaN(endDate.getTime()) || diffMs <= 0) {
      return 'Disponible'
    }

    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 24) {
      return `Disponible en ${diffHours} h`
    }

    if (diffDays === 1) {
      return 'Disponible mañana'
    }

    return `Disponible en ${diffDays} días`
  }

  return 'Disponible'
}

function getAvailabilityClass(status) {
  if (status === 'reserved') {
    return 'text-yellow-400'
  }

  return 'text-vecilend-dark-text-secondary'
}

function ProductCard({
  image,
  category,
  title,
  userName,
  userAvatar,
  rating,
  pricePerDay,
  status = 'available',
  availableAt = null,
}) {
  const availabilityLabel = getAvailabilityLabel(status, availableAt)
  const availabilityClass = getAvailabilityClass(status)

  return (
    <article className="w-[255px] overflow-hidden rounded-[12px] border border-vecilend-dark-border bg-vecilend-dark-card">
      <div className="relative">
        <img src={image} alt={title} className="h-[194px] w-full object-cover" />

        <button className="absolute top-3 right-3 flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-vecilend-dark-primary-hover">
          <img
            src="/assets/icons/bookmark-icon.svg"
            alt="Guardar producto"
            className="h-[18px] w-[18px]"
          />
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
          <img
            src={userAvatar}
            alt={userName}
            className="h-[28px] w-[28px] rounded-full object-cover"
          />
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

        <p className="mb-2 font-body text-body-base leading-body text-vecilend-dark-text">
          <span className="font-semibold">{pricePerDay}€</span> / día
        </p>

        <div className="mb-3 h-px w-full bg-vecilend-dark-border"></div>

        <div>
          <span className={`font-body text-label leading-label ${availabilityClass}`}>
            {availabilityLabel}
          </span>
        </div>
      </div>
    </article>
  )
}

export default ProductCard