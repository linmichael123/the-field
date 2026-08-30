import type { Side, Spot } from '../types'

export const EPSILON = 80
export const MIN_INCREMENT = 40
export const FIELD_SPAN = 10.5
export const FRONT_LAMBDA = 0.72

export function armySums(spots: readonly Spot[]) {
  let a = 0
  let b = 0
  for (const spot of spots) {
    if (spot.side === 'A') a += spot.bid
    else b += spot.bid
  }
  return { a, b }
}

export function targetFront(sumA: number, sumB: number) {
  return (sumA - sumB) / (sumA + sumB + EPSILON)
}

export function slotPrice(bid: number, side: Side, front: number) {
  const advantage = (side === 'A' ? 1 : -1) * front
  const premium = 1 + advantage * 0.38
  const raw = (bid + MIN_INCREMENT) * premium
  return Math.max(bid + MIN_INCREMENT, Math.round(raw / 10) * 10)
}

export function sizeFromBid(bid: number) {
  if (bid >= 900) return { key: 'host', label: 'Host', scale: 1.58 }
  if (bid >= 650) return { key: 'battalion', label: 'Battalion', scale: 1.34 }
  if (bid >= 400) return { key: 'company', label: 'Company', scale: 1.12 }
  return { key: 'skirmish', label: 'Skirmish', scale: 0.9 }
}

export function troopCount(bid: number) {
  return Math.min(18, 5 + Math.floor(bid / 110))
}

export function rankToZ(rank: number) {
  const spread = [-13.2, -6.6, 0, 6.6, 13.2]
  return spread[rank] ?? 0
}

export function regimentWorldX(side: Side, frontX: number, scale: number) {
  const dir = side === 'A' ? -1 : 1
  const standoff = 5.6 - (scale - 1) * 1.15
  return frontX + dir * standoff
}

export function money(n: number) {
  return `$${n.toLocaleString('en-US')}`
}

export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}
