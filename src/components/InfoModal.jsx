import { useState } from 'react'
import './InfoModal.css'

export default function InfoModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState('ru')

  const welcomeText = {
    ru: {
      title: 'Добро пожаловать в CursorFace!',
      text: [
        'Забрели сюда от нечего делать? Отлично.',
        'Здесь шесть причудливых персонажей будут молча наблюдать за каждым вашим движением, отслеживая курсор с почти жутким любопытством.',
        'Независимо от того, прокрастинируете ли вы, делаете перерыв или просто хотите, чтобы за вами наблюдали пиксельные глаза — вы попали по адресу.',
        'Присядьте, расслабьтесь и позвольте лицам следить за вами.'
      ]
    },
    en: {
      title: 'Welcome to CursorFace!',
      text: [
        'Stumbled here with nothing better to do? Perfect.',
        'Here, six quirky characters will silently watch your every move, tracking your cursor with an almost eerie curiosity.',
        'Whether you are procrastinating, taking a break, or just feeling like being observed by pixelated eyes — you have found the right place.',
        'Sit back, relax, and let the faces follow you around.'
      ]
    }
  }

  const currentText = welcomeText[language]

  return (
    <>
      <button
        id="info-btn"
        title="Info"
        aria-label="Info"
        onClick={() => setIsOpen(true)}
      >
        <img src="/startimgs/i.png" alt="Info" loading="lazy" />
      </button>

      {isOpen && (
        <div 
          className="modal" 
          onClick={() => setIsOpen(false)}
          onTouchStart={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false)
            }
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              id="close-info"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            
            <div className="welcome-content">
              <h2 className="welcome-title">{currentText.title}</h2>
              <div className="welcome-text">
                {currentText.text.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              
              <div className="language-switcher">
                <button
                  className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
                  onClick={() => setLanguage('ru')}
                >
                  RU
                </button>
                <button
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => setLanguage('en')}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="bymd-logo">
              <img src="/images/bymd.png" alt="Bymd" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}


