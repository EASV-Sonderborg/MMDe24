export function formatTime(seconds) {
  const s = Math.max(0, seconds)
  const m = Math.floor(s / 60)
  const r = s - m * 60
  return m > 0 ? `${m}:${r.toFixed(3).padStart(6, '0')}` : r.toFixed(3)
}

export function formatMoney(millions) {
  return `${millions.toFixed(1)} mio`
}

