import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/audioplayer.css'
import Home from './components/Home.jsx'

import AudioPlayerShell from './components/AudioPlayerShell.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <Home>
    <AudioPlayerShell/>
    </Home>

  </StrictMode>,
)
