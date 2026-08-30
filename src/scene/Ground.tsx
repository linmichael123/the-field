import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
import { FIELD_SPAN } from '../lib/economy'
import { useField } from '../state/FieldContext'

export function Ground() {
  const { frontRef, beatAt } = useField()
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uFront: { value: 0 },
          uBeat: { value: 0 },
          uTime: { value: 0 },
          uEarthA: { value: new Color('#2a2116') },
          uEarthB: { value: new Color('#3d2f1d') },
          uGrass: { value: new Color('#3a4a28') },
          uScar: { value: new Color('#1a100c') },
          uEmber: { value: new Color('#e07a3d') },
          uSteel: { value: new Color('#7eb8c9') },
          uMid: { value: new Color('#f3ead8') },
        },
        vertexShader: `
          varying vec3 vWorld;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 w = modelMatrix * vec4(position, 1.0);
            vWorld = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }
        `,
        fragmentShader: `
          uniform float uFront;
          uniform float uBeat;
          uniform float uTime;
          uniform vec3 uEarthA;
          uniform vec3 uEarthB;
          uniform vec3 uGrass;
          uniform vec3 uScar;
          uniform vec3 uEmber;
          uniform vec3 uSteel;
          uniform vec3 uMid;
          varying vec3 vWorld;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
          }

          void main() {
            vec2 p = vWorld.xz;
            float n = noise(p * 0.22) * 0.65 + noise(p * 0.7) * 0.35;
            float furrows = 0.5 + 0.5 * sin(p.z * 1.15 + n * 2.0);
            vec3 earth = mix(uEarthA, uEarthB, n);
            earth = mix(earth, uGrass, smoothstep(0.55, 0.9, n) * 0.28 * (1.0 - furrows * 0.4));

            float distFront = abs(p.x - uFront);
            float trench = smoothstep(2.15, 0.15, distFront);
            float lip = smoothstep(3.4, 1.6, distFront) - trench;
            earth = mix(earth, uScar, trench * 0.92);
            earth *= 1.0 - trench * 0.35;
            earth += vec3(0.08, 0.04, 0.02) * lip;

            float side = sign(p.x - uFront + 0.0001);
            vec3 glow = mix(uEmber, uSteel, side * 0.5 + 0.5);
            earth += glow * trench * (0.18 + 0.35 * uBeat);
            earth += uMid * uBeat * smoothstep(1.1, 0.0, distFront) * 0.85;

            float midline = smoothstep(0.28, 0.0, abs(p.x)) * 0.22 * (1.0 - trench);
            earth += uMid * midline * (0.25 + uBeat);

            float dust = noise(p * 0.08 + vec2(uTime * 0.03, 0.0));
            earth += vec3(0.07, 0.05, 0.03) * dust * 0.15;

            float fade = smoothstep(42.0, 18.0, length(p));
            gl_FragColor = vec4(earth * fade, 1.0);
          }
        `,
      }),
    [],
  )

  const mesh = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    mat.uniforms.uFront.value = frontRef.current * FIELD_SPAN
    mat.uniforms.uTime.value = clock.elapsedTime
    const beat = Math.max(0, 1 - (performance.now() - beatAt) / 1600)
    mat.uniforms.uBeat.value = beat
  })

  const geo = useMemo(() => {
    const g = new PlaneGeometry(90, 70, 1, 1)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  return (
    <mesh
      ref={mesh}
      geometry={geo}
      material={mat}
      receiveShadow
      position={[0, 0, 0]}
    />
  )
}
