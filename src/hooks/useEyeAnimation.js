import { useEffect, useRef, useState, useCallback } from 'react'

export function useEyeAnimation() {
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })
  const animationFrameRef = useRef(null)
  const currentPositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setTargetPosition({ x: e.clientX, y: e.clientY })
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        setTargetPosition({ x: touch.clientX, y: touch.clientY })
      }
    }

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      if (touch) {
        setTargetPosition({ x: touch.clientX, y: touch.clientY })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchstart', handleTouchStart)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const animate = () => {
      currentPositionRef.current.x += (targetPosition.x - currentPositionRef.current.x) * 0.07
      currentPositionRef.current.y += (targetPosition.y - currentPositionRef.current.y) * 0.07
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [targetPosition])

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
    const moveX = Math.cos(angle) * distance
    const moveY = Math.sin(angle) * distance

    return { x: moveX, y: moveY }
  }, [])

  return { getPupilTransform }
}

