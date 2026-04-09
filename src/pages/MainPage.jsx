import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { characters } from '../data/characters'
import CharacterFace from '../components/CharacterFace'
import CharacterSwitcher from '../components/CharacterSwitcher'
import MotionToggle from '../components/MotionToggle'
import { useFaceAnimation } from '../hooks/useFaceAnimation'
import { useInteractionInput } from '../hooks/useInteractionInput'
import './MainPage.css'

export default function MainPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isFading, setIsFading] = useState(false)
  const {
    inputPosition,
    isMobileLike,
    motionEnabled,
    motionSupported,
    motionUi,
    toggleMotion,
  } = useInteractionInput()
  const faceTransform = useFaceAnimation(inputPosition)

  // Инициализация персонажа из URL параметров сразу при монтировании
  const getInitialCharacter = () => {
    const charId = searchParams.get('char') || '1'
    return characters.find((c) => c.id === charId) || characters[0]
  }

  const [currentCharacter, setCurrentCharacter] = useState(() => getInitialCharacter())

  useEffect(() => {
    const charId = searchParams.get('char') || '1'
    const character = characters.find((c) => c.id === charId) || characters[0]
    if (character && character.id !== currentCharacter.id) {
      setIsFading(true)
      setTimeout(() => {
        setCurrentCharacter(character)
        setIsFading(false)
      }, 250)
    }
  }, [searchParams])

  const handleCharacterChange = (character) => {
    if (character.id === currentCharacter.id) return
    
    setIsFading(true)
    // Update URL with new character
    navigate(`/main?char=${character.id}`, { replace: true })
    // Update character immediately
    setTimeout(() => {
      setCurrentCharacter(character)
      setIsFading(false)
    }, 250)
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
        currentCharacterId={currentCharacter.id}
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
            character={currentCharacter}
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
