import React from 'react'
import ReactDOM from 'react-dom/client'
import SimpleApp from './SimpleApp.jsx'
import './index.css'

console.log('🚀 Starting Medical Consultation Platform...')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleApp />
  </React.StrictMode>,
)

console.log('✅ App mounted successfully on Netlify!')
