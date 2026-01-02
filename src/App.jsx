import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import StartPage from './pages/StartPage'
import MainPage from './pages/MainPage'
import MobileMessage from './pages/MobileMessage'

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  console.log('App component rendering, isMobile:', isMobile)

  if (isMobile) {
    return <MobileMessage />
  }

  try {
    return (
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  } catch (error) {
    console.error('App error:', error)
    return (
      <div style={{ 
        padding: '50px', 
        backgroundColor: '#0a0a0a', 
        color: '#fff', 
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1>Error in App component</h1>
        <p>{error.message}</p>
      </div>
    )
  }
}

export default App
