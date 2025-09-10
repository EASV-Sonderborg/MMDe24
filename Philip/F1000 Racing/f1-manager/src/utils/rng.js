// Simple LCG for reproducible randomness
const A = 1664525
const C = 1013904223
const M = 2 ** 32

export function rng(seed = 123456789) {
  let s = seed >>> 0
  return {
    next() { s = (A * s + C) % M; return s / M },
    randRange(min, max) { return min + (max - min) * this.next() },
    get state() { return s },
    set state(v) { s = (v >>> 0) },
  }
}

// Pure helpers for reducer-friendly stepping
export function nextRandom(state) {
  const s = (A * (state >>> 0) + C) % M
  return { state: s >>> 0, value: s / M }
}

export function randRange(state, min, max) {
  const { state: s, value } = nextRandom(state)
  return { state: s, value: min + (max - min) * value }
}

// Alias as requested
export const fakerng = rng
