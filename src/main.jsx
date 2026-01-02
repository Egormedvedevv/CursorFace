import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

console.log('main.jsx loaded')

// Component to handle hash-based redirects from 404.html
function HashRedirect() {
  const navigate = useNavigate()
  
  React.useEffect(() => {
    // Check if we have a hash that contains a path (from 404 redirect)
    const hash = window.location.hash
    if (hash) {
      // Hash format: #/path?query or #?query
      let path = hash.substring(1) // Remove the #
      
      // Extract path and query
      const queryIndex = path.indexOf('?')
      let queryString = ''
      if (queryIndex !== -1) {
        queryString = path.substring(queryIndex)
        path = path.substring(0, queryIndex)
      }
      
      // Remove base path if present
      const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
      if (path.startsWith(basePath)) {
        path = path.substring(basePath.length)
      }
      
      // Only redirect if we have a valid path
      if (path && (path.startsWith('/') || path.startsWith('?'))) {
        const fullPath = path.startsWith('/') ? path + queryString : '/' + path + queryString
        const currentPath = window.location.pathname + window.location.search
        const basePathClean = basePath || ''
        const currentPathClean = currentPath.startsWith(basePathClean) 
          ? currentPath.substring(basePathClean.length) 
          : currentPath
        
        if (fullPath !== currentPathClean) {
          console.log('Redirecting from hash to:', fullPath)
          navigate(fullPath, { replace: true })
        }
      }
    }
  }, [navigate])
  
  return null
}

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
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <HashRedirect />
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
