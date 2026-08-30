import { useField } from '../state/FieldContext'

export function Ticker() {
  const { ticker } = useField()
  const loop = [...ticker, ...ticker]

  return (
    <div className="ticker" aria-label="Bid ticker">
      <div className="ticker-track">
        {loop.map((item, i) => (
          <span key={`${item.id}-${i}`} className={`tick tick-${item.tone}`}>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}
