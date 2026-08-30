import { copy, useField } from '../state/FieldContext'
import { FrontMeter } from './FrontMeter'
import { HowItWorks } from './HowItWorks'
import { Overlay } from './Overlay'
import { SpotList } from './SpotList'
import { Ticker } from './Ticker'

export function Chrome() {
  const { beatAt } = useField()
  const beating = performance.now() - beatAt < 1600

  return (
    <div className={`chrome ${beating ? 'chrome-beat' : ''}`}>
      <header className="mast">
        <div className="mast-copy">
          <p className="kicker">Spectator auction · no walking · the page is the tweet</p>
          <h1>{copy.title}</h1>
          <p className="tagline">{copy.tagline}</p>
        </div>
        <FrontMeter />
      </header>

      <HowItWorks />
      <SpotList />
      <Ticker />
      <Overlay />

      <div className="vignette" />
      <div className="grain" />
    </div>
  )
}
