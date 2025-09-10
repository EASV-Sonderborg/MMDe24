import React from 'react'
import { useGame } from '../state/gameContext.jsx'

export default function TrackCalendar() {
  const { state } = useGame()
  const current = state.seasonIndex
  return (
    <div className="panel">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Sæsonkalender</div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {state.calendar.map((t, i) => (
          <div key={t.key} className="panel" style={{ background: '#0f1426', border: i === current ? '2px solid var(--accent)' : '1px solid #2b3350' }}>
            <div style={{ fontWeight: 600 }}>{i+1}. {t.name}</div>
            <div className="tag">Laps {t.laps} · Bonus: {t.bonus}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

