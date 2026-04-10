import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

function isTouchCapable() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  return (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0) || 'ontouchstart' in window
}

function hasCoarsePointer() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(pointer: coarse)').matches
}

function detectIsMobileLike() {
  if (typeof window === 'undefined') {
    return false
  }

  return hasCoarsePointer() || isTouchCapable()
}

function canLockOrientation() {
  return typeof screen !== 'undefined' && typeof screen.orientation?.lock === 'function'
}

export function usePortraitLock() {
  const gestureAttemptedRef = useRef(false)

  const attemptPortraitLock = useCallback(async () => {
    if (!detectIsMobileLike() || !canLockOrientation()) {
      return false
    }

    try {
      await screen.orientation.lock('portrait-primary')
      return true
    } catch {
      return false
    }
  }, [])

  useLayoutEffect(() => {
    const handleViewportChange = () => {
      void attemptPortraitLock()
    }

    handleViewportChange()

    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('orientationchange', handleViewportChange)
    window.addEventListener('pageshow', handleViewportChange)
    window.visualViewport?.addEventListener('resize', handleViewportChange)

    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('orientationchange', handleViewportChange)
      window.removeEventListener('pageshow', handleViewportChange)
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
    }
  }, [attemptPortraitLock])

  useEffect(() => {
    if (!detectIsMobileLike() || gestureAttemptedRef.current) {
      return
    }

    const handleFirstGesture = () => {
      if (gestureAttemptedRef.current) {
        return
      }

      gestureAttemptedRef.current = true
      void attemptPortraitLock()
    }

    window.addEventListener('pointerdown', handleFirstGesture, true)

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture, true)
    }
  }, [attemptPortraitLock])
}
