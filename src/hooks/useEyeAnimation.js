import { useCallback, useEffect, useRef } from 'react'

export function useEyeAnimation(targetPoint) {
  const currentPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!targetPoint) return
    currentPositionRef.current = targetPoint
  }, [targetPoint])

  const getPupilTransform = useCallback((eyeRef) => {
    if (!eyeRef?.current) return { x: 0, y: 0 }

    const rect = eyeRef.current.getBoundingClientRect()
    const eyeCenterX = rect.left + rect.width / 2
    const eyeCenterY = rect.top + rect.height / 2

    const dx = currentPositionRef.current.x - eyeCenterX
    const dy = currentPositionRef.current.y - eyeCenterY

    const maxDistance = 12
    const distance = Math.min(maxDistance, Math.sqrt(dx * dx + dy * dy))
    const angle = Math.atan2(dy, dx)

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    }
  }, [])

  return { getPupilTransform }
}
