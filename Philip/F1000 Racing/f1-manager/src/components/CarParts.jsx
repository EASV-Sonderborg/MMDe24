import React from 'react'
import { bodyLevels, engineLevels, engineTunePrice } from '../data/parts'
import { useGame } from '../state/gameContext.jsx'
import { actions } from '../state/actions'
import { formatMoney } from '../utils/format'

export default function CarParts({ available = 0 }) {
  const { state, dispatch } = useGame()
  const player = state.teams.find(t => t.id === state.playerTeamId)

  const setLevel = (part, level, price) => {
    if (available < price && level !== player.car[part === 'engine' ? 'engineLevel' : 'bodyLevel']) return
    dispatch({ type: actions.setPartLevel, teamId: player.id, part, level })
  }

  const toggleTune = () => {
    const price = engineTunePrice(player.car.engineLevel)
    if (player.car.engineTuned) { dispatch({ type: actions.toggleEngineTune, teamId: player.id }); return }
    if (available < price) return
    dispatch({ type: actions.toggleEngineTune, teamId: player.id })
  }

  return (
    <div className="panel">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Bildele</div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="panel" style={{ background: '#0f1426' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Engine</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {engineLevels.map(l => {
              const isCurrent = player.car.engineLevel === l.level
              const disabled = !isCurrent && available < l.price
              return (
                <button key={l.level} className={`btn ${isCurrent ? 'primary' : ''}`} disabled={disabled} onClick={() => setLevel('engine', l.level, l.price)}>
                  L{l.level}<br/><span className="tag">{formatMoney(l.price)}</span>
                </button>
              )
            })}
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <button className={`btn ${player.car.engineTuned ? 'primary' : ''}`} onClick={toggleTune}>
              {player.car.engineTuned ? 'Reliability tuned' : `Tune reliability (${formatMoney(engineTunePrice(player.car.engineLevel))})`}
            </button>
            <div className="tag">Durability-regel: Max L1 &gt; base L2, men &lt; base L3</div>
          </div>
        </div>
        <div className="panel" style={{ background: '#0f1426' }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Body</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {bodyLevels.map(l => {
              const isCurrent = player.car.bodyLevel === l.level
              const disabled = !isCurrent && available < l.price
              return (
                <button key={l.level} className={`btn ${isCurrent ? 'primary' : ''}`} disabled={disabled} onClick={() => setLevel('body', l.level, l.price)}>
                  L{l.level}<br/><span className="tag">{formatMoney(l.price)}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
