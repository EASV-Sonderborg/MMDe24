import React, { useMemo } from 'react'
import styles from './RaceTable.module.css'

export default function RaceTable({ runners, overtakeFlash }) {
  const rows = useMemo(() => {
    const sorted = [...runners].sort((a,b) => a.totalTime - b.totalTime)
    return sorted.map((r, i) => ({ ...r, pos: i+1 }))
  }, [runners])
  return (
    <div className="panel">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Race</div>
      <table className="table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Team</th>
            <th>Lap</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const cls = overtakeFlash[r.id] === 'up' ? styles.movedUp : overtakeFlash[r.id] === 'down' ? styles.movedDown : ''
            return (
              <tr key={r.id} className={`tr ${cls}`}>
                <td>{r.pos}</td>
                <td>{r.driverName}</td>
                <td className="tag">{r.teamName}</td>
                <td>{r.currentLap}</td>
                <td className="tag">{r.totalTime.toFixed(3)} s</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
