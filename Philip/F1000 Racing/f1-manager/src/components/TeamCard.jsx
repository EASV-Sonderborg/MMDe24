import React from 'react'
import { allDrivers } from '../data/drivers'

function StatBar({ label, val }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="row" style={{ fontSize: 12, color: 'var(--muted)' }}>
        <div style={{ width: 90 }}>{label}</div>
        <div>{val}</div>
      </div>
      <div className="progressOuter"><div className="progressInner" style={{ width: `${val}%` }} /></div>
    </div>
  )
}

export default function TeamCard({ team }) {
  const d1 = allDrivers.find(d => d.id === team.drivers[0])
  const d2 = allDrivers.find(d => d.id === team.drivers[1])
  return (
    <div className="panel" style={{ border: `2px solid ${team.colors?.primary || '#2b3350'}` }}>
      <div className="row" style={{ marginBottom: 8 }}>
        <div style={{ fontWeight: 700 }}>{team.name}</div>
        <div className="spacer" />
        <div className="tag">Engine L{team.car.engineLevel}{team.car.engineTuned ? ' • tuned' : ''} · Body L{team.car.bodyLevel}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Drivers</div>
          <div className="panel" style={{ background: '#0f1426' }}>
            <div style={{ fontWeight: 600 }}>{d1?.name}</div>
            <div className="row tag">Age {d1?.age} · {d1?.series}</div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <StatBar label="Speed" val={d1?.stats.speed||0} />
              <StatBar label="Overtake" val={d1?.stats.overtaking||0} />
              <StatBar label="Corner" val={d1?.stats.cornering||0} />
              <StatBar label="Exp" val={d1?.stats.experience||0} />
            </div>
          </div>
          <div className="panel" style={{ background: '#0f1426', marginTop: 8 }}>
            <div style={{ fontWeight: 600 }}>{d2?.name}</div>
            <div className="row tag">Age {d2?.age} · {d2?.series}</div>
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <StatBar label="Speed" val={d2?.stats.speed||0} />
              <StatBar label="Overtake" val={d2?.stats.overtaking||0} />
              <StatBar label="Corner" val={d2?.stats.cornering||0} />
              <StatBar label="Exp" val={d2?.stats.experience||0} />
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Car</div>
          <div className="panel" style={{ background: '#0f1426' }}>
            <StatBar label="Speed" val={team.car.speed} />
            <StatBar label="Aero" val={team.car.aero} />
            <StatBar label="Durability" val={team.car.durability} />
          </div>
        </div>
      </div>
    </div>
  )
}

