import React from 'react'
import { useGame } from '../state/gameContext.jsx'
import { actions } from '../state/actions'
import QualiTable from '../components/QualiTable.jsx'
import RaceTable from '../components/RaceTable.jsx'
import EventModal from '../components/EventModal.jsx'
import ControlBar from '../components/ControlBar.jsx'

export default function Weekend({ view }) {
  const { state, dispatch } = useGame()
  const track = state.calendar[state.seasonIndex]
  const startRace = () => dispatch({ type: actions.startRace })
  const finish = () => dispatch({ type: actions.finishRace })
  const resetSeed = () => dispatch({ type: actions.setSeed, seed: state.seed })
  const showEvent = state.phase === 'race' && state.race.nextEventIdx > 0 && !state.race.isRunning

  return (
    <div className="container grid" style={{ gap: 12 }}>
      <div className="panel">
        <div className="row">
          <div style={{ fontWeight: 700 }}>{track.name}</div>
          <div className="spacer" />
          <div className="tag">Laps {track.laps} · Bonus {track.bonus}</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <QualiTable entries={state.qualiGrid} />
        <RaceTable runners={state.race.runners} overtakeFlash={state.race.overtakeFlash} />
      </div>

      {state.phase === 'race' && (
        <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={() => dispatch({ type: actions.pauseRace })}>Pause</button>
          <button className="btn" onClick={() => dispatch({ type: actions.resumeRace })}>Fortsæt</button>
          <button className="btn primary" onClick={finish}>Afslut race</button>
        </div>
      )}

      <ControlBar onResetSeed={resetSeed} />

      {showEvent && <EventModal />}
    </div>
  )
}
