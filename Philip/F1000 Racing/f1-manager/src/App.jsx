import React from 'react'
import Header from './components/Header.jsx'
import Setup from './pages/Setup.jsx'
import Weekend from './pages/Weekend.jsx'
import Summary from './pages/Summary.jsx'
import ControlBar from './components/ControlBar.jsx'
import { useGame } from './state/gameContext.jsx'

export default function App() {
  const { state } = useGame()
  const resetSeed = () => {
    // Reset to default seed
    // Note: full state resets to fresh season
    window?.scrollTo?.(0,0)
  }
  return (
    <div>
      <Header />
      {state.phase === 'setup' && <Setup />}
      {state.phase === 'quali' && <Weekend view="quali" />}
      {state.phase === 'race' && <Weekend view="race" />}
      {state.phase === 'summary' && <Summary />}
      <ControlBar onResetSeed={() => { /* handled in Setup's seed panel */ }} />
    </div>
  )
}
