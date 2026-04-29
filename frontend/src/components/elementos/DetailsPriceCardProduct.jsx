import React, { useState } from 'react'

function DetailsPriceCardProduct({ product, diasSelected }) {
    const [open, setOpen] = useState(true)

    const porcentaje = 0.15
    const dias = diasSelected ?? 4

    const subtotal = product.preu_diari * dias
    const gastos_servicio = parseFloat((subtotal * porcentaje).toFixed(2))
    const total = parseFloat((subtotal + gastos_servicio).toFixed(2))

    return (
        <div className='bg-vecilend-dark-card mt-2'>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex gap-2 items-center justify-between px-4 py-4 font-body text-[14px] font-medium text-vecilend-dark-text transition hover:border-vecilend-dark-primary cursor-pointer"
            >
                <svg
                    className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                <p className='text-vecilend-dark-text text-h3-desktop'>
                    Resumen del precio
                </p>
            </button>

            {open && (
                <div className="flex flex-col text-vecilend-dark-text w-max-175 h-50 px-8 pb-4">
                    <div className='flex justify-between border-b-1 pb-2 border-vecilend-dark-border'>
                        <p>Precio / día:</p>
                        <p>{product.preu_diari} €</p>
                    </div>

                    <div className='flex justify-between border-b-1 pt-2 pb-2 border-vecilend-dark-border'>
                        <p>Días Seleccionados:</p>
                        <p>{dias}</p>
                    </div>

                    <div className='flex justify-between border-b-1 pt-2 pb-2 border-vecilend-dark-border'>
                        <p>Subtotal:</p>
                        <p>{subtotal} €</p>
                    </div>

                    <div className='flex justify-between border-b-1 pt-2 pb-2 border-vecilend-dark-border'>
                        <p>Servicios Extra:</p>
                        <p>{gastos_servicio} €</p>
                    </div>

                    <div className='flex justify-between pt-2'>
                        <p>Total a pagar:</p>
                        <p>{total} €</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DetailsPriceCardProduct