import { useMemo } from 'react'
import { DoubleSide } from 'three'
import type { Formation } from '../types'

type Props = {
  count: number
  formation: Formation
  primary: string
  secondary: string
  facing: 1 | -1
  scale: number
}

function hash(i: number) {
  return ((i * 9301 + 49297) % 233280) / 233280
}

export function Soldiers({ count, formation, primary, secondary, facing, scale }: Props) {
  const troop = useMemo(() => {
    const rows = formation === 'riders' ? 2 : formation === 'skirmish' ? 2 : 3
    const items: { x: number; z: number; s: number }[] = []
    for (let i = 0; i < count; i++) {
      const row = i % rows
      const col = Math.floor(i / rows)
      const jitter = (hash(i) - 0.5) * (formation === 'skirmish' ? 1.1 : 0.28)
      const zJitter = (hash(i + 9) - 0.5) * (formation === 'skirmish' ? 0.9 : 0.22)
      items.push({
        x: facing * (-0.9 - row * 0.72 - hash(i + 3) * 0.2),
        z: (col - count / rows / 2) * (formation === 'riders' ? 0.95 : 0.62) + zJitter,
        s: 0.86 + hash(i + 4) * 0.22 + jitter * 0.05,
      })
    }
    return items
  }, [count, facing, formation])

  return (
    <group>
      {troop.map((t, i) => (
        <Trooper
          key={i}
          x={t.x}
          z={t.z}
          s={t.s * (0.72 + scale * 0.18)}
          formation={formation}
          primary={primary}
          secondary={secondary}
          facing={facing}
        />
      ))}
    </group>
  )
}

function Trooper({
  x,
  z,
  s,
  formation,
  primary,
  secondary,
  facing,
}: {
  x: number
  z: number
  s: number
  formation: Formation
  primary: string
  secondary: string
  facing: 1 | -1
}) {
  const body = formation === 'riders' ? 0.42 : 0.34
  const height = formation === 'pikes' ? 0.95 : 0.82

  return (
    <group position={[x, 0, z]} scale={s}>
      {formation === 'riders' && (
        <mesh position={[0, 0.32, 0]} castShadow>
          <boxGeometry args={[0.7, 0.38, 0.28]} />
          <meshStandardMaterial color={secondary} roughness={0.7} />
        </mesh>
      )}
      <mesh position={[0, formation === 'riders' ? 0.78 : 0.52, 0]} castShadow>
        <boxGeometry args={[body, height, 0.26]} />
        <meshStandardMaterial color={primary} roughness={0.55} metalness={0.12} />
      </mesh>
      <mesh
        position={[0, formation === 'riders' ? 1.28 : 1.02, 0]}
        castShadow
      >
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color="#e8d7c0" roughness={0.8} />
      </mesh>
      <mesh
        position={[0, formation === 'riders' ? 1.38 : 1.12, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.17, 0.19, 0.12, 8]} />
        <meshStandardMaterial color={secondary} roughness={0.45} metalness={0.3} />
      </mesh>

      {formation === 'pikes' && (
        <mesh
          position={[facing * 0.08, 1.35, 0]}
          rotation={[0, 0, facing * 0.18]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.025, 2.5, 6]} />
          <meshStandardMaterial color="#c9b48a" metalness={0.4} roughness={0.35} />
        </mesh>
      )}
      {formation === 'shields' && (
        <mesh position={[facing * 0.28, 0.62, 0]} rotation={[0, facing * 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.06, 8]} />
          <meshStandardMaterial color={secondary} metalness={0.25} roughness={0.4} />
        </mesh>
      )}
      {formation === 'skirmish' && (
        <mesh
          position={[facing * -0.12, 0.85, 0.16]}
          rotation={[0, 0, facing * 1.05]}
          castShadow
        >
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <meshStandardMaterial color="#5c4030" />
        </mesh>
      )}
      {(formation === 'standards' || formation === 'riders') && (
        <mesh position={[facing * 0.22, 0.7, 0]} rotation={[0, 0, facing * 0.9]}>
          <boxGeometry args={[0.05, 0.55, 0.05]} />
          <meshStandardMaterial color="#d8c39a" metalness={0.35} roughness={0.4} />
        </mesh>
      )}
    </group>
  )
}

export function Champion({
  formation,
  primary,
  secondary,
  facing,
  scale,
}: {
  formation: Formation
  primary: string
  secondary: string
  facing: 1 | -1
  scale: number
}) {
  const h = 1.15 * scale
  return (
    <group position={[facing * 0.15, 0, 0]} scale={scale}>
      <mesh position={[0, h * 0.55, 0]} castShadow>
        <boxGeometry args={[0.55, h, 0.36]} />
        <meshStandardMaterial color={primary} roughness={0.42} metalness={0.18} />
      </mesh>
      <mesh position={[0, h * 1.12, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial color="#f0e2cc" roughness={0.75} />
      </mesh>
      <mesh position={[0, h * 1.22, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.28, 0.18, 8]} />
        <meshStandardMaterial color={secondary} metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh
        position={[facing * 0.42, h * 0.62, 0]}
        rotation={[Math.PI / 2, 0, facing * 0.15]}
        castShadow
      >
        <circleGeometry args={[0.42, 6]} />
        <meshStandardMaterial
          color={secondary}
          metalness={0.35}
          roughness={0.35}
          side={DoubleSide}
        />
      </mesh>
      {formation === 'riders' && (
        <mesh position={[-facing * 0.1, 0.38, 0]} castShadow>
          <boxGeometry args={[0.95, 0.5, 0.38]} />
          <meshStandardMaterial color={secondary} roughness={0.65} />
        </mesh>
      )}
      <mesh
        position={[facing * -0.12, h * 0.95, 0.18]}
        rotation={[0, 0, facing * 0.35]}
        castShadow
      >
        <boxGeometry args={[0.07, 1.35, 0.07]} />
        <meshStandardMaterial color="#e8d5a3" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}
