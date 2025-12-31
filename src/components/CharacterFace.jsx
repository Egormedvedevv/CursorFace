import { useRef, useEffect, useState } from 'react'
import { useEyeAnimation } from '../hooks/useEyeAnimation'
import './CharacterFace.css'

export default function CharacterFace({ character }) {
  const leftEyeRef = useRef(null)
  const rightEyeRef = useRef(null)
  const leftPupilRef = useRef(null)
  const rightPupilRef = useRef(null)
  const faceRef = useRef(null)
  const { getPupilTransform } = useEyeAnimation()
  const animationFrameRef = useRef(null)
  const [isAltFace, setIsAltFace] = useState(false)
  const timeoutRef = useRef(null)

  const handleFaceClick = () => {
    if (!character.faceAlt) {
      console.log('No faceAlt for character:', character.id)
      return
    }
    
    console.log('Switching to alt face:', character.faceAlt)
    setIsAltFace(true)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      console.log('Switching back to normal face')
      setIsAltFace(false)
    }, 1000)
  }

  // Предзагрузка альтернативного изображения
  useEffect(() => {
    if (character.faceAlt) {
      const img = new Image()
      img.src = character.faceAlt
    }
  }, [character.faceAlt])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const updatePupils = () => {
      if (leftPupilRef.current && leftEyeRef.current) {
        const transform = getPupilTransform(leftEyeRef)
        leftPupilRef.current.style.transform = `translate(${transform.x}px, ${transform.y}px)`
      }
      if (rightPupilRef.current && rightEyeRef.current) {
        const transform = getPupilTransform(rightEyeRef)
        rightPupilRef.current.style.transform = `translate(${transform.x}px, ${transform.y}px)`
      }
      animationFrameRef.current = requestAnimationFrame(updatePupils)
    }

    animationFrameRef.current = requestAnimationFrame(updatePupils)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [getPupilTransform])

  const currentFaceSrc = isAltFace && character.faceAlt ? character.faceAlt : character.face

  return (
    <div className="character" data-character-id={character.id}>
      <img
        ref={faceRef}
        src={currentFaceSrc}
        alt="Основное лицо"
        className="main-face"
        onClick={handleFaceClick}
        onError={(e) => {
          console.error('Failed to load image:', currentFaceSrc)
          e.target.src = character.face // Fallback to normal face
        }}
        style={{ cursor: 'pointer' }}
      />

      <div
        ref={leftEyeRef}
        className="eye eye-left"
        style={{
          top: `${character.eyeLeftTop}px`,
          left: `${character.eyeLeftLeft}px`,
          opacity: isAltFace ? 0 : 1,
          transition: 'opacity 0.1s ease',
        }}
      >
        <img src={character.eyeLeft} className="eye-white" alt="" />
        <img
          ref={leftPupilRef}
          src={character.pupilLeft}
          className="pupil pupil-left"
          style={{
            top: `${character.pupilLeftTop}px`,
            left: `${character.pupilLeftLeft}px`,
          }}
          alt=""
        />
      </div>

      <div
        ref={rightEyeRef}
        className="eye eye-right"
        style={{
          top: `${character.eyeRightTop}px`,
          left: `${character.eyeRightLeft}px`,
          opacity: isAltFace ? 0 : 1,
          transition: 'opacity 0.1s ease',
        }}
      >
        <img src={character.eyeRight} className="eye-white" alt="" />
        <img
          ref={rightPupilRef}
          src={character.pupilRight}
          className="pupil pupil-right"
          style={{
            top: `${character.pupilRightTop}px`,
            left: `${character.pupilRightLeft}px`,
          }}
          alt=""
        />
      </div>
    </div>
  )
}

