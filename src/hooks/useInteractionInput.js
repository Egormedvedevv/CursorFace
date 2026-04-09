import { useEffect, useRef, useState } from 'react'

const POINTER_CENTER = { x: 0, y: 0 }
const TILT_HORIZONTAL_RANGE = 24
const TILT_VERTICAL_RANGE = 32
const TILT_X_FACTOR = 0.34
const TILT_Y_FACTOR = 0.28
const SMOOTHING = 0.18

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getViewportCenter() {
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  }
}

function getOrientationAngle() {
  if (typeof window.screen?.orientation?.angle === 'number') {
    return window.screen.orientation.angle
  }

  if (typeof window.orientation === 'number') {
    return window.orientation
  }

  return 0
}

function mapTiltToAxes(beta, gamma, angle) {
  const normalizedAngle = ((Math.round(angle / 90) * 90) % 360 + 360) % 360

  if (normalizedAngle === 90) {
    return { x: beta, y: -gamma }
  }

  if (normalizedAngle === 180) {
    return { x: -gamma, y: -beta }
  }

  if (normalizedAngle === 270) {
    return { x: -beta, y: gamma }
  }

  return { x: gamma, y: beta }
}

function getMotionStateLabel(state) {
  switch (state) {
    case 'active':
      return {
        title: 'Tilt on',
        detail: 'Tap to disable',
      }
    case 'prompt':
      return {
        title: 'Allow tilt',
        detail: 'Required on iPhone',
      }
    case 'requesting':
      return {
        title: 'Allow motion',
        detail: 'Browser permission',
      }
    case 'pending':
      return {
        title: 'Calibrating',
        detail: 'Move your phone',
      }
    case 'denied':
      return {
        title: 'Motion blocked',
        detail: 'Touch still works',
      }
    case 'error':
      return {
        title: 'No sensor data',
        detail: 'Touch still works',
      }
    case 'unsupported':
      return {
        title: 'Tilt unavailable',
        detail: 'Touch only',
      }
    default:
      return {
        title: 'Enable tilt',
        detail: 'Use your phone',
      }
  }
}

function requiresMotionPermission() {
  return (
    typeof window.DeviceOrientationEvent !== 'undefined' &&
    typeof window.DeviceOrientationEvent.requestPermission === 'function'
  )
}

async function requestMotionPermissions() {
  const permissionRequests = []

  if (
    typeof window.DeviceMotionEvent !== 'undefined' &&
    typeof window.DeviceMotionEvent.requestPermission === 'function'
  ) {
    permissionRequests.push(window.DeviceMotionEvent.requestPermission())
  }

  if (
    typeof window.DeviceOrientationEvent !== 'undefined' &&
    typeof window.DeviceOrientationEvent.requestPermission === 'function'
  ) {
    permissionRequests.push(window.DeviceOrientationEvent.requestPermission())
  }

  if (permissionRequests.length === 0) {
    return 'granted'
  }

  const results = await Promise.all(permissionRequests)

  return results.every((result) => result === 'granted') ? 'granted' : 'denied'
}

export function useInteractionInput() {
  const [pointerPosition, setPointerPosition] = useState(POINTER_CENTER)
  const [motionPosition, setMotionPosition] = useState(null)
  const [motionState, setMotionState] = useState('off')
  const [motionEnabled, setMotionEnabled] = useState(false)
  const [isMobileLike, setIsMobileLike] = useState(false)
  const [motionSupported, setMotionSupported] = useState(false)

  const baselineRef = useRef(null)
  const hasMotionSampleRef = useRef(false)
  const motionEnabledRef = useRef(false)
  const motionTimeoutRef = useRef(null)
  const smoothedTiltRef = useRef({ x: 0, y: 0 })
  const activePointerIdRef = useRef(null)
  const autoEnableAttemptedRef = useRef(false)

  useEffect(() => {
    motionEnabledRef.current = motionEnabled
  }, [motionEnabled])

  useEffect(() => {
    const center = getViewportCenter()
    setPointerPosition(center)

    const updateCapabilities = () => {
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches
      const touchCapable = navigator.maxTouchPoints > 0
      const mobileViewport = window.innerWidth <= 1024
      const nextIsMobileLike = coarsePointer || (touchCapable && mobileViewport)
      const nextMotionSupported = Boolean(window.isSecureContext && 'DeviceOrientationEvent' in window)

      setIsMobileLike(nextIsMobileLike)
      setMotionSupported(nextMotionSupported)

      if (!nextIsMobileLike) {
        return
      }

      if (!nextMotionSupported) {
        setMotionState((currentState) => (currentState === 'active' ? currentState : 'unsupported'))
        return
      }

      if (!motionEnabledRef.current && requiresMotionPermission()) {
        setMotionState((currentState) => {
          if (currentState === 'denied' || currentState === 'error' || currentState === 'off') {
            return currentState
          }

          return 'prompt'
        })
      }
    }

    const updatePointerPosition = (event) => {
      if (!Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) {
        return
      }

      setPointerPosition({
        x: event.clientX,
        y: event.clientY,
      })
    }

    const handlePointerMove = (event) => {
      if (event.pointerType === 'mouse') {
        updatePointerPosition(event)
        return
      }

      if (activePointerIdRef.current === event.pointerId) {
        updatePointerPosition(event)
      }
    }

    const handlePointerDown = (event) => {
      if (event.pointerType === 'mouse') {
        updatePointerPosition(event)
        return
      }

      activePointerIdRef.current = event.pointerId
      updatePointerPosition(event)
    }

    const releasePointer = (event) => {
      if (activePointerIdRef.current !== event.pointerId) {
        return
      }

      activePointerIdRef.current = null

      if (!motionEnabledRef.current) {
        setPointerPosition(getViewportCenter())
      }
    }

    const handleViewportChange = () => {
      updateCapabilities()

      if (motionEnabledRef.current) {
        baselineRef.current = null
        smoothedTiltRef.current = { x: 0, y: 0 }
        setMotionPosition(getViewportCenter())
      }
    }

    updateCapabilities()

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', releasePointer)
    window.addEventListener('pointercancel', releasePointer)
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('orientationchange', handleViewportChange)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', releasePointer)
      window.removeEventListener('pointercancel', releasePointer)
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('orientationchange', handleViewportChange)
    }
  }, [])

  useEffect(() => {
    if (!motionEnabled) {
      baselineRef.current = null
      hasMotionSampleRef.current = false
      setMotionPosition(null)

      if (motionTimeoutRef.current) {
        clearTimeout(motionTimeoutRef.current)
        motionTimeoutRef.current = null
      }

      return
    }

    setMotionPosition(getViewportCenter())
    setMotionState('pending')
    hasMotionSampleRef.current = false

    const handleOrientation = (event) => {
      if (typeof event.beta !== 'number' || typeof event.gamma !== 'number') {
        return
      }

      const angle = getOrientationAngle()

      if (!baselineRef.current || baselineRef.current.angle !== angle) {
        baselineRef.current = {
          beta: event.beta,
          gamma: event.gamma,
          angle,
        }
        smoothedTiltRef.current = { x: 0, y: 0 }
        setMotionPosition(getViewportCenter())
        return
      }

      hasMotionSampleRef.current = true

      if (motionTimeoutRef.current) {
        clearTimeout(motionTimeoutRef.current)
        motionTimeoutRef.current = null
      }

      const relativeTilt = mapTiltToAxes(
        event.beta - baselineRef.current.beta,
        event.gamma - baselineRef.current.gamma,
        angle
      )

      const normalizedTilt = {
        x: clamp(relativeTilt.x / TILT_HORIZONTAL_RANGE, -1, 1),
        y: clamp(relativeTilt.y / TILT_VERTICAL_RANGE, -1, 1),
      }

      smoothedTiltRef.current.x += (normalizedTilt.x - smoothedTiltRef.current.x) * SMOOTHING
      smoothedTiltRef.current.y += (normalizedTilt.y - smoothedTiltRef.current.y) * SMOOTHING

      const center = getViewportCenter()

      setMotionPosition({
        x: center.x + smoothedTiltRef.current.x * window.innerWidth * TILT_X_FACTOR,
        y: center.y + smoothedTiltRef.current.y * window.innerHeight * TILT_Y_FACTOR,
      })
      setMotionState('active')
    }

    motionTimeoutRef.current = setTimeout(() => {
      if (!hasMotionSampleRef.current) {
        setMotionEnabled(false)
        setMotionState('error')
      }
    }, 1800)

    window.addEventListener('deviceorientation', handleOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)

      if (motionTimeoutRef.current) {
        clearTimeout(motionTimeoutRef.current)
        motionTimeoutRef.current = null
      }
    }
  }, [motionEnabled])

  const enableMotion = async () => {
    if (!motionSupported) {
      setMotionState('unsupported')
      return false
    }

    setMotionState('requesting')

    try {
      if (requiresMotionPermission()) {
        const permission = await requestMotionPermissions()

        if (permission !== 'granted') {
          setMotionEnabled(false)
          setMotionState('denied')
          return false
        }
      }

      baselineRef.current = null
      smoothedTiltRef.current = { x: 0, y: 0 }
      setMotionEnabled(true)
      return true
    } catch (error) {
      setMotionEnabled(false)
      setMotionState(error?.name === 'NotAllowedError' ? 'denied' : 'error')
      return false
    }
  }

  const disableMotion = () => {
    setMotionEnabled(false)
    setMotionState('off')
    setMotionPosition(null)
  }

  const toggleMotion = async () => {
    if (motionEnabled) {
      disableMotion()
      return false
    }

    return enableMotion()
  }

  useEffect(() => {
    if (!isMobileLike || !motionSupported || motionEnabled || autoEnableAttemptedRef.current) {
      return
    }

    if (requiresMotionPermission()) {
      setMotionState((currentState) => (currentState === 'off' ? 'prompt' : currentState))
      return
    }

    autoEnableAttemptedRef.current = true
    void enableMotion()
  }, [isMobileLike, motionEnabled, motionSupported])

  const useTouchFallback =
    !isMobileLike ||
    !motionSupported ||
    motionState === 'denied' ||
    motionState === 'error' ||
    motionState === 'unsupported' ||
    motionState === 'off'

  const inputPosition =
    useTouchFallback
      ? pointerPosition
      : motionPosition || getViewportCenter()

  return {
    inputPosition,
    isMobileLike,
    motionEnabled,
    motionSupported,
    motionState,
    motionUi: getMotionStateLabel(motionSupported ? motionState : 'unsupported'),
    toggleMotion,
  }
}
