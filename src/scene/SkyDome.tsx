import { useMemo } from 'react'
import { BackSide, Color, ShaderMaterial, SphereGeometry } from 'three'

export function SkyDome() {
  const geo = useMemo(() => new SphereGeometry(88, 36, 20), [])
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          uZenith: { value: new Color('#0c0a12') },
          uHorizon: { value: new Color('#c46a32') },
          uGlow: { value: new Color('#f0c27a') },
          uNadir: { value: new Color('#120e0b') },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uZenith;
          uniform vec3 uHorizon;
          uniform vec3 uGlow;
          uniform vec3 uNadir;
          varying vec3 vPos;
          void main() {
            vec3 n = normalize(vPos);
            float h = n.y;
            vec3 col = mix(uHorizon, uZenith, smoothstep(-0.02, 0.62, h));
            col = mix(uNadir, col, smoothstep(-0.22, 0.04, h));
            float sunBand = exp(-pow((h - 0.04) * 7.0, 2.0));
            float azimuth = smoothstep(0.15, 0.85, n.x * 0.5 + 0.5);
            col += uGlow * sunBand * 0.55 * azimuth;
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )
  return <mesh geometry={geo} material={mat} />
}
