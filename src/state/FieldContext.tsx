import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import seed from '../data/field.json'
import {
  armySums,
  damp,
  FIELD_SPAN,
  FRONT_LAMBDA,
  MIN_INCREMENT,
  rankToZ,
  regimentWorldX,
  sizeFromBid,
  slotPrice,
  targetFront,
} from '../lib/economy'
import { tickerId } from '../lib/format'
import type { FieldData, Pulse, Side, Spot, TickerItem } from '../types'

const data = seed as FieldData

type FieldApi = {
  spots: Spot[]
  sums: { a: number; b: number }
  frontRef: MutableRefObject<number>
  frontUi: number
  targetP: number
  beatAt: number
  pulse: Pulse | null
  ownedSpotId: string | null
  selectedId: string | null
  ticker: TickerItem[]
  select: (id: string | null) => void
  placeBid: (id: string, who?: string) => boolean
  priceOf: (spot: Spot) => number
}

const FieldContext = createContext<FieldApi | null>(null)

function seedTicker(spots: Spot[]): TickerItem[] {
  return spots
    .slice()
    .sort((a, b) => b.bid - a.bid)
    .map((s) => ({
      id: `seed-${s.id}`,
      text: `${s.brand.name} holds ${s.spotName} · $${s.bid}`,
      tone: s.side === 'A' ? 'iron' : 'steel',
    }))
}

export function FieldProvider({ children }: { children: ReactNode }) {
  const [spots, setSpots] = useState<Spot[]>(() =>
    data.spots.map((s) => ({ ...s, history: [...s.history] })),
  )
  const [ownedSpotId, setOwnedSpotId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [frontUi, setFrontUi] = useState(0)
  const [beatAt, setBeatAt] = useState(0)
  const [pulse, setPulse] = useState<Pulse | null>(null)
  const [ticker, setTicker] = useState<TickerItem[]>(() => seedTicker(data.spots))

  const frontRef = useRef(0)
  const spotsRef = useRef(spots)
  const ownedRef = useRef(ownedSpotId)
  spotsRef.current = spots
  ownedRef.current = ownedSpotId

  const sums = useMemo(() => armySums(spots), [spots])
  const targetP = targetFront(sums.a, sums.b)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let acc = 0
    let prev = frontRef.current
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { a, b } = armySums(spotsRef.current)
      const target = targetFront(a, b)
      const next = damp(frontRef.current, target, FRONT_LAMBDA, dt)
      if (Math.sign(prev) !== Math.sign(next) && Math.abs(prev) > 0.012) {
        setBeatAt(now)
      }
      prev = next
      frontRef.current = next
      acc += dt
      if (acc > 0.07) {
        acc = 0
        setFrontUi(next)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const pushTicker = useCallback((item: TickerItem) => {
    setTicker((prev) => [item, ...prev].slice(0, 18))
  }, [])

  const applyBid = useCallback(
    (id: string, who: string, amount: number, scout: boolean) => {
      const current = spotsRef.current.find((s) => s.id === id)
      if (!current) return false
      const nextSpot: Spot = {
        ...current,
        bid: amount,
        brand: { ...current.brand },
        history: [
          { who, amount, at: new Date().toISOString() },
          ...current.history,
        ],
      }
      setSpots((prev) => prev.map((s) => (s.id === id ? nextSpot : s)))
      const scale = sizeFromBid(amount).scale
      const frontX = frontRef.current * FIELD_SPAN
      setPulse({
        spotId: id,
        x: regimentWorldX(nextSpot.side, frontX, scale),
        z: rankToZ(nextSpot.rank),
        color: nextSpot.brand.primary,
        at: performance.now(),
      })
      pushTicker({
        id: tickerId(),
        text: scout
          ? `A scout raises ${nextSpot.brand.name} · $${amount}`
          : `${who} takes ${nextSpot.spotName} · $${amount}`,
        tone: nextSpot.side === 'A' ? 'iron' : 'steel',
      })
      return true
    },
    [pushTicker],
  )

  const priceOf = useCallback(
    (spot: Spot) => slotPrice(spot.bid, spot.side, frontRef.current),
    [],
  )

  const placeBid = useCallback(
    (id: string, who = 'YOU') => {
      const spot = spotsRef.current.find((s) => s.id === id)
      if (!spot) return false
      if (ownedRef.current && ownedRef.current !== id) return false
      const amount = slotPrice(spot.bid, spot.side, frontRef.current)
      const ok = applyBid(id, who, amount, false)
      if (ok) {
        setOwnedSpotId(id)
        setSelectedId(id)
      }
      return ok
    },
    [applyBid],
  )

  useEffect(() => {
    let cancelled = false
    let timer = 0
    const scout = () => {
      if (cancelled) return
      const list = spotsRef.current
      const { a, b } = armySums(list)
      const weaker: Side = a === b ? (Math.random() > 0.5 ? 'A' : 'B') : a > b ? 'B' : 'A'
      const owned = ownedRef.current
      const pool = list
        .filter((s) => s.side === weaker && s.id !== owned)
        .sort((x, y) => x.bid - y.bid)
      const pick = pool[Math.floor(Math.random() * Math.min(3, pool.length))] ?? pool[0]
      if (pick) {
        const bump = MIN_INCREMENT + Math.round(Math.random() * 5) * 10
        const amount = pick.bid + bump
        applyBid(pick.id, 'a scout', amount, true)
      }
      timer = window.setTimeout(scout, 10000 + Math.random() * 7000)
    }
    timer = window.setTimeout(scout, 5200)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [applyBid])

  const value = useMemo<FieldApi>(
    () => ({
      spots,
      sums,
      frontRef,
      frontUi,
      targetP,
      beatAt,
      pulse,
      ownedSpotId,
      selectedId,
      ticker,
      select: setSelectedId,
      placeBid,
      priceOf,
    }),
    [
      spots,
      sums,
      frontUi,
      targetP,
      beatAt,
      pulse,
      ownedSpotId,
      selectedId,
      ticker,
      placeBid,
      priceOf,
    ],
  )

  return <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
}

export function useField() {
  const ctx = useContext(FieldContext)
  if (!ctx) throw new Error('useField outside provider')
  return ctx
}

export const copy = {
  title: data.title,
  tagline: data.tagline,
}
