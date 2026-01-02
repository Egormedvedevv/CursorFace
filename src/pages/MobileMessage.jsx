import { useState, useEffect } from 'react'
import { characters } from '../data/characters'
import './MobileMessage.css'

export default function MobileMessage() {
  const [isTranslating, setIsTranslating] = useState(false)

  // Выбираем двух разных персонажей для отображения
  const leftCharacter = characters[0] // Первый персонаж
  const rightCharacter = characters[1] // Второй персонаж

  const originalText = 'Сайт предназначен для десктопов, так как необходим курсор.'
  const englishText = 'This site is designed for desktops, as a cursor is required.'

  const handleTranslate = () => {
    setIsTranslating(!isTranslating)
  }

  return (
    <div className="mobile-message-page">
      {/* Полосатый фон */}
      <div className="mobile-striped-background"></div>
      
      {/* Кнопка перевода в углу */}
      <button className="translate-btn" onClick={handleTranslate}>
        {isTranslating ? 'RU' : 'EN'}
      </button>

      {/* Логотип CursorFace сверху по центру */}
      <div className="mobile-logo-top">
        <img 
          src={`${import.meta.env.BASE_URL}images/logo.png`} 
          alt="CursorFace" 
        />
      </div>

      {/* Плашка с текстом по центру */}
      <div className="mobile-message-box">
        <p className="mobile-message-text">
          {isTranslating ? englishText : originalText}
        </p>
      </div>

      {/* Трясущиеся головы персонажей */}
      <div className="mobile-character-left">
        <img 
          src={leftCharacter.face} 
          alt="Character" 
          className="shaking-head"
        />
      </div>
      <div className="mobile-character-right">
        <img 
          src={rightCharacter.face} 
          alt="Character" 
          className="shaking-head"
        />
      </div>

      {/* Логотип BYMD снизу по центру */}
      <div className="mobile-logo-bottom">
        <img 
          src={`${import.meta.env.BASE_URL}images/bymd.png`} 
          alt="BYMD" 
        />
      </div>
    </div>
  )
}

