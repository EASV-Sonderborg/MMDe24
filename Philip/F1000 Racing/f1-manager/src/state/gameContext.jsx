import React, { createContext, useContext, useMemo, useReducer, useEffect, useRef } from 'react'
import { actions } from './actions'
import { tracks as allTracks } from '../data/tracks'
import { allDrivers, f1Drivers, f2Drivers, indyDrivers } from '../data/drivers'
import { getEngineLevel, getBodyLevel, engineTunePrice } from '../data/parts'
import { rng as makeRng } from '../utils/rng'
import { runQuali, initRace, tick as simTick, buildEvents, applyEventChoice as applyEvent, reliabilityCheck } from '../utils/simEngine'

const GameContext = createContext(null)

const defaultTeamColors = { primary: '#ff6a00', secondary: '#1f2a44' }

function createAiTeams(seed) {
  const r = makeRng(seed)
  const taken = new Set(['kevin-magnussen', 'frederik-vesti'])
  const pool = allDrivers.filter(d => !taken.has(d.id))
  const names = [
    'Apex Velocity', 'Silver Arrowhead', 'Crimson Vortex', 'Blue Comet', 'Emerald Edge',
    'Zenith GP', 'Orion Motorsport', 'Nimbus Racing', 'Artemis Speedworks', 'Thunderline'
  ]
  const teams = []
  for (let i = 0; i < 10; i++) {
    const d1 = pool.splice(Math.floor(r.next() * pool.length), 1)[0]
    const d2 = pool.splice(Math.floor(r.next() * pool.length), 1)[0]
    const engineLevel = 2 + Math.floor(r.next() * 2)
    const bodyLevel = 2 + Math.floor(r.next() * 2)
    const tuned = r.next() > 0.6
    const e = getEngineLevel(engineLevel)
    const b = getBodyLevel(bodyLevel)
    const durability = tuned ? e.tunedDurability : e.baseDurability
    teams.push({
      id: `ai-${i}`,
      name: names[i],
      colors: { primary: '#3c78ff', secondary: '#0d1326' },
      drivers: [d1.id, d2.id],
      car: {
        speed: e.speed,
        aero: b.aero,
        durability,
        engineLevel,
        bodyLevel,
        engineTuned: tuned
      },
      points: 0,
      budget: 0,
    })
  }
  return teams
}

const initialState = (seed = 12345) => ({
  seed,
  budget: 100.0,
  seasonIndex: 0,
  calendar: allTracks,
  teams: [
    {
      id: 'fisker',
      name: 'Fisker Racing',
      colors: defaultTeamColors,
      drivers: ['kevin-magnussen', 'frederik-vesti'],
      car: {
        speed: getEngineLevel(1).speed,
        aero: getBodyLevel(1).aero,
        durability: getEngineLevel(1).baseDurability,
        engineLevel: 1,
        bodyLevel: 1,
        engineTuned: false,
      },
      points: 0,
      budget: 100.0,
      isPlayer: true,
    },
    ...createAiTeams(seed)
  ],
  playerTeamId: 'fisker',
  phase: 'setup',
  qualiGrid: [],
  race: {
    runners: [],
    isRunning: false,
    tickMs: 250,
    lastTick: 0,
    eventsQueue: [],
    nextEventIdx: 0,
    overtakeFlash: {},
    rngS: 0,
  },
})

function reducer(state, action) {
  switch (action.type) {
    case actions.setDrivers: {
      const { teamId, drivers } = action
      return {
        ...state,
        teams: state.teams.map(t => t.id === teamId ? { ...t, drivers } : t)
      }
    }
    case actions.setPartLevel: {
      const { teamId, part, level } = action
      return {
        ...state,
        teams: state.teams.map(t => {
          if (t.id !== teamId) return t
          if (part === 'engine') {
            const e = getEngineLevel(level)
            const durability = t.car.engineTuned ? e.tunedDurability : e.baseDurability
            return { ...t, car: { ...t.car, engineLevel: level, speed: e.speed, durability } }
          }
          if (part === 'body') {
            const b = getBodyLevel(level)
            return { ...t, car: { ...t.car, bodyLevel: level, aero: b.aero } }
          }
          return t
        })
      }
    }
    case actions.toggleEngineTune: {
      const { teamId } = action
      return {
        ...state,
        teams: state.teams.map(t => {
          if (t.id !== teamId) return t
          const e = getEngineLevel(t.car.engineLevel)
          const engineTuned = !t.car.engineTuned
          const durability = engineTuned ? e.tunedDurability : e.baseDurability
          return { ...t, car: { ...t.car, engineTuned, durability } }
        })
      }
    }
    case actions.setPlayerBudget: {
      const { amount } = action
      return {
        ...state,
        teams: state.teams.map(t => t.id === state.playerTeamId ? { ...t, budget: amount } : t)
      }
    }
    case actions.setSeed: {
      return { ...initialState(action.seed) }
    }
    case actions.startQuali: {
      const track = state.calendar[state.seasonIndex]
      const grid = runQuali(state.teams, track, state.seed)
      return { ...state, phase: 'quali', qualiGrid: grid }
    }
    case actions.setQualiResults: {
      return { ...state, qualiGrid: action.grid }
    }
    case actions.startRace: {
      const track = state.calendar[state.seasonIndex]
      const runners = initRace(state.qualiGrid, state.teams, track, state.seed)
      const eventsQueue = buildEvents(track, state.seed)
      const rngS = (state.seed ^ (state.seasonIndex + 1) * 1337) >>> 0
      return {
        ...state,
        phase: 'race',
        race: { ...state.race, runners, isRunning: true, lastTick: performance.now(), eventsQueue, nextEventIdx: 0, overtakeFlash: {}, rngS }
      }
    }
    case actions.resumeRace: {
      if (state.phase !== 'race') return state
      return { ...state, race: { ...state.race, isRunning: true, lastTick: performance.now() } }
    }
    case actions.pauseRace: {
      return { ...state, race: { ...state.race, isRunning: false } }
    }
    case actions.tickRace: {
      const { now } = action
      const dt = Math.min(500, now - state.race.lastTick)
      const track = state.calendar[state.seasonIndex]
      const { runners, overtakes, seed: s1 } = simTick(state.race.runners, dt, track, state.race.rngS)
      const overtakeFlash = {}
      overtakes.forEach(({ id, dir }) => { overtakeFlash[id] = dir })

      // Event trigger check
      let nextEventIdx = state.race.nextEventIdx
      let isRunning = state.race.isRunning
      const eventsQueue = state.race.eventsQueue
      const totalLaps = track.laps
      const avgLap = runners.reduce((a, r) => a + r.currentLap, 0) / runners.length
      const progress = avgLap / totalLaps
      if (nextEventIdx < eventsQueue.length) {
        const evt = eventsQueue[nextEventIdx]
        if (progress >= evt.triggerProgress) {
          isRunning = false
          nextEventIdx += 1
        }
      }

      // Reliability checks every few laps
      const rel = reliabilityCheck(runners, track, s1)

      // Auto-stop when race distance completed
      const finished = rel.runners.some(r => r.currentLap >= track.laps)
      if (finished) {
        isRunning = false
      }

      return {
        ...state,
        race: { ...state.race, runners: rel.runners, lastTick: now, isRunning, nextEventIdx, overtakeFlash, rngS: rel.seed }
      }
    }
    case actions.applyEventChoice: {
      const { choice } = action
      // annotate runners with isPlayer + durability per team
      const runnersWithFlags = state.race.runners.map(r => {
        const team = state.teams.find(t => t.id === r.teamId)
        return { ...r, isPlayer: team?.isPlayer || false, teamDurability: team?.car?.durability || 90 }
      })
      const runners = applyEvent(runnersWithFlags, choice)
      return { ...state, race: { ...state.race, runners, isRunning: true } }
    }
    case actions.finishRace: {
      // Award points and prize money
      const track = state.calendar[state.seasonIndex]
      const runners = [...state.race.runners].sort((a,b) => a.totalTime - b.totalTime)
      const pointsTable = [25,18,15,12,10,8,6,4,2,1]
      const prizeBase = [8,7,6,5,4,3,2.5,2,1.5,1]
      const teamPoints = {}
      const teamBudget = {}
      runners.forEach((r, idx) => {
        const pts = pointsTable[idx] || 0
        teamPoints[r.teamId] = (teamPoints[r.teamId]||0) + pts
        const prize = (prizeBase[idx] || 0.6) * 2.0 // in mio
        teamBudget[r.teamId] = (teamBudget[r.teamId]||0) + prize
      })
      const newTeams = state.teams.map(t => ({
        ...t,
        points: t.points + (teamPoints[t.id] || 0),
        budget: (t.budget || 0) + (teamBudget[t.id] || 0)
      }))
      return { ...state, teams: newTeams, phase: 'summary' }
    }
    case actions.nextRound: {
      const next = state.seasonIndex + 1
      const ended = next >= state.calendar.length
      return { ...state, seasonIndex: ended ? 0 : next, qualiGrid: [], race: { ...state.race, runners: [], isRunning: false, nextEventIdx: 0 }, phase: ended ? 'setup' : 'quali' }
    }
    case actions.reset: {
      return { ...initialState(state.seed) }
    }
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(12345))
  const rafRef = useRef(null)

  useEffect(() => {
    if (!state.race.isRunning || state.phase !== 'race') return
    let mounted = true
    const loop = (t) => {
      if (!mounted) return
      dispatch({ type: actions.tickRace, now: performance.now() })
      rafRef.current = setTimeout(() => loop(), state.race.tickMs)
    }
    loop()
    return () => { mounted = false; if (rafRef.current) clearTimeout(rafRef.current) }
  }, [state.race.isRunning, state.race.tickMs, state.phase])

  const value = useMemo(() => ({ state, dispatch, allDrivers, f1Drivers, f2Drivers, indyDrivers }), [state])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
