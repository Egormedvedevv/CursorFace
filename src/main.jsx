import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('Root element not found')
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <HashRouter>
          <App />
        </HashRouter>
      </ErrorBoundary>
    </React.StrictMode>,
  )
} catch (error) {
  console.error('Failed to render app:', error)
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0a0a0a; color: #fff; font-family: Arial;">
      <div>
        <h1>Failed to load app</h1>
        <p>${error.message}</p>
      </div>
    </div>
  `
}


