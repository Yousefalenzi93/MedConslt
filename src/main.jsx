import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// تحميل i18n بشكل آمن
import('./i18n/config.js').catch(error => {
  console.warn('i18n config failed to load:', error)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
