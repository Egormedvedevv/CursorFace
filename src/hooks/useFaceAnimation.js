import { useEffect, useRef, useState } from 'react'

function createTransform() {
  return { x: 0, y: 0, rotate: 0 }
}

function sanitizeTransform(transform) {
  return {
    x: Number.isFinite(transform.x) ? transform.x : 0,
    y: Number.isFinite(transform.y) ? transform.y : 0,
    rotate: Number.isFinite(transform.rotate) ? transform.rotate : 0,
  }
}

export function useFaceAnimation(targetPoint, options = {}) {
  const [transform, setTransform] = useState(() => createTransform())
  const animationFrameRef = useRef(null)
  const currentRef = useRef(createTransform())
  const targetRef = useRef(createTransform())
  const velocityRef = useRef(createTransform())

  const stiffness = options.stiffness ?? 0.08
  const damping = options.damping ?? 0.75
  const moveFactor = options.moveFactor ?? 0.08
  const maxRotation = options.maxRotation ?? 12

  useEffect(() => {
    if (!targetPoint) {
      targetRef.current = createTransform()
      return
    }

    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2

    const dx = targetPoint.x - centerX
    const dy = targetPoint.y - centerY

    const maxDistanceX = window.innerWidth / 2
    const maxDistanceY = window.innerHeight / 2
    const maxDistance = Math.sqrt(maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY)
    const distance = Math.sqrt(dx * dx + dy * dy)
    const normalizedDistance = Math.min(distance / maxDistance, 1)
    const horizontalRatio = dx / maxDistanceX

    targetRef.current = sanitizeTransform({
      x: dx * moveFactor * normalizedDistance,
      y: dy * moveFactor * normalizedDistance,
      rotate: horizontalRatio * maxRotation * normalizedDistance,
    })
  }, [targetPoint])

  useEffect(() => {
    const animate = () => {
      const target = targetRef.current

      const forceX = (target.x - currentRef.current.x) * stiffness
      velocityRef.current.x = velocityRef.current.x * damping + forceX
      currentRef.current.x += velocityRef.current.x

      const forceY = (target.y - currentRef.current.y) * stiffness
      velocityRef.current.y = velocityRef.current.y * damping + forceY
      currentRef.current.y += velocityRef.current.y

      let rotationDiff = target.rotate - currentRef.current.rotate
      if (rotationDiff > 180) rotationDiff -= 360
      if (rotationDiff < -180) rotationDiff += 360

      const forceRotate = rotationDiff * stiffness
      velocityRef.current.rotate = velocityRef.current.rotate * damping + forceRotate
      currentRef.current.rotate += velocityRef.current.rotate

      if (currentRef.current.rotate > 180) currentRef.current.rotate -= 360
      if (currentRef.current.rotate < -180) currentRef.current.rotate += 360

      const nextTransform = sanitizeTransform({
        x: currentRef.current.x,
        y: currentRef.current.y,
        rotate: currentRef.current.rotate,
      })
      currentRef.current = nextTransform
      setTransform(nextTransform)

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return transform
}
