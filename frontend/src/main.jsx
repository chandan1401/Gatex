import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.jsx loaded')
console.log('React:', React)
console.log('ReactDOM:', ReactDOM)
console.log('App:', App)

const root = document.getElementById('root')
console.log('Root element:', root)

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('React rendered successfully')
} catch (e) {
  console.error('Error rendering React:', e)
}
