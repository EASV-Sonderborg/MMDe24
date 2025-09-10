import React from 'react'
import logo from '../assets/logo.svg'
import BudgetPill from './BudgetPill.jsx'
import { useGame } from '../state/gameContext.jsx'

export default function Header() {
  const { state } = useGame()
  const player = state.teams.find(t => t.id === state.playerTeamId)
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'linear-gradient(180deg, rgba(15,19,32,0.96), rgba(15,19,32,0.7))', backdropFilter: 'blur(6px)' }}>
      <div className="container row" style={{ padding: '10px 16px' }}>
        <img src={logo} width="140" height="40" alt="Fisker Racing" />
        <div className="spacer" />
        <div className="tag">Fisker Racing – F1 Manager</div>
        <BudgetPill amount={player?.budget ?? state.budget} />
      </div>
    </header>
  )
}

