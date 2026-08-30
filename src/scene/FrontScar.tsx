import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide, Group, Mesh, MeshBasicMaterial, ShaderMaterial } from 'three'
import { FIELD_SPAN } from '../lib/economy'
import { useField } from '../state/FieldContext'

export function FrontScar() {
  const { frontRef, beatAt } = useField()
  const group = useRef<Group>(null)

  const trenchMat = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {
          uBeat: { value: 0 },
          uColor: { value: new Color('#1a0e08') },
          uHot: { value: new Color('#f4d6a0') },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uBeat;
          uniform vec3 uColor;
          uniform vec3 uHot;
          varying vec2 vUv;
          void main() {
            float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);
            float core = smoothstep(0.55, 0.0, abs(vUv.x - 0.5));
            vec3 col = mix(uColor, uHot, core * (0.25 + uBeat * 0.75));
            float alpha = (0.72 + uBeat * 0.28) * edge;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      }),
    [],
  )

  useFrame(() => {
    if (!group.current) return
    group.current.position.x = frontRef.current * FIELD_SPAN
    const beat = Math.max(0, 1 - (performance.now() - beatAt) / 1600)
    trenchMat.uniforms.uBeat.value = beat
    const flash = group.current.children[1] as Mesh | undefined
    if (flash) {
      flash.scale.set(1 + beat * 2.4, 1, 1)
      const mat = flash.material as MeshBasicMaterial
      mat.opacity = beat * 0.7
    }
  })

  return (
    <group ref={group} position={[0, 0.03, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={trenchMat}>
        <planeGeometry args={[3.4, 36]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[0.35, 36]} />
        <meshBasicMaterial color="#f3ead8" transparent opacity={0} depthWrite={false} />
      </mesh>
      {Array.from({ length: 14 }).map((_, i) => {
        const z = -16 + i * 2.45
        const wobble = ((i * 17) % 7) * 0.08
        return (
          <mesh key={i} position={[wobble - 0.3, 0.12, z]} castShadow>
            <boxGeometry args={[0.7 + (i % 3) * 0.15, 0.22, 0.45]} />
            <meshStandardMaterial color="#2b2118" roughness={1} />
          </mesh>
        )
      })}
    </group>
  )
}
