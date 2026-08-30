export type Side = 'A' | 'B'
export type Formation = 'pikes' | 'shields' | 'standards' | 'riders' | 'skirmish'
export type Mark =
  | 'bars'
  | 'ring'
  | 'slash'
  | 'tri'
  | 'grid'
  | 'dot'
  | 'wave'
  | 'cross'
  | 'hex'
  | 'arc'

export type BidEvent = {
  who: string
  amount: number
  at: string
}

export type Brand = {
  id: string
  name: string
  tagline: string
  mark: Mark
  glyph: string
  primary: string
  secondary: string
}

export type Spot = {
  id: string
  side: Side
  spotName: string
  rank: number
  formation: Formation
  brand: Brand
  bid: number
  history: BidEvent[]
}

export type FieldData = {
  title: string
  tagline: string
  spots: Spot[]
}

export type TickerItem = {
  id: string
  text: string
  tone: 'iron' | 'steel' | 'neutral'
}

export type Pulse = {
  spotId: string
  x: number
  z: number
  color: string
  at: number
}
