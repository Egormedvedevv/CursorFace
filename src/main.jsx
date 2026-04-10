import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './ErrorBoundary'
import './index.css'

console.log('main.jsx loaded')

function getRedirectTarget(basePath) {
  const search = window.location.search
  if (search.startsWith('?/')) {
    const decoded = search.slice(2).replace(/~and~/g, '&')
    const [rawPath, ...rawQueryParts] = decoded.split('&')
    let path = rawPath || ''

    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length)
    }

    path = `/${path.replace(/^\/+/, '')}`

    const queryString = rawQueryParts.length ? `?${rawQueryParts.join('&')}` : ''
    return `${path}${queryString}${window.location.hash}`
  }

  const hash = window.location.hash
  if (hash && hash.length > 1) {
    let path = hash.substring(1)

    const queryIndex = path.indexOf('?')
    let queryString = ''
    if (queryIndex !== -1) {
      queryString = path.substring(queryIndex)
      path = path.substring(0, queryIndex)
    }

    if (path.startsWith(basePath)) {
      path = path.substring(basePath.length)
    }

    if (path && !path.startsWith('/')) {
      path = '/' + path
    }

    return path && path !== '/' ? path + queryString : null
  }

  return null
}

// Component to handle redirects from 404.html
function HashRedirect() {
  const navigate = useNavigate()
  
  React.useEffect(() => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
    const redirectTarget = getRedirectTarget(basePath)

    if (redirectTarget) {
      console.log('Redirecting from 404 fallback to:', redirectTarget)
      navigate(redirectTarget, { replace: true })
    }
  }, [navigate])
  
  return null
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = '<div style="padding: 50px; background: #0a0a0a; color: #fff; font-family: var(--font-pixel); min-height: 100vh;"><h1>Root element not found!</h1></div>'
} else {
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <ErrorBoundary>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <HashRedirect />
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    )
  } catch (error) {
    console.error('Failed to render:', error)
    rootElement.innerHTML = `<div style="padding: 50px; background: #0a0a0a; color: #fff; font-family: var(--font-pixel); min-height: 100vh;"><h1>Render Error</h1><p>${error.message}</p><pre>${error.stack}</pre></div>`
  }
}
