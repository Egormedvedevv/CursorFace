import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { characters } from '../data/characters'
import CharacterFace from '../components/CharacterFace'
import CharacterSwitcher from '../components/CharacterSwitcher'
import { useFaceAnimation } from '../hooks/useFaceAnimation'
import './MainPage.css'

export default function MainPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isFading, setIsFading] = useState(false)
  const faceTransform = useFaceAnimation()

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
    <div className="main-page">
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

      <main>
        <div
          className="character-container"
          style={{
            transform: `translate(${faceTransform.x}px, ${faceTransform.y}px) rotate(${faceTransform.rotate}deg)`,
          }}
        >
          <CharacterFace character={currentCharacter} />
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
        <img src={`${import.meta.env.BASE_URL}images/bymd.png`} alt="Bymd" className="bymd" loading="lazy" />
      </footer>
    </div>
  )
}


