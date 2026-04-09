import { Routes, Route, Navigate } from 'react-router-dom'
import StartPage from './pages/StartPage'
import MainPage from './pages/MainPage'
import { usePortraitLock } from './hooks/usePortraitLock'

function App() {
  usePortraitLock()

  try {
    return (
      <>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    )
  } catch (error) {
    console.error('App error:', error)
    return (
      <div style={{ 
        padding: '50px', 
        backgroundColor: '#0a0a0a', 
        color: '#fff', 
        minHeight: '100vh',
        fontFamily: 'var(--font-pixel)'
      }}>
        <h1>Error in App component</h1>
        <p>{error.message}</p>
      </div>
    )
  }
}

export default App
