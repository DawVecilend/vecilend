import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Ubicació de fallback final quan no hi ha geolocalització ni
 * coordenades guardades a l'usuari. Plaça de Catalunya, Barcelona.
 */
export const DEFAULT_FALLBACK_LOCATION = { lat: 41.3851, lng: 2.1734 }

/**
 * Resol la ubicació de l'usuari amb cascada:
 *   1. navigator.geolocation
 *   2. user.ubicacio guardat al perfil
 *   3. DEFAULT_FALLBACK_LOCATION (Barcelona)
 *
 * 'requestLocation()' retorna una Promise que resol amb les coordenades 
 * del navegador. Si l'usuari denega, l'estat 'coords' cau al fallback però
 * la promise rebutja perquè el caller pugui distingir aquests dos casos.
 */
export function useGeolocation({
  fallbackToUser = true,
  fallbackToDefault = true,
} = {}) {
  const { user } = useAuth()
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)

  const applyFallback = useCallback(() => {
    if (fallbackToUser && user?.ubicacio) {
      setCoords(user.ubicacio)
      return
    }
    if (fallbackToDefault) setCoords(DEFAULT_FALLBACK_LOCATION)
  }, [user, fallbackToUser, fallbackToDefault])

  /**
   * Demana la ubicació al navegador. Retorna una Promise:
   *   - resolve(newCoords) si l'usuari ha donat permís.
   *   - reject(err) si denega/falla. En aquest cas, també s'aplica el fallback
   *     al state 'coords' (per centrar visualment el mapa) però el caller pot
   *     escollir què fer.
   */
  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        setStatus('unsupported')
        applyFallback()
        reject(new Error('Geolocation not supported'))
        return
      }
      setStatus('requesting')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const fresh = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setCoords(fresh)
          setStatus('granted')
          setError(null)
          resolve(fresh)
        },
        (err) => {
          setError(err)
          setStatus('denied')
          applyFallback()
          reject(err)
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
      )
    })
  }, [applyFallback])

  useEffect(() => {
    requestLocation().catch(() => { /* fallback ja aplicat */ })
  }, [])

  return { coords, status, error, requestLocation }
}