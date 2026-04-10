import React, { useState } from 'react'

function BtnOrder({ value = 'recent', onChange }) {
  const [open, setOpen] = useState(false)

  const options = [
    { label: 'Más recientes', value: 'recent' },
    { label: 'Más antiguos', value: 'oldest' },
    { label: 'Precio: menor a mayor', value: 'price_asc' },
    { label: 'Precio: mayor a menor', value: 'price_desc' },
    { label: 'Mejor valorados', value: 'rating' },
  ]

  const selectedOption =
    options.find((option) => option.value === value) || options[0]

  const handleSelect = (optionValue) => {
    if (onChange) onChange(optionValue)
    setOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex min-w-[190px] items-center justify-between gap-3 rounded-[10px] border border-vecilend-dark-border bg-vecilend-dark-card px-4 py-2 font-body text-[14px] font-medium text-vecilend-dark-text transition hover:border-vecilend-dark-primary"
      >
        <span>{selectedOption.label}</span>

        <svg
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-full overflow-hidden rounded-[12px] border border-vecilend-dark-border bg-vecilend-dark-card shadow-lg">
          {options.map((option) => {
            const isActive = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center px-4 py-3 text-left font-body text-[14px] transition ${
                  isActive
                    ? 'bg-vecilend-dark-primary-hover text-vecilend-dark-primary'
                    : 'text-vecilend-dark-text hover:bg-vecilend-dark-neutral'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BtnOrder