import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

/**
 * Ubicació de fallback final quan no hi ha geolocalització ni
 * coordenades guardades a l'usuari. Plaça de Catalunya, Barcelona.
 */
export const DEFAULT_FALLBACK_LOCATION = { lat: 41.3851, lng: 2.1734 }

/**
 * Resol la ubicació amb cascada:
 *   1. navigator.geolocation
 *   2. user.ubicacio del AuthContext
 *   3. DEFAULT_FALLBACK_LOCATION (Barcelona centre)
 *
 * Estats: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'
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

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      applyFallback()
      return
    }
    setStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('granted')
        setError(null)
      },
      (err) => {
        setError(err)
        setStatus('denied')
        applyFallback()
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    )
  }, [applyFallback])

  useEffect(() => {
    requestLocation()
  }, [requestLocation])

  return { coords, status, error, requestLocation }
}