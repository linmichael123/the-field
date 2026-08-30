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
        toneMapped: false,
        uniforms: {
          uFront: { value: 0 },
          uBeat: { value: 0 },
          uTime: { value: 0 },
          uEarthA: { value: new Color('#5a4630') },
          uEarthB: { value: new Color('#7a5d38') },
          uGrass: { value: new Color('#5c6b34') },
          uScar: { value: new Color('#2a1810') },
          uEmber: { value: new Color('#ff8a3d') },
          uSteel: { value: new Color('#9ad4e0') },
          uMid: { value: new Color('#f8edd8') },
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
            float trench = smoothstep(2.6, 0.12, distFront);
            float lip = smoothstep(4.2, 1.8, distFront) - trench;
            earth = mix(earth, uScar, trench * 0.88);
            earth += vec3(0.18, 0.1, 0.04) * lip;

            float side = sign(p.x - uFront + 0.0001);
            vec3 glow = mix(uEmber, uSteel, side * 0.5 + 0.5);
            earth += glow * trench * (0.42 + 0.7 * uBeat);
            earth += uMid * uBeat * smoothstep(1.4, 0.0, distFront);

            float midline = smoothstep(0.38, 0.0, abs(p.x)) * (1.0 - trench);
            earth += uMid * midline * (0.45 + uBeat);

            float dust = noise(p * 0.08 + vec2(uTime * 0.03, 0.0));
            earth += vec3(0.12, 0.09, 0.05) * dust * 0.22;

            float fade = smoothstep(48.0, 16.0, length(p));
            gl_FragColor = vec4(earth * mix(0.55, 1.0, fade), 1.0);
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
