import React from 'react'

export default function ProgressBar({ progress }) {
  return (
    <div className="progressOuter" style={{ marginTop: 8 }}>
      <div className="progressInner" style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} />
    </div>
  )
}

