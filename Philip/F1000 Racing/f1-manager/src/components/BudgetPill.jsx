import React from 'react'
import { formatMoney } from '../utils/format'

export default function BudgetPill({ amount }) {
  return (
    <div style={{ background: '#0f1426', border: '1px solid #2b3350', color: 'var(--text)', borderRadius: 999, padding: '6px 12px', fontWeight: 600 }}>
      Budget: {formatMoney(amount || 0)}
    </div>
  )
}

