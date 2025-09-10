import React from 'react'
import { useGame } from '../state/gameContext.jsx'
import { actions } from '../state/actions'
import TeamCard from '../components/TeamCard.jsx'

export default function Summary() {
  const { state, dispatch } = useGame()
  const player = state.teams.find(t => t.id === state.playerTeamId)
  const next = () => dispatch({ type: actions.nextRound })

  const board = [...state.teams].sort((a,b) => b.points - a.points)
  return (
    <div className="container grid" style={{ gap: 12 }}>
      <div className="panel">
        <div style={{ fontWeight: 700 }}>Sæsonoversigt</div>
        <div className="tag">Points og økonomi efter løbet</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="panel" style={{ background: '#0f1426' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Stilling (teams)</div>
          {board.map((t, i) => (
            <div key={t.id} className="row" style={{ marginBottom: 6 }}>
              <div style={{ width: 28 }}>{i+1}.</div>
              <div style={{ fontWeight: 600 }}>{t.name}</div>
              <div className="spacer" />
              <div className="tag">{t.points} pts</div>
            </div>
          ))}
        </div>
        <TeamCard team={player} />
      </div>
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn primary" onClick={next}>Næste løb</button>
      </div>
    </div>
  )
}

