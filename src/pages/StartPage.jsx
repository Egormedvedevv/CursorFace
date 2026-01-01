import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { characters } from '../data/characters'
import InfoModal from '../components/InfoModal'
import './StartPage.css'

export default function StartPage() {
  console.log('StartPage component rendering')
  const navigate = useNavigate()
  const logoRef = useRef(null)
  const [logoTransform, setLogoTransform] = useState({ x: 0, y: 0, scale: 1 })
  const animationFrameRef = useRef(null)
  const currentRef = useRef({ x: 0, y: 0, scale: 1 })
  const targetRef = useRef({ x: 0, y: 0, scale: 1 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!logoRef.current) return
      
      const rect = logoRef.current.getBoundingClientRect()
      const logoCenterX = rect.left + rect.width / 2
      const logoCenterY = rect.top + rect.height / 2
      
      const dx = e.clientX - logoCenterX
      const dy = e.clientY - logoCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Легкое движение к курсору
      const maxMove = 10
      targetRef.current.x = Math.max(-maxMove, Math.min(maxMove, dx * 0.03))
      targetRef.current.y = Math.max(-maxMove, Math.min(maxMove, dy * 0.03))
      
      // Легкое увеличение при приближении курсора
      const maxDistance = 200
      const scaleFactor = Math.max(0, 1 - distance / maxDistance) * 0.05
      targetRef.current.scale = 1 + scaleFactor
    }

    const handleTouchMove = (e) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch && logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect()
        const logoCenterX = rect.left + rect.width / 2
        const logoCenterY = rect.top + rect.height / 2
        
        const dx = touch.clientX - logoCenterX
        const dy = touch.clientY - logoCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        const maxMove = 10
        targetRef.current.x = Math.max(-maxMove, Math.min(maxMove, dx * 0.03))
        targetRef.current.y = Math.max(-maxMove, Math.min(maxMove, dy * 0.03))
        
        const maxDistance = 200
        const scaleFactor = Math.max(0, 1 - distance / maxDistance) * 0.05
        targetRef.current.scale = 1 + scaleFactor
      }
    }

    const handleTouchStart = (e) => {
      const touch = e.touches[0]
      if (touch && logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect()
        const logoCenterX = rect.left + rect.width / 2
        const logoCenterY = rect.top + rect.height / 2
        
        const dx = touch.clientX - logoCenterX
        const dy = touch.clientY - logoCenterY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        const maxMove = 10
        targetRef.current.x = Math.max(-maxMove, Math.min(maxMove, dx * 0.03))
        targetRef.current.y = Math.max(-maxMove, Math.min(maxMove, dy * 0.03))
        
        const maxDistance = 200
        const scaleFactor = Math.max(0, 1 - distance / maxDistance) * 0.05
        targetRef.current.scale = 1 + scaleFactor
      }
    }

    const handleTouchEnd = () => {
      targetRef.current.x = 0
      targetRef.current.y = 0
      targetRef.current.scale = 1
    }

    const handleMouseLeave = () => {
      targetRef.current.x = 0
      targetRef.current.y = 0
      targetRef.current.scale = 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)
    window.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.1
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.1
      currentRef.current.scale += (targetRef.current.scale - currentRef.current.scale) * 0.1
      
      setLogoTransform({
        x: currentRef.current.x,
        y: currentRef.current.y,
        scale: currentRef.current.scale
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleCharacterSelect = (charId) => {
    navigate(`/main?char=${charId}`)
  }

  console.log('StartPage returning JSX')
  return (
    <div className="start-page" style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <div className="start-page-background">
        <div className="grid-pattern"></div>
        <div className="pixel-pattern"></div>
        <div className="cursor-trail"></div>
        <div className="corner-decoration bottom-left"></div>
        <div className="corner-decoration bottom-right"></div>
      </div>

      <img
        ref={logoRef}
        src={`${import.meta.env.BASE_URL}startimgs/logo.png`}
        className="start-logo"
        alt="CursorFace Logo"
        style={{
          transform: `translate(calc(-50% + ${logoTransform.x}px), ${logoTransform.y}px) scale(${logoTransform.scale})`,
        }}
        loading="lazy"
      />

      <div className="character-switcher">
        <div className="choose-label">choose:</div>
        <div className="char-buttons">
          {characters.map((char) => (
            <img
              key={char.id}
              src={char.thumbnail}
              alt={`Персонаж ${char.id}`}
              data-char={char.id}
              onClick={() => handleCharacterSelect(char.id)}
              loading="lazy"
            />
          ))}
        </div>
      </div>

      <InfoModal />
    </div>
  )
}

