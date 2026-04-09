import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useEyeAnimation } from '../hooks/useEyeAnimation'
import './CharacterFace.css'

const FACE_BASE_SIZE = 700
const EYE_BASE_SIZE = 750
const PUPIL_BASE_SIZE = 700

function getInitialFaceWidth() {
  if (typeof window === 'undefined') {
    return FACE_BASE_SIZE
  }

  return Math.min(window.innerWidth * 0.85, FACE_BASE_SIZE)
}

export default function CharacterFace({ character, targetPosition }) {
  const leftEyeRef = useRef(null)
  const rightEyeRef = useRef(null)
  const leftPupilRef = useRef(null)
  const rightPupilRef = useRef(null)
  const faceRef = useRef(null)
  const { getPupilTransform } = useEyeAnimation(targetPosition)
  const animationFrameRef = useRef(null)
  const [isAltFace, setIsAltFace] = useState(false)
  const [faceWidth, setFaceWidth] = useState(getInitialFaceWidth)
  const timeoutRef = useRef(null)
  const currentFaceSrc = isAltFace && character.faceAlt ? character.faceAlt : character.face

  const handleFaceClick = () => {
    if (!character.faceAlt) {
      return
    }

    setIsAltFace(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setIsAltFace(false)
    }, 1000)
  }

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

  useLayoutEffect(() => {
    const faceElement = faceRef.current

    if (!faceElement) {
      return
    }

    const updateFaceWidth = () => {
      const nextWidth = faceElement.getBoundingClientRect().width

      if (!Number.isFinite(nextWidth) || nextWidth <= 0) {
        return
      }

      setFaceWidth((currentWidth) =>
        Math.abs(currentWidth - nextWidth) > 0.5 ? nextWidth : currentWidth
      )
    }

    updateFaceWidth()

    window.addEventListener('resize', updateFaceWidth)
    window.addEventListener('orientationchange', updateFaceWidth)

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.removeEventListener('resize', updateFaceWidth)
        window.removeEventListener('orientationchange', updateFaceWidth)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      updateFaceWidth()
    })

    resizeObserver.observe(faceElement)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateFaceWidth)
      window.removeEventListener('orientationchange', updateFaceWidth)
    }
  }, [currentFaceSrc])

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

  const scale = faceWidth / FACE_BASE_SIZE
  const scaledEyeSize = `${EYE_BASE_SIZE * scale}px`
  const scaledPupilSize = `${PUPIL_BASE_SIZE * scale}px`
  const scaledOffset = (value) => `${value * scale}px`

  return (
    <div className="character" data-character-id={character.id}>
      <img
        ref={faceRef}
        src={currentFaceSrc}
        alt="Основное лицо"
        className="main-face"
        onClick={handleFaceClick}
        onError={(event) => {
          console.error('Failed to load image:', currentFaceSrc)
          event.target.src = character.face
        }}
        style={{ cursor: 'pointer' }}
      />

      <div
        ref={leftEyeRef}
        className="eye eye-left"
        style={{
          top: scaledOffset(character.eyeLeftTop),
          left: scaledOffset(character.eyeLeftLeft),
          width: scaledEyeSize,
          height: scaledEyeSize,
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
            top: scaledOffset(character.pupilLeftTop),
            left: scaledOffset(character.pupilLeftLeft),
            width: scaledPupilSize,
            height: scaledPupilSize,
          }}
          alt=""
        />
      </div>

      <div
        ref={rightEyeRef}
        className="eye eye-right"
        style={{
          top: scaledOffset(character.eyeRightTop),
          left: scaledOffset(character.eyeRightLeft),
          width: scaledEyeSize,
          height: scaledEyeSize,
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
            top: scaledOffset(character.pupilRightTop),
            left: scaledOffset(character.pupilRightLeft),
            width: scaledPupilSize,
            height: scaledPupilSize,
          }}
          alt=""
        />
      </div>
    </div>
  )
}
