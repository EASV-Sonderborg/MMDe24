import React, { useEffect, useState } from 'react'

export default function Toast({ message, duration = 1800 }) {
  const [show, setShow] = useState(Boolean(message))
  useEffect(() => {
    if (!message) return
    setShow(true)
    const t = setTimeout(() => setShow(false), duration)
    return () => clearTimeout(t)
  }, [message, duration])
  if (!show) return null
  return (
    <div style={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', background: '#101426', color: 'var(--text)', border: '1px solid #2b3350', padding: '10px 14px', borderRadius: 8, boxShadow: 'var(--shadow)', zIndex: 30 }}>
      {message}
    </div>
  )
}

