function Hill({
  position,
  scale,
  color,
}: {
  position: [number, number, number]
  scale: [number, number, number]
  color: string
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  )
}

function Ruin({ position, rot = 0 }: { position: [number, number, number]; rot?: number }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.4, 2.2, 0.45]} />
        <meshStandardMaterial color="#3a3128" roughness={0.95} />
      </mesh>
      <mesh position={[0.7, 0.55, 0.1]} castShadow>
        <boxGeometry args={[0.55, 1.1, 0.4]} />
        <meshStandardMaterial color="#2c251e" roughness={0.95} />
      </mesh>
    </group>
  )
}

export function Landmarks() {
  return (
    <group>
      <Hill position={[-28, -1.2, -16]} scale={[10, 4.2, 7]} color="#1b1612" />
      <Hill position={[30, -1.6, -14]} scale={[11, 5, 8]} color="#16131a" />
      <Hill position={[-8, -2.4, -24]} scale={[16, 5.5, 8]} color="#1a1410" />
      <Hill position={[6, -2.8, -26]} scale={[14, 6, 7]} color="#141018" />
      <Hill position={[-32, -0.8, 10]} scale={[7, 3.2, 6]} color="#221810" />
      <Hill position={[34, -0.9, 12]} scale={[8, 3.4, 6]} color="#18141c" />
      <Ruin position={[-18, 0, 16]} rot={0.4} />
      <Ruin position={[19, 0, 15.5]} rot={-0.6} />
      <Ruin position={[-22, 0, -8]} rot={1.1} />
      <mesh position={[-26, 9.5, -6]} >
        <sphereGeometry args={[1.6, 16, 16]} />
        <meshBasicMaterial color="#ffb56a" />
      </mesh>
      <mesh position={[-24, 8.2, -5]}>
        <sphereGeometry args={[3.4, 16, 16]} />
        <meshBasicMaterial color="#f0a050" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  )
}
