import { money, sizeFromBid, slotPrice } from '../lib/economy'
import { clock } from '../lib/format'
import { useField } from '../state/FieldContext'

export function Overlay() {
  const { spots, selectedId, select, placeBid, ownedSpotId, frontUi } = useField()
  const spot = spots.find((s) => s.id === selectedId)
  if (!spot) return null

  const price = slotPrice(spot.bid, spot.side, frontUi)
  const size = sizeFromBid(spot.bid)
  const locked = Boolean(ownedSpotId && ownedSpotId !== spot.id)
  const mine = ownedSpotId === spot.id
  const army = spot.side === 'A' ? 'Iron' : 'Steel'

  return (
    <div className="overlay-root">
      <button type="button" className="overlay-dim" onClick={() => select(null)} aria-label="Close" />
      <article className={`sheet sheet-${spot.side === 'A' ? 'iron' : 'steel'}`}>
        <header>
          <p className="sheet-kicker">{`${army} line`}</p>
          <h2>{spot.spotName}</h2>
          <p className="sheet-tag">{spot.brand.tagline}</p>
        </header>

        <div className="sheet-brand">
          <span className="sheet-mark" style={{ background: spot.brand.secondary, color: spot.brand.primary }}>
            {spot.brand.glyph}
          </span>
          <div>
            <p className="sheet-name">{spot.brand.name}</p>
            <p className="sheet-size">{`${size.label} · ${spot.formation}`}</p>
          </div>
        </div>

        <dl className="sheet-stats">
          <div>
            <dt>Current bid</dt>
            <dd>{money(spot.bid)}</dd>
          </div>
          <div>
            <dt>{frontUi * (spot.side === 'A' ? 1 : -1) > 0.04 ? 'Winning-side price' : 'Losing-side price'}</dt>
            <dd>{money(price)}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="place"
          disabled={locked}
          onClick={() => placeBid(spot.id)}
        >
          {locked
            ? 'You already hold a banner'
            : mine
              ? `Raise your bid  ${money(price)}`
              : `Place bid  ${money(price)}`}
        </button>
        {locked && (
          <p className="sheet-lock">One identity. One banner. Hold your ground or raise it.</p>
        )}

        <section className="history">
          <p className="history-label">Bid history</p>
          <ol>
            {spot.history.slice(0, 6).map((h, i) => (
              <li key={`${h.at}-${i}`}>
                <span>{clock(h.at)}</span>
                <span>{h.who}</span>
                <strong>{money(h.amount)}</strong>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </div>
  )
}
