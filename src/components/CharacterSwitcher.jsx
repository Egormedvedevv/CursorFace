import { useState, useEffect, useRef } from 'react'
import { characters } from '../data/characters'
import './CharacterSwitcher.css'

export default function CharacterSwitcher({ onCharacterChange, currentCharacterId }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const switcherRef = useRef(null)

  const handleCharacterClick = (character) => {
    onCharacterChange(character)
    setMenuOpen(false)
  }

  const handleTabClick = () => {
    setMenuOpen(!menuOpen)
  }

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <div 
      ref={switcherRef}
      className={`character-switcher ${menuOpen ? 'touched' : ''}`}
    >
      <div className="tab" onClick={handleTabClick}>
        <img src={`${import.meta.env.BASE_URL}images/charmenu.png`} alt="Иконка меню" className="chimg" />
      </div>
      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        {characters.map((char) => (
          <img
            key={char.id}
            src={char.thumbnail}
            alt={`Персонаж ${char.id}`}
            className={currentCharacterId === char.id ? 'active' : ''}
            onClick={() => handleCharacterClick(char)}
          />
        ))}
      </div>
    </div>
  )
}


