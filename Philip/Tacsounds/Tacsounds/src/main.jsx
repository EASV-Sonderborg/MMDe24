import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './components/audioplayer.css'
import App from './App.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AudioPlayer />
  </StrictMode>,
)
