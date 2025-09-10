import React, { useMemo, useState } from 'react'
import { allDrivers } from '../data/drivers'
import { useGame } from '../state/gameContext.jsx'
import { actions } from '../state/actions'
import TeamCard from '../components/TeamCard.jsx'
import DriverPicker from '../components/DriverPicker.jsx'
import CarParts from '../components/CarParts.jsx'
import TrackCalendar from '../components/TrackCalendar.jsx'

export default function Setup() {
  const { state, dispatch } = useGame()
  const player = state.teams.find(t => t.id === state.playerTeamId)
  const [seedInput, setSeedInput] = useState(state.seed)

  const costs = useMemo(() => {
    const d1 = allDrivers.find(d => d.id === player.drivers[0])
    const d2 = allDrivers.find(d => d.id === player.drivers[1])
    const driversCost = (d1?.price || 0) + (d2?.price || 0)
    const engineCost = player.car.engineLevel ? (player.car.engineLevel === 1 ? 20 : player.car.engineLevel === 2 ? 30 : player.car.engineLevel === 3 ? 42 : player.car.engineLevel === 4 ? 56 : 72) : 0
    const bodyCost = player.car.bodyLevel ? (player.car.bodyLevel === 1 ? 16 : player.car.bodyLevel === 2 ? 24 : player.car.bodyLevel === 3 ? 33 : player.car.bodyLevel === 4 ? 44 : 56) : 0
    const tuneCost = player.car.engineTuned ? Math.round((player.car.engineLevel + 2) * 2.5) : 0
    const total = driversCost + engineCost + bodyCost + tuneCost
    const remaining = Math.max(0, 100.0 - total)
    return { driversCost, engineCost, bodyCost, tuneCost, total, remaining }
  }, [player])

  const teamRating = useMemo(() => {
    const score = (id) => {
      const d = allDrivers.find(x => x.id === id)
      return d ? (0.4*d.stats.speed + 0.3*d.stats.cornering + 0.2*d.stats.overtaking + 0.1*d.stats.experience) : 0
    }
    const drivers = (player.drivers||[]).map(score)
    const car = 0.45*player.car.speed + 0.40*player.car.aero
    return Math.round((drivers[0] + drivers[1] + car) / 3)
  }, [player])

  const onPick = (drivers) => {
    dispatch({ type: actions.setDrivers, teamId: player.id, drivers })
  }

  const startQuali = () => {
    dispatch({ type: actions.setPlayerBudget, amount: costs.remaining })
    dispatch({ type: actions.startQuali })
  }
  const resetSeed = () => dispatch({ type: actions.setSeed, seed: Number(seedInput)||12345 })

  return (
    <div className="container grid" style={{ gap: 12 }}>
      <div className="grid grid-cols-2">
        <TeamCard team={player} />
        <div className="panel">
          <div className="row" style={{ marginBottom: 8 }}>
            <div>
              <div style={{ fontWeight: 700 }}>Seed</div>
              <div className="tag">Brug et seed for reproducerbare løb</div>
            </div>
            <div className="spacer" />
            <input className="btn ghost" value={seedInput} onChange={e => setSeedInput(e.target.value)} style={{ width: 120 }} />
            <button className="btn" onClick={resetSeed}>Nulstil seed</button>
          </div>
          <div className="panel" style={{ background: '#0f1426' }}>
            <div className="row">
              <div>Team rating</div>
              <div className="spacer" />
              <div style={{ fontWeight: 700 }}>{teamRating}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ background: '#0f1426' }}>
        <div className="row" style={{ fontWeight: 700 }}>
          <div>Startbudget: 100.0 mio</div>
          <div className="spacer" />
          <div>Tilbage: {costs.remaining.toFixed(1)} mio</div>
        </div>
        <div className="tag">Drivers: {costs.driversCost.toFixed(1)} · Engine: {costs.engineCost.toFixed(1)} · Body: {costs.bodyCost.toFixed(1)} · Tune: {costs.tuneCost.toFixed(1)}</div>
      </div>

      <DriverPicker selected={player.drivers} onChange={onPick} budget={costs.remaining} />
      <CarParts available={costs.remaining} />
      <TrackCalendar />

      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button className="btn primary" onClick={startQuali}>Fortsæt til kval</button>
      </div>
    </div>
  )
}
