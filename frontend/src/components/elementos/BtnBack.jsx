import React from 'react'
import { useNavigate } from 'react-router-dom'

function BtnBack() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 cursor-pointer">
      <img src="/assets/icons/arrow-back-icon-white.svg" alt="Icono volver" />
      <span className="text-label text-vecilend-dark-text">Volver</span>
    </button>
  )
}

export default BtnBack