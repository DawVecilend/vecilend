import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const DEFAULT_FALLBACK_LOCATION = { lat: 41.3851, lng: 2.1734 }

export function useGeolocation({
  fallbackToUser = true,
  fallbackToDefault = true,
  autoRequest = true,
  preferUserOverBrowser = true,
} = {}) {
  const { user, loading: authLoading } = useAuth()
  const [coords, setCoords] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const userOverrideAppliedRef = useRef(false)
  const userExplicitOverrideRef = useRef(false)

  const applyFallback = useCallback(() => {
    if (fallbackToUser && user?.ubicacio) {
      setCoords(user.ubicacio)
      return
    }
    if (fallbackToDefault) setCoords(DEFAULT_FALLBACK_LOCATION)
  }, [user, fallbackToUser, fallbackToDefault])

  const requestLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        setStatus('unsupported')
        applyFallback()
        reject(new Error('Geolocation not supported'))
        return
      }
      setStatus('requesting')
      userExplicitOverrideRef.current = true
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
    if (!autoRequest) return
    if (authLoading) return
    if (userExplicitOverrideRef.current) return

    if (preferUserOverBrowser && user?.ubicacio) {
      setCoords(user.ubicacio)
      setStatus('user-profile')
      userOverrideAppliedRef.current = true
      return
    }

    if (userOverrideAppliedRef.current) return

    requestLocation().catch(() => { /* fallback ja aplicat */ })
  }, [autoRequest, authLoading, preferUserOverBrowser, user?.ubicacio?.lat, user?.ubicacio?.lng])

  return { coords, status, error, requestLocation }
}
