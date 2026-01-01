import { useEffect, useRef, useState } from 'react'

export function useFaceAnimation() {
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, rotate: 0 })
  const [transform, setTransform] = useState({ x: 0, y: 0, rotate: 0 })
  const animationFrameRef = useRef(null)
  const currentRef = useRef({ x: 0, y: 0, rotate: 0 })
  const velocityRef = useRef({ x: 0, y: 0, rotate: 0 })

  const stiffness = 0.08
  const damping = 0.75
  const moveFactor = 0.08 // Коэффициент движения за курсором
  const maxRotation = 12 // Максимальный угол поворота в градусах

  useEffect(() => {
    const handleMouseMove = (e) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      // Вычисляем смещение от центра
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      
      // Вычисляем максимальное возможное расстояние от центра до края экрана
      const maxDistanceX = window.innerWidth / 2
      const maxDistanceY = window.innerHeight / 2
      const maxDistance = Math.sqrt(maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY)
      
      // Вычисляем расстояние до курсора
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Нормализуем расстояние для равномерного эффекта на всем экране
      const normalizedDistance = Math.min(distance / maxDistance, 1)
      
      // Вычисляем движение с нормализацией
      const moveX = dx * moveFactor * normalizedDistance
      const moveY = dy * moveFactor * normalizedDistance
      
      // Вычисляем угол поворота в направлении курсора
      // Для симметрии используем горизонтальную компоненту с учетом направления
      const horizontalRatio = dx / maxDistanceX
      // Нормализуем поворот: используем normalizedDistance для плавного увеличения угла
      // Максимальный угол поворота достигается на краю экрана
      // Используем горизонтальную компоненту для симметричного поворота слева и справа
      const rotation = horizontalRatio * maxRotation * normalizedDistance
      
      setTargetPosition({
        x: moveX,
        y: moveY,
        rotate: rotation,
      })
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        const dx = touch.clientX - centerX
        const dy = touch.clientY - centerY
        
        const maxDistanceX = window.innerWidth / 2
        const maxDistanceY = window.innerHeight / 2
        const maxDistance = Math.sqrt(maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY)
        
        const distance = Math.sqrt(dx * dx + dy * dy)
        const normalizedDistance = Math.min(distance / maxDistance, 1)
        
        const moveX = dx * moveFactor * normalizedDistance
        const moveY = dy * moveFactor * normalizedDistance
        const horizontalRatio = dx / maxDistanceX
        const rotation = horizontalRatio * maxRotation * normalizedDistance
        
        setTargetPosition({
          x: moveX,
          y: moveY,
          rotate: rotation,
        })
      }
    }

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      if (touch) {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        
        const dx = touch.clientX - centerX
        const dy = touch.clientY - centerY
        
        const maxDistanceX = window.innerWidth / 2
        const maxDistanceY = window.innerHeight / 2
        const maxDistance = Math.sqrt(maxDistanceX * maxDistanceX + maxDistanceY * maxDistanceY)
        
        const distance = Math.sqrt(dx * dx + dy * dy)
        const normalizedDistance = Math.min(distance / maxDistance, 1)
        
        const moveX = dx * moveFactor * normalizedDistance
        const moveY = dy * moveFactor * normalizedDistance
        const horizontalRatio = dx / maxDistanceX
        const rotation = horizontalRatio * maxRotation * normalizedDistance
        
        setTargetPosition({
          x: moveX,
          y: moveY,
          rotate: rotation,
        })
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
    // Запускаем анимацию сразу при монтировании
    const animate = () => {
      // Плавное движение по X
      const forceX = (targetPosition.x - currentRef.current.x) * stiffness
      velocityRef.current.x = velocityRef.current.x * damping + forceX
      currentRef.current.x += velocityRef.current.x

      // Плавное движение по Y
      const forceY = (targetPosition.y - currentRef.current.y) * stiffness
      velocityRef.current.y = velocityRef.current.y * damping + forceY
      currentRef.current.y += velocityRef.current.y

      // Плавный поворот в сторону курсора
      // Нормализуем угол поворота для плавного перехода через 0
      let targetRotate = targetPosition.rotate
      let currentRotate = currentRef.current.rotate
      
      // Находим кратчайший путь поворота
      let diff = targetRotate - currentRotate
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      
      const forceR = diff * stiffness
      velocityRef.current.rotate = velocityRef.current.rotate * damping + forceR
      currentRef.current.rotate += velocityRef.current.rotate
      
      // Нормализуем угол в диапазоне -180 до 180
      if (currentRef.current.rotate > 180) currentRef.current.rotate -= 360
      if (currentRef.current.rotate < -180) currentRef.current.rotate += 360

      setTransform({
        x: currentRef.current.x,
        y: currentRef.current.y,
        rotate: currentRef.current.rotate,
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Запускаем анимацию немедленно
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [targetPosition])

  return transform
}


