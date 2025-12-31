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
  const [currentCharacter, setCurrentCharacter] = useState(characters[0])
  const [isFading, setIsFading] = useState(false)
  const faceTransform = useFaceAnimation()

  useEffect(() => {
    const charId = searchParams.get('char') || '1'
    const character = characters.find((c) => c.id === charId) || characters[0]
    setCurrentCharacter(character)
  }, [searchParams])

  const handleCharacterChange = (character) => {
    setIsFading(true)
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
        src="/images/back-to-start.png"
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
          src="/images/logo.png" 
          alt="Cursorface logo" 
          className="logo" 
          onClick={handleBackClick}
          style={{ cursor: 'pointer' }}
        />
        <img src="/images/bymd.png" alt="Bymd" className="bymd" loading="lazy" />
      </footer>
    </div>
  )
}


