import React from 'react'
import { useGame } from '../state/gameContext.jsx'
import { actions } from '../state/actions'

export default function ControlBar({ onResetSeed }) {
  const { state, dispatch } = useGame()
  const startOrResume = () => {
    if (state.phase !== 'race' || state.race.runners.length === 0) dispatch({ type: actions.startRace })
    else dispatch({ type: actions.resumeRace })
  }
  return (
    <div className="sticky-bottom">
      <div className="container row" style={{ gap: 8 }}>
        <button className="btn" onClick={() => dispatch({ type: actions.startQuali })}>Kør kval</button>
        <button className="btn primary" onClick={startOrResume}>Start race</button>
        <button className="btn" onClick={() => dispatch({ type: actions.pauseRace })}>Pause</button>
        <button className="btn ghost" onClick={() => (onResetSeed ? onResetSeed() : dispatch({ type: actions.setSeed, seed: 12345 }))}>Nulstil seed</button>
        <button className="btn" onClick={() => dispatch({ type: actions.nextRound })}>Næste løb</button>
        <div className="spacer" />
        <div className="tag">Tick {state.race.tickMs} ms</div>
      </div>
    </div>
  )
}
