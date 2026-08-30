import { Battlefield } from './scene/Battlefield'
import { FieldProvider } from './state/FieldContext'
import { Chrome } from './ui/Chrome'

export default function App() {
  return (
    <FieldProvider>
      <div className="app">
        <Battlefield />
        <Chrome />
      </div>
    </FieldProvider>
  )
}
