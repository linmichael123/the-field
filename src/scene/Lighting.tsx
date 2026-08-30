export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#f0c090', '#4a3824', 0.85]} />
      <ambientLight intensity={0.38} color="#d4b08a" />
      <directionalLight
        castShadow
        position={[-22, 18, 10]}
        intensity={2.8}
        color="#ffb56a"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={2}
        shadow-camera-far={70}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />
      <directionalLight position={[18, 9, -8]} intensity={0.55} color="#7f9bb8" />
      <pointLight position={[-8, 4, 0]} intensity={8} distance={22} color="#e07a3d" />
      <pointLight position={[8, 4, 0]} intensity={7} distance={22} color="#7eb8c9" />
    </>
  )
}
