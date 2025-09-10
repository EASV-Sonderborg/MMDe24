import React, { useMemo, useState } from 'react'
import { allDrivers } from '../data/drivers'
import { useGame } from '../state/gameContext.jsx'

export default function DriverPicker({ selected, onChange, budget }) {
  const [filter, setFilter] = useState('ALL')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    return allDrivers
      .filter(d => filter === 'ALL' || d.series === filter)
      .filter(d => d.name.toLowerCase().includes(q.toLowerCase()))
  }, [filter, q])

  const toggle = (id, price) => {
    let next = [...selected]
    if (next.includes(id)) next = next.filter(x => x !== id)
    else {
      if (next.length >= 2) return
      const remaining = budget - price
      if (remaining < 0) return
      next.push(id)
    }
    onChange(next)
  }

  return (
    <div className="panel">
      <div className="row" style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700 }}>Vælg 2 kørere</div>
        <div className="spacer" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="btn ghost" style={{ padding: 6 }}>
          <option value="ALL">Alle</option>
          <option value="F1">F1</option>
          <option value="F2">F2</option>
          <option value="IndyCar">IndyCar</option>
        </select>
        <input className="btn ghost" placeholder="Søg" value={q} onChange={e => setQ(e.target.value)} style={{ padding: 6 }} />
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 8 }}>
        {list.map(d => {
          const active = selected.includes(d.id)
          const affordable = (budget || 0) >= d.price || active
          const disabled = !active && (selected.length >= 2 || !affordable)
          return (
            <div key={d.id} className="panel row" style={{ alignItems: 'center', background: '#0f1426', opacity: disabled ? 0.6 : 1 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{d.name}</div>
                <div className="tag">{d.series} · {d.age} år</div>
              </div>
              <div className="spacer" />
              <div className="tag">Pris: {d.price} mio</div>
              <button className={`btn ${active ? 'primary' : ''}`} onClick={() => toggle(d.id, d.price)} disabled={disabled}>
                {active ? 'Valgt' : 'Vælg'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
