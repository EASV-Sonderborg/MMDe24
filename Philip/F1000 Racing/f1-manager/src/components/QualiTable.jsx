import React from 'react'
import { formatTime } from '../utils/format'

export default function QualiTable({ entries }) {
  return (
    <div className="panel">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Kvalifikationsresultater</div>
      <table className="table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Driver</th>
            <th>Team</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.id} className="tr">
              <td>{e.position}</td>
              <td>{e.driverName}</td>
              <td className="tag">{e.teamName}</td>
              <td>{formatTime(e.time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

