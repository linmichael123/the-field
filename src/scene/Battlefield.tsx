import { Canvas } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useField } from '../state/FieldContext'
import { BreathingCamera } from './BreathingCamera'
import { Dust } from './Dust'
import { FrontScar } from './FrontScar'
import { Ground } from './Ground'
import { Landmarks } from './Landmarks'
import { Lighting } from './Lighting'
import { Regiment } from './Regiment'
import { SkyDome } from './SkyDome'

export function Battlefield() {
  const { spots, select } = useField()

  return (
    <Canvas
      className="field-canvas"
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2, 11.2, 23.8], fov: 34, near: 0.1, far: 140 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#120e0b']} />
      <fog attach="fog" args={['#1a120e', 28, 78]} />
      <BreathingCamera />
      <SkyDome />
      <Lighting />
      <Ground />
      <FrontScar />
      <Landmarks />
      {spots.map((spot) => (
        <Regiment key={spot.id} spot={spot} />
      ))}
      <Dust />
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.42}
        scale={60}
        blur={2.2}
        far={8}
        color="#0a0705"
      />
    </Canvas>
  )
}
