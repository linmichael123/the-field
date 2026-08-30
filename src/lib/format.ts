export function clock(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

export function sideLabel(side: 'A' | 'B') {
  return side === 'A' ? 'Iron' : 'Steel'
}

export function tickerId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
