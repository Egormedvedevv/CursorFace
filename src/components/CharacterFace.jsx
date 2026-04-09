import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useEyeAnimation } from '../hooks/useEyeAnimation'
import './CharacterFace.css'

const FACE_BASE_SIZE = 700
const EYE_BASE_SIZE = 750
const PUPIL_BASE_SIZE = 700

function getExpectedFaceWidth(viewportWidth) {
  if (viewportWidth >= 769 && viewportWidth <= 1024) {
    return Math.min(600, viewportWidth * 0.75)
  }

  return Math.min(FACE_BASE_SIZE, viewportWidth * 0.85)
}

function getInitialFaceWidth() {
  if (typeof window === 'undefined') {
    return FACE_BASE_SIZE
  }

  return getExpectedFaceWidth(window.innerWidth)
}

function getStableFaceWidth(faceElement) {
  const computedWidth = Number.parseFloat(window.getComputedStyle(faceElement).width)
  if (Number.isFinite(computedWidth) && computedWidth > 0) {
    return computedWidth
  }

  if (Number.isFinite(faceElement.clientWidth) && faceElement.clientWidth > 0) {
    return faceElement.clientWidth
  }

  if (Number.isFinite(faceElement.offsetWidth) && faceElement.offsetWidth > 0) {
    return faceElement.offsetWidth
  }

  const rectWidth = faceElement.getBoundingClientRect().width
  return Number.isFinite(rectWidth) && rectWidth > 0 ? rectWidth : 0
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
  const [isFaceMeasured, setIsFaceMeasured] = useState(false)
  const timeoutRef = useRef(null)
  const currentFaceSrc = isAltFace && character.faceAlt ? character.faceAlt : character.face

  const measureFaceWidth = useCallback(() => {
    const faceElement = faceRef.current

    if (!faceElement) {
      return
    }

    const nextWidth = getStableFaceWidth(faceElement)

    if (!Number.isFinite(nextWidth) || nextWidth <= 0) {
      return
    }

    setFaceWidth((currentWidth) =>
      Math.abs(currentWidth - nextWidth) > 0.5 ? nextWidth : currentWidth
    )
    setIsFaceMeasured(true)
  }, [])

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
    setIsFaceMeasured(false)
    measureFaceWidth()

    const frameId = window.requestAnimationFrame(() => {
      measureFaceWidth()
    })

    window.addEventListener('resize', measureFaceWidth)
    window.addEventListener('orientationchange', measureFaceWidth)
    window.addEventListener('pageshow', measureFaceWidth)
    window.visualViewport?.addEventListener('resize', measureFaceWidth)

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.cancelAnimationFrame(frameId)
        window.removeEventListener('resize', measureFaceWidth)
        window.removeEventListener('orientationchange', measureFaceWidth)
        window.removeEventListener('pageshow', measureFaceWidth)
        window.visualViewport?.removeEventListener('resize', measureFaceWidth)
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      measureFaceWidth()
    })

    if (faceRef.current) {
      resizeObserver.observe(faceRef.current)
    }

    return () => {
      window.cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measureFaceWidth)
      window.removeEventListener('orientationchange', measureFaceWidth)
      window.removeEventListener('pageshow', measureFaceWidth)
      window.visualViewport?.removeEventListener('resize', measureFaceWidth)
    }
  }, [currentFaceSrc, measureFaceWidth])

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
  const eyesVisible = isFaceMeasured ? 1 : 0

  return (
    <div className="character" data-character-id={character.id}>
      <img
        ref={faceRef}
        src={currentFaceSrc}
        alt="Основное лицо"
        className="main-face"
        onClick={handleFaceClick}
        onLoad={measureFaceWidth}
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
          opacity: isAltFace ? 0 : eyesVisible,
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
          opacity: isAltFace ? 0 : eyesVisible,
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
