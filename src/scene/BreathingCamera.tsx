import { useFrame, useThree } from '@react-three/fiber'
import { useField } from '../state/FieldContext'

export function BreathingCamera() {
  const { frontRef, beatAt } = useField()
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const f = frontRef.current
    const beat = Math.max(0, 1 - (performance.now() - beatAt) / 1400)
    const punch = beat * beat * 1.6
    camera.position.x = 1.2 + Math.sin(t * 0.13) * 2.2 + f * 2.4
    camera.position.y = 11.2 + Math.sin(t * 0.19) * 0.5 - punch * 0.35
    camera.position.z = 23.8 + Math.cos(t * 0.11) * 1.5 - punch * 1.1
    camera.lookAt(f * 6.2, 1.15 + beat * 0.3, 0)
  })

  return null
}
