function normalizeStatus(status) {
  const s = String(status || '').toLowerCase()

  if (s === 'reservado' || s === 'reservat' || s === 'reserved') {
    return 'reserved'
  }

  if (s === 'alquilado' || s === 'llogat' || s === 'rented') {
    return 'rented'
  }

  return 'available'
}

function getAvailabilityLabel(status) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === 'reserved') {
    return 'Reservado'
  }

  if (normalizedStatus === 'rented') {
    return 'Alquilado'
  }

  return 'Disponible'
}

function getAvailabilityClass(status) {
  const normalizedStatus = normalizeStatus(status)

  if (normalizedStatus === 'reserved') {
    return 'text-yellow-400'
  }

  return 'text-vecilend-dark-text-secondary'
}

function ProductCard({ product }) {
  const image = product.imatge_principal || '/assets/product1-image.jpg'
  const category = product.categoria?.nom || 'Sin categoría'
  const title = product.nom || 'Producto'
  const userName = product.user?.nom || 'Usuario'
  const userAvatar = product.user?.avatar_url || '/assets/avatar-omar.jpg'
  const pricePerDay = product.preu_diari || 0
  const availabilityLabel = getAvailabilityLabel(product.estat)
  const availabilityClass = getAvailabilityClass(product.estat)

  return (
    <article className="flex h-full w-[255px] flex-col overflow-hidden rounded-[12px] border border-vecilend-dark-border bg-vecilend-dark-card">
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

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-3 min-h-[56px] overflow-hidden font-heading text-h3-desktop leading-h3 font-semibold text-vecilend-dark-text [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
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

        <div className="mt-auto">
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
      </div>
    </article>
  )
}

export default ProductCard