import { money, sizeFromBid, slotPrice } from '../lib/economy'
import { useField } from '../state/FieldContext'

export function SpotList() {
  const { spots, select, selectedId, ownedSpotId, frontUi } = useField()
  const iron = spots.filter((s) => s.side === 'A')
  const steel = spots.filter((s) => s.side === 'B')

  return (
    <aside className="spots">
      <p className="spots-label">Live spots</p>
      <div className="spots-cols">
        <ul>
          {iron.map((s) => (
            <Row
              key={s.id}
              name={s.spotName}
              brand={s.brand.name}
              color={s.brand.primary}
              bid={s.bid}
              price={slotPrice(s.bid, s.side, frontUi)}
              size={sizeFromBid(s.bid).label}
              active={selectedId === s.id}
              locked={Boolean(ownedSpotId && ownedSpotId !== s.id)}
              owned={ownedSpotId === s.id}
              onClick={() => select(s.id)}
            />
          ))}
        </ul>
        <ul>
          {steel.map((s) => (
            <Row
              key={s.id}
              name={s.spotName}
              brand={s.brand.name}
              color={s.brand.primary}
              bid={s.bid}
              price={slotPrice(s.bid, s.side, frontUi)}
              size={sizeFromBid(s.bid).label}
              active={selectedId === s.id}
              locked={Boolean(ownedSpotId && ownedSpotId !== s.id)}
              owned={ownedSpotId === s.id}
              onClick={() => select(s.id)}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}

function Row({
  name,
  brand,
  color,
  bid,
  price,
  size,
  active,
  locked,
  owned,
  onClick,
}: {
  name: string
  brand: string
  color: string
  bid: number
  price: number
  size: string
  active: boolean
  locked: boolean
  owned: boolean
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        className={`spot-row ${active ? 'is-active' : ''} ${owned ? 'is-owned' : ''}`}
        onClick={onClick}
      >
        <span className="swatch" style={{ background: color }} />
        <span className="spot-meta">
          <span className="spot-name">{name}</span>
          <span className="spot-brand">
            {brand}
            {owned ? ' · yours' : locked ? ' · held' : ''}
          </span>
        </span>
        <span className="spot-cash">
          <strong>{money(bid)}</strong>
          <em>{`next ${money(price)}`}</em>
          <small>{size}</small>
        </span>
      </button>
    </li>
  )
}
