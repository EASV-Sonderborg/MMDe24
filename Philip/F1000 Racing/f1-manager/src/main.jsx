import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GameProvider } from './state/gameContext.jsx'
import './styles/variables.css'
import './styles/globals.css'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
)

