import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

console.log('main.jsx loaded')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 50px; background: #0a0a0a; color: #fff; font-family: Arial; min-height: 100vh;"><h1>Root element not found!</h1></div>'
} else {
  console.log('Root element found, rendering...')
  try {
    const root = ReactDOM.createRoot(rootElement)
    console.log('React root created')
    root.render(
      <ErrorBoundary>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    )
    console.log('React app rendered')
  } catch (error) {
    console.error('Failed to render:', error)
    rootElement.innerHTML = `<div style="padding: 50px; background: #0a0a0a; color: #fff; font-family: Arial; min-height: 100vh;"><h1>Render Error</h1><p>${error.message}</p><pre>${error.stack}</pre></div>`
  }
}
