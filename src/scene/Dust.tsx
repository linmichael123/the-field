import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  PointsMaterial,
} from 'three'
import { FIELD_SPAN } from '../lib/economy'
import { useField } from '../state/FieldContext'

function makeCloud(count: number, spread: [number, number, number]) {
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread[0]
    positions[i * 3 + 1] = Math.random() * spread[1]
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
    seeds[i] = Math.random() * Math.PI * 2
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(positions, 3))
  geo.setAttribute('seed', new BufferAttribute(seeds, 1))
  return geo
}

export function Dust() {
  const { frontRef, pulse, beatAt } = useField()
  const ambient = useRef<Points>(null)
  const trench = useRef<Points>(null)
  const burst = useRef<Points>(null)

  const ambientGeo = useMemo(() => makeCloud(280, [70, 8, 50]), [])
  const trenchGeo = useMemo(() => makeCloud(160, [4.5, 2.4, 34]), [])
  const burstGeo = useMemo(() => makeCloud(90, [1.2, 0.4, 1.2]), [])

  const ambientMat = useMemo(
    () =>
      new PointsMaterial({
        color: new Color('#c9b08a'),
        size: 0.085,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
      }),
    [],
  )
  const trenchMat = useMemo(
    () =>
      new PointsMaterial({
        color: new Color('#e8d2a8'),
        size: 0.11,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
      }),
    [],
  )
  const burstMat = useMemo(
    () =>
      new PointsMaterial({
        color: new Color('#f3ead8'),
        size: 0.16,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const frontX = frontRef.current * FIELD_SPAN
    if (ambient.current) {
      ambient.current.rotation.y = t * 0.012
      const pos = ambient.current.geometry.getAttribute('position')
      for (let i = 0; i < pos.count; i++) {
        const y = 0.4 + ((Math.sin(t * 0.15 + i) + 1) * 0.5) * 6.5
        pos.setY(i, y)
      }
      pos.needsUpdate = true
    }
    if (trench.current) {
      trench.current.position.x = frontX
      const pos = trench.current.geometry.getAttribute('position')
      for (let i = 0; i < pos.count; i++) {
        const wobble = Math.sin(t * 1.4 + i * 0.4) * 0.35
        pos.setX(i, ((i * 17) % 40) / 10 - 2 + wobble)
        pos.setY(i, 0.15 + Math.abs(Math.sin(t * 0.8 + i)) * 1.6)
      }
      pos.needsUpdate = true
    }
    const beat = Math.max(0, 1 - (performance.now() - beatAt) / 1400)
    trenchMat.opacity = 0.35 + beat * 0.45

    if (burst.current && pulse) {
      const age = (performance.now() - pulse.at) / 900
      burst.current.position.set(pulse.x, 0.4, pulse.z)
      const expand = Math.min(1, Math.max(0, age))
      burst.current.scale.setScalar(0.4 + expand * 6)
      burstMat.opacity = expand < 1 ? (1 - expand) * 0.7 : 0
      burstMat.color.set(pulse.color)
    }
  })

  return (
    <>
      <points ref={ambient} geometry={ambientGeo} material={ambientMat} />
      <points ref={trench} geometry={trenchGeo} material={trenchMat} />
      <points ref={burst} geometry={burstGeo} material={burstMat} />
    </>
  )
}
