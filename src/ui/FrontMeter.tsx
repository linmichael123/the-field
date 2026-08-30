import { money } from '../lib/economy'
import { useField } from '../state/FieldContext'

export function FrontMeter() {
  const { sums, frontUi, beatAt } = useField()
  const t = (frontUi + 1) / 2
  const beating = typeof performance !== 'undefined' && performance.now() - beatAt < 1400
  const lead =
    Math.abs(frontUi) < 0.04 ? 'Dead even' : frontUi > 0 ? 'Iron shoves' : 'Steel shoves'

  return (
    <div className={`meter ${beating ? 'meter-beat' : ''}`}>
      <div className="meter-sums">
        <span className="iron">{`Iron ${money(sums.a)}`}</span>
        <span className="lead">{lead}</span>
        <span className="steel">{`Steel ${money(sums.b)}`}</span>
      </div>
      <div className="meter-track" aria-hidden>
        <div className="meter-mid" />
        <div className="meter-fill iron-fill" style={{ width: `${t * 100}%` }} />
        <div className="meter-knob" style={{ left: `${t * 100}%` }} />
      </div>
    </div>
  )
}
