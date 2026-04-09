import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { characters } from '../data/characters'
import CharacterFace from '../components/CharacterFace'
import CharacterSwitcher from '../components/CharacterSwitcher'
import MotionToggle from '../components/MotionToggle'
import { useFaceAnimation } from '../hooks/useFaceAnimation'
import { useInteractionInput } from '../hooks/useInteractionInput'
import './MainPage.css'

function getCharacterFromSearchParams(searchParams) {
  const charId = searchParams.get('char') || '1'
  return characters.find((character) => character.id === charId) || characters[0]
}

export default function MainPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isFading, setIsFading] = useState(false)
  const fadeTimeoutRef = useRef(null)
  const {
    inputPosition,
    isMobileLike,
    motionEnabled,
    motionSupported,
    motionUi,
    toggleMotion,
  } = useInteractionInput()
  const faceTransform = useFaceAnimation(inputPosition)

  const selectedCharacter = useMemo(
    () => getCharacterFromSearchParams(searchParams),
    [searchParams]
  )
  const [displayCharacter, setDisplayCharacter] = useState(selectedCharacter)

  useEffect(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }

    if (selectedCharacter.id === displayCharacter.id) {
      setIsFading(false)
      return
    }

    setIsFading(true)
    fadeTimeoutRef.current = setTimeout(() => {
      setDisplayCharacter(selectedCharacter)
      setIsFading(false)
      fadeTimeoutRef.current = null
    }, 250)

    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
        fadeTimeoutRef.current = null
      }
    }
  }, [displayCharacter.id, selectedCharacter])

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current)
      }
    }
  }, [])

  const handleCharacterChange = (character) => {
    if (character.id === selectedCharacter.id) return

    setIsFading(true)

    navigate(`/main?char=${character.id}`, { replace: true })
  }

  const handleBackClick = () => {
    navigate('/')
  }

  return (
    <div className={`main-page ${isMobileLike ? 'is-mobile-ready' : ''}`}>
      <img
        src={`${import.meta.env.BASE_URL}images/back-to-start.png`}
        alt="Back to Start"
        className="back-to-start-btn"
        onClick={handleBackClick}
      />

      <div className={`screen-fader ${isFading ? 'fade' : ''}`}></div>

      <CharacterSwitcher
        onCharacterChange={handleCharacterChange}
        currentCharacterId={selectedCharacter.id}
      />

      {isMobileLike ? (
        <MotionToggle
          motionEnabled={motionEnabled}
          motionSupported={motionSupported}
          motionUi={motionUi}
          onToggle={toggleMotion}
        />
      ) : null}

      <main>
        <div
          className="character-container"
          style={{
            transform: `translate(${faceTransform.x}px, ${faceTransform.y}px) rotate(${faceTransform.rotate}deg)`,
          }}
        >
          <CharacterFace
            character={displayCharacter}
            targetPosition={inputPosition}
          />
        </div>
        <div className="speech"></div>
      </main>

      <footer>
        <img 
          src={`${import.meta.env.BASE_URL}images/logo.png`}
          alt="Cursorface logo" 
          className="logo" 
          onClick={handleBackClick}
          style={{ cursor: 'pointer' }}
        />
        <a href="https://www.bymd.site" target="_blank" rel="noopener noreferrer">
          <img src={`${import.meta.env.BASE_URL}images/bymd.png`} alt="Bymd" className="bymd" loading="lazy" />
        </a>
      </footer>
    </div>
  )
}
