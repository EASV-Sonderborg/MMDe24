import { rng as makeRng, nextRandom } from './rng'
import { formatTime } from './format'
import { allDrivers } from '../data/drivers'

function getDriverById(id) { return allDrivers.find(d => d.id === id) }

function driverScore(stats) {
  return 0.40 * stats.speed + 0.30 * stats.cornering + 0.20 * stats.overtaking + 0.10 * stats.experience
}

function carContribution(car) {
  return 0.45 * car.speed + 0.40 * car.aero
}

function trackBonus(statValue, factor) {
  return (statValue * (factor - 1))
}

export function runQuali(teams, track, seed = 12345) {
  const r = makeRng(seed + track.key.length)
  const entries = []
  teams.forEach(team => {
    team.drivers.forEach(driverId => {
      const d = getDriverById(driverId)
      const base = driverScore(d.stats) + carContribution(team.car)
      const bonusStat = d.stats[track.bonus] || 0
      const bonus = trackBonus(bonusStat, track.factor) * 0.6
      const qualiScore = base + bonus
      const noise = r.randRange(-0.5, 0.5)
      const time = track.baseLap - (qualiScore * 0.05) + noise
      entries.push({ id: `${team.id}-${driverId}`, driverId, driverName: d.name, teamId: team.id, teamName: team.name, time, timeText: formatTime(time) })
    })
  })
  entries.sort((a, b) => a.time - b.time)
  return entries.map((e, i) => ({ ...e, position: i + 1 }))
}

export function initRace(qualiGrid, teams, track, seed = 12345) {
  const r = makeRng(seed ^ track.laps)
  const runners = qualiGrid.map((q, idx) => {
    const team = teams.find(t => t.id === q.teamId)
    const d = getDriverById(q.driverId)
    const basePace = (driverScore(d.stats) + carContribution(team.car) + trackBonus(d.stats[track.bonus] || 0, track.factor) * 0.10 * track.laps)
    return {
      id: q.id,
      driverId: q.driverId,
      driverName: q.driverName,
      teamId: q.teamId,
      teamName: q.teamName,
      isPlayer: team?.isPlayer || false,
      currentLap: 0,
      totalTime: idx * 0.12, // small spacing on grid
      basePace,
      modifiers: { fixed: 0, perLap: 0, untilLap: 0 },
      partialLap: 0,
      lastOvertakeDir: 0,
      teamDurability: team?.car?.durability || 90,
      retired: false,
    }
  })
  return runners
}

export function tick(runners, dtMs, track, seed = 12345) {
  const dt = dtMs / 1000
  const overtakeEvents = []
  const totalLaps = track.laps
  let rngState = seed >>> 0
  const updated = runners.map(r => {
    if (r.retired) return r
    // Estimate current lap time
    const paceK = 0.008 // scaling constant
    const expectedLap = Math.max(55, track.baseLap - r.basePace * paceK + (r.modifiers.perLap || 0))
    const desiredLapDuration = Math.max(0.25, 60 / totalLaps) // compress whole race to ~60s
    const lapProgressInc = dt / desiredLapDuration
    let partialLap = r.partialLap + lapProgressInc
    let currentLap = r.currentLap
    let totalTime = r.totalTime
    let untilLap = r.modifiers.untilLap || 0
    let fixed = r.modifiers.fixed || 0
    let perLap = r.modifiers.perLap || 0

    if (partialLap >= 1) {
      // Complete lap
      partialLap -= 1
      currentLap += 1
      let lapTime = expectedLap + (fixed || 0)
      totalTime += lapTime
      if (untilLap > 0 && currentLap >= untilLap) {
        fixed = 0; perLap = 0; untilLap = 0
      }
    }
    return { ...r, currentLap, totalTime, partialLap, modifiers: { fixed, perLap, untilLap } }
  })

  // Sort and handle overtakes
  updated.sort((a, b) => a.totalTime - b.totalTime)
  for (let i = 1; i < updated.length; i++) {
    const prev = updated[i - 1]
    const cur = updated[i]
    const gap = cur.totalTime - prev.totalTime
    const threshold = 0.35
    if (gap < threshold && !cur.retired && !prev.retired) {
      // Overtake check
      const dCur = getDriverById(cur.driverId)
      const dPrev = getDriverById(prev.driverId)
      const attack = dCur.stats.overtaking
      const defend = (dPrev.stats.cornering + dPrev.stats.experience * 0.6)
      const chance = 0.52 + (attack - defend) / 300
      const step = nextRandom(rngState); rngState = step.state
      if (step.value < chance) {
        // swap with small time adjustments
        const gain = 0.06
        updated[i] = prev
        updated[i - 1] = cur
        updated[i - 1].totalTime -= gain
        updated[i].totalTime += gain
        updated[i - 1].lastOvertakeDir = 1
        updated[i].lastOvertakeDir = -1
        overtakeEvents.push({ id: cur.id, dir: 'up' })
      }
    }
  }

  // Finish check – if leader completed totalLaps
  const leader = updated[0]
  if (leader.currentLap >= totalLaps) {
    // Lock progress
    updated.forEach(r => { r.partialLap = 0 })
  }

  return { runners: updated, overtakes: overtakeEvents, seed: rngState }
}

export function buildEvents(track, seed = 12345) {
  const r = makeRng(seed + 999)
  const n = 2 + Math.floor(r.next() * 2) // 2–3
  const triggers = [0.25, 0.5, 0.75].slice(0, n).sort()
  return triggers.map((p, i) => ({
    key: `evt-${i}`,
    title: i === 0 ? 'Skyer trækker ind' : i === 1 ? 'Virtual Safety Car' : 'Små skader rapporteret',
    text: i === 0 ? 'Der er risiko for småregn i sektor 2.' : i === 1 ? 'Hastigheder reduceres midlertidigt.' : 'Frontvinge kan være kompromitteret.',
    triggerProgress: p,
    options: i === 0 ? [
      { id: 'pit_inters', label: 'Pit for inters (+12s) – stærk i vådt', effects: { fixed: 12, perLap: -0.25, durationLaps: Math.round(track.laps * 0.35) } },
      { id: 'stay_out', label: 'Bliv ude – risikabelt i vådt', effects: { fixed: 0, perLap: +0.35, durationLaps: Math.round(track.laps * 0.25) } },
    ] : i === 1 ? [
      { id: 'conserve', label: 'Conserve – lavere tempo, beskyt dæk (-0.05s/lap efter)', effects: { fixed: 0, perLap: -0.10, durationLaps: Math.round(track.laps * 0.1), afterBonus: -0.05, afterLaps: Math.round(track.laps * 0.15) } },
      { id: 'attack', label: 'Attack ved restart (+0.15s/lap nu, -0.15s efter)', effects: { fixed: 0, perLap: +0.15, durationLaps: Math.round(track.laps * 0.1), afterBonus: -0.15, afterLaps: Math.round(track.laps * 0.10) } },
    ] : [
      { id: 'wing_tweak', label: 'Juster vinge ved pit (+8s, -0.12s/lap)', effects: { fixed: 8, perLap: -0.12, durationLaps: Math.round(track.laps * 0.25) } },
      { id: 'ignore', label: 'Ignorer – risiko for tidstab', effects: { fixed: 0, perLap: +0.08, durationLaps: Math.round(track.laps * 0.25) } },
    ]
  }))
}

export function applyEventChoice(runners, choice) {
  // Apply to player's drivers only; assume team with isPlayer handled at call site by filtering
  const updated = runners.map(r => {
    if (r.isPlayer) {
      const untilLap = r.currentLap + (choice.effects.durationLaps || 0)
      const fixed = (choice.effects.fixed || 0)
      const perLap = (choice.effects.perLap || 0)
      return { ...r, modifiers: { fixed, perLap, untilLap } }
    }
    return r
  })
  // Simple after-effect: apply to all player's drivers later; we'll store it onto runner for future additive use
  if (choice.effects.afterBonus) {
    updated.forEach(r => {
      if (r.isPlayer) {
        const afterUntil = r.currentLap + (choice.effects.afterLaps || 0)
        // Chain by accumulating perLap after prior expires – approximate with adding to current perLap
        r.modifiers.perLap += choice.effects.afterBonus
        r.modifiers.untilLap = afterUntil
      }
    })
  }
  return updated
}

export function reliabilityCheck(runners, track, seed = 12345) {
  // Small chance for minor issues scaling with (100 - durability)
  let rngState = seed >>> 0
  const out = runners.map((r, idx) => {
    if (r.retired) return r
    const laps = r.currentLap
    if (laps > 0 && laps % Math.max(4, Math.floor(track.laps / 12)) === 0) {
      const teamDurability = r.teamDurability || 90
      const pMinor = (100 - teamDurability) / 180
      let step = nextRandom(rngState); rngState = step.state
      if (step.value < pMinor) {
        step = nextRandom(rngState); rngState = step.state
        r.totalTime += 8 + step.value * 10
      }
      const pMajor = (100 - teamDurability) / 800
      step = nextRandom(rngState); rngState = step.state
      if (step.value < pMajor) {
        step = nextRandom(rngState); rngState = step.state
        r.totalTime += 30 + step.value * 20
      }
    }
    return r
  })
  return { runners: out, seed: rngState }
}
