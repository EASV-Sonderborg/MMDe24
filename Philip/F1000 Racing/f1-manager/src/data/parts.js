// Engine and Body levels (1..5) with prices and stats
// Engine contributes to car.speed and car.durability
// Body contributes to car.aero
// Durability rule: a tuned (max) L1 has better durability than a base (untuned) L2, but worse than base L3.

export const engineLevels = [
  { level: 1, price: 20, speed: 74, baseDurability: 84, tunedDurability: 90 },
  { level: 2, price: 30, speed: 78, baseDurability: 88, tunedDurability: 94 },
  { level: 3, price: 42, speed: 82, baseDurability: 92, tunedDurability: 96 },
  { level: 4, price: 56, speed: 86, baseDurability: 95, tunedDurability: 98 },
  { level: 5, price: 72, speed: 90, baseDurability: 97, tunedDurability: 99 },
]

export const engineTunePrice = level => Math.round((level + 2) * 2.5) // 8–18 mio approx

export const bodyLevels = [
  { level: 1, price: 16, aero: 76 },
  { level: 2, price: 24, aero: 80 },
  { level: 3, price: 33, aero: 84 },
  { level: 4, price: 44, aero: 88 },
  { level: 5, price: 56, aero: 92 },
]

export function getEngineLevel(level) {
  return engineLevels.find(l => l.level === level) || engineLevels[0]
}

export function getBodyLevel(level) {
  return bodyLevels.find(l => l.level === level) || bodyLevels[0]
}

