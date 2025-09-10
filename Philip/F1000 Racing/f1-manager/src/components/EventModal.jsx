import React from 'react'
import ProgressBar from './ProgressBar.jsx'
import { useGame } from '../state/gameContext.jsx'
import { actions } from '../state/actions'

export default function EventModal() {
  const { state, dispatch } = useGame()
  const idx = state.race.nextEventIdx - 1
  const event = state.race.eventsQueue[idx]
  if (!event) return null
  const track = state.calendar[state.seasonIndex]
  const runners = state.race.runners
  const sorted = [...runners].sort((a,b) => a.totalTime - b.totalTime)
  const playerPos = sorted.findIndex(r => r.teamId === state.playerTeamId) + 1
  const leaderLap = Math.max(...runners.map(r => r.currentLap))
  const progress = Math.min(1, leaderLap / track.laps)

  const applyChoice = (choice) => {
    // mark player's drivers
    const withFlag = runners.map(r => ({ ...r, isPlayer: r.teamId === state.playerTeamId, teamDurability: getPlayerDurability(state, r.teamId) }))
    const updated = withFlag
    dispatch({ type: actions.applyEventChoice, choice, runners: updated })
  }

  function getPlayerDurability(state, teamId) {
    const t = state.teams.find(t => t.id === teamId)
    return t?.car?.durability || 90
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
      <div className="panel" style={{ width: 'min(560px, 92vw)', background: '#12182a', border: '1px solid #2b3350' }}>
        <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>{event.title}</div>
        <div className="tag" style={{ marginBottom: 12 }}>{event.text}</div>
        <div className="row" style={{ gap: 8, marginBottom: 12 }}>
          {event.options.map(opt => (
            <button key={opt.id} className="btn" onClick={() => applyChoice(opt)}>{opt.label}</button>
          ))}
        </div>
        <div className="row" style={{ gap: 12, alignItems: 'center' }}>
          <div className="tag">Din placering: P{playerPos || '-'}</div>
          <div className="spacer" />
          <div className="tag">Omgang {leaderLap} / {track.laps}</div>
        </div>
        <ProgressBar progress={progress} />
      </div>
    </div>
  )
}

