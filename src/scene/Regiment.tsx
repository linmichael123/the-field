import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Color, DoubleSide, type Group, type Mesh } from 'three'
import { bannerTexture } from '../lib/bannerTexture'
import {
  FIELD_SPAN,
  money,
  rankToZ,
  regimentWorldX,
  sizeFromBid,
  slotPrice,
  troopCount,
} from '../lib/economy'
import { useField } from '../state/FieldContext'
import type { Spot } from '../types'
import { Champion, Soldiers } from './Soldiers'

export function Regiment({ spot }: { spot: Spot }) {
  const { frontRef, frontUi, select, selectedId, pulse } = useField()
  const group = useRef<Group>(null)
  const flag = useRef<Mesh>(null)
  const facing = spot.side === 'A' ? 1 : -1
  const size = sizeFromBid(spot.bid)
  const tex = useMemo(() => bannerTexture(spot.brand, spot.bid), [spot.brand, spot.bid])
  const troops = troopCount(spot.bid)
  const z = rankToZ(spot.rank)
  const glow = useMemo(() => new Color(spot.brand.primary), [spot.brand.primary])

  useFrame(({ clock }) => {
    if (!group.current) return
    const frontX = frontRef.current * FIELD_SPAN
    const x = regimentWorldX(spot.side, frontX, size.scale)
    const hit = pulse && pulse.spotId === spot.id ? Math.max(0, 1 - (performance.now() - pulse.at) / 700) : 0
    const bob = Math.sin(clock.elapsedTime * 1.6 + spot.rank) * 0.03
    const shove = Math.sin(clock.elapsedTime * 0.9 + spot.rank * 1.3) * 0.08
    group.current.position.set(x + facing * shove * 0.15, bob + hit * 0.18, z)
    group.current.scale.setScalar(1 + hit * 0.12)
    if (flag.current) {
      flag.current.rotation.y = facing * 0.18 + Math.sin(clock.elapsedTime * 1.8 + spot.rank) * 0.12
      flag.current.rotation.z = Math.sin(clock.elapsedTime * 2.1 + spot.rank) * 0.06
    }
  })

  const selected = selectedId === spot.id
  const price = slotPrice(spot.bid, spot.side, frontUi)

  return (
    <group
      ref={group}
      position={[facing * -6, 0, z]}
      onClick={(e) => {
        e.stopPropagation()
        select(spot.id)
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.35 * size.scale, 20]} />
        <meshStandardMaterial
          color={spot.brand.secondary}
          transparent
          opacity={0.35}
          roughness={1}
        />
      </mesh>

      <Champion
        formation={spot.formation}
        primary={spot.brand.primary}
        secondary={spot.brand.secondary}
        facing={facing}
        scale={size.scale}
      />
      <Soldiers
        count={troops}
        formation={spot.formation}
        primary={spot.brand.primary}
        secondary={spot.brand.secondary}
        facing={facing}
        scale={size.scale}
      />

      <group position={[facing * -0.15, 0, -0.55]}>
        <mesh position={[0, 2.55 * size.scale, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 5.1 * size.scale, 8]} />
          <meshStandardMaterial color="#3a2a1c" roughness={0.7} />
        </mesh>
        <mesh
          ref={flag}
          position={[facing * 0.72, 4.15 * size.scale, 0]}
          castShadow
        >
          <planeGeometry args={[1.45 * size.scale, 2.15 * size.scale]} />
          <meshStandardMaterial
            map={tex}
            side={DoubleSide}
            roughness={0.55}
            metalness={0.05}
            emissive={glow}
            emissiveIntensity={0.18 + size.scale * 0.12}
          />
        </mesh>
      </group>

      <pointLight
        position={[0, 3.2, 0]}
        color={spot.brand.primary}
        intensity={3.2 * size.scale}
        distance={7}
      />

      <Text
        position={[0, 5.55 * size.scale, 0]}
        fontSize={0.42 + size.scale * 0.08}
        color="#f3ead8"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.035}
        outlineColor="#0e0c0a"
      >
        {spot.brand.name}
      </Text>
      <Text
        position={[0, 5.05 * size.scale, 0]}
        fontSize={0.38}
        color={spot.brand.primary}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#0e0c0a"
      >
        {`${money(spot.bid)}  ·  next ${money(price)}`}
      </Text>

      {selected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.45 * size.scale, 1.62 * size.scale, 32]} />
          <meshBasicMaterial color="#f3ead8" transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  )
}
