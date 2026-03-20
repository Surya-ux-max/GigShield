import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, Text } from '@react-three/drei'
import * as THREE from 'three'

function PhoneBody() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.45) * 0.22
      groupRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.28) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      {/* Chassis */}
      <RoundedBox args={[1.15, 2.35, 0.13]} radius={0.13} smoothness={8} castShadow>
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.15} />
      </RoundedBox>

      {/* Screen base */}
      <mesh position={[0, 0, 0.068]}>
        <planeGeometry args={[1.0, 2.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Screen background — white app */}
      <mesh position={[0, -0.05, 0.069]}>
        <planeGeometry args={[0.97, 1.85]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* ── Status bar ── */}
      <mesh position={[0, 0.88, 0.070]}>
        <planeGeometry args={[0.97, 0.14]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[-0.22, 0.88, 0.078]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle">
        Carely
      </Text>
      <Text position={[0.32, 0.88, 0.078]} fontSize={0.048} color="#fecaca" anchorX="center" anchorY="middle">
        9:41
      </Text>

      {/* ── Payout notification card ── */}
      <mesh position={[0, 0.46, 0.071]}>
        <planeGeometry args={[0.88, 0.62]} />
        <meshStandardMaterial color="#fff1f2" />
      </mesh>
      {/* left red stripe */}
      <mesh position={[-0.39, 0.46, 0.072]}>
        <planeGeometry args={[0.09, 0.62]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} />
      </mesh>
      {/* payout amount */}
      <Text position={[0.08, 0.60, 0.079]} fontSize={0.175} color="#dc2626" anchorX="center" anchorY="middle">
        ₹450 Paid!
      </Text>
      <Text position={[0.08, 0.44, 0.079]} fontSize={0.062} color="#374151" anchorX="center" anchorY="middle">
        Disruption payout
      </Text>
      <Text position={[0.08, 0.33, 0.079]} fontSize={0.052} color="#9ca3af" anchorX="center" anchorY="middle">
        Transferred instantly ✓
      </Text>

      {/* ── Divider ── */}
      <mesh position={[0, 0.14, 0.071]}>
        <planeGeometry args={[0.88, 0.006]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* ── Alert card ── */}
      <mesh position={[0, -0.12, 0.071]}>
        <planeGeometry args={[0.88, 0.44]} />
        <meshStandardMaterial color="#fef2f2" />
      </mesh>
      <Text position={[0, -0.02, 0.079]} fontSize={0.062} color="#dc2626" anchorX="center" anchorY="middle">
        🌧 Rain disruption detected
      </Text>
      <Text position={[0, -0.14, 0.079]} fontSize={0.052} color="#6b7280" anchorX="center" anchorY="middle">
        Zone: Chennai South
      </Text>
      <Text position={[0, -0.25, 0.079]} fontSize={0.048} color="#9ca3af" anchorX="center" anchorY="middle">
        Coverage active • Auto-claim
      </Text>

      {/* ── Balance card ── */}
      <mesh position={[0, -0.56, 0.071]}>
        <planeGeometry args={[0.88, 0.38]} />
        <meshStandardMaterial color="#f9fafb" />
      </mesh>
      <Text position={[-0.18, -0.46, 0.079]} fontSize={0.052} color="#9ca3af" anchorX="center" anchorY="middle">
        Total earned
      </Text>
      <Text position={[-0.18, -0.58, 0.079]} fontSize={0.09} color="#111827" anchorX="center" anchorY="middle">
        ₹2,850
      </Text>
      <Text position={[0.22, -0.46, 0.079]} fontSize={0.052} color="#9ca3af" anchorX="center" anchorY="middle">
        This month
      </Text>
      <Text position={[0.22, -0.58, 0.079]} fontSize={0.09} color="#16a34a" anchorX="center" anchorY="middle">
        ₹450
      </Text>

      {/* ── Bottom nav bar ── */}
      <mesh position={[0, -0.88, 0.071]}>
        <planeGeometry args={[0.97, 0.22]} />
        <meshStandardMaterial color="#f9fafb" />
      </mesh>
      <Text position={[-0.3, -0.88, 0.079]} fontSize={0.052} color="#dc2626" anchorX="center" anchorY="middle">
        Home
      </Text>
      <Text position={[0, -0.88, 0.079]} fontSize={0.052} color="#9ca3af" anchorX="center" anchorY="middle">
        Claims
      </Text>
      <Text position={[0.3, -0.88, 0.079]} fontSize={0.052} color="#9ca3af" anchorX="center" anchorY="middle">
        Profile
      </Text>

      {/* Home indicator pill */}
      <mesh position={[0, -1.02, 0.070]}>
        <planeGeometry args={[0.3, 0.028]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Camera notch */}
      <mesh position={[0, 1.06, 0.070]}>
        <circleGeometry args={[0.048, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Side power button */}
      <mesh position={[0.60, 0.32, 0]}>
        <boxGeometry args={[0.042, 0.24, 0.09]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Volume buttons */}
      <mesh position={[-0.60, 0.50, 0]}>
        <boxGeometry args={[0.042, 0.18, 0.09]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.60, 0.22, 0]}>
        <boxGeometry args={[0.042, 0.18, 0.09]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function FloatingCoin({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.4 + delay) * 0.14
      ref.current.rotation.y = clock.elapsedTime * 2.2 + delay
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.8 + delay) * 0.3
    }
  })
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[0.11, 0.11, 0.028, 28]} />
      <meshStandardMaterial color="#fbbf24" metalness={0.95} roughness={0.05} emissive="#f59e0b" emissiveIntensity={0.4} />
    </mesh>
  )
}

const PhoneModel3D: React.FC = () => (
  <div className="w-full h-full">
    <Canvas camera={{ position: [0, 0, 4.2], fov: 38 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow />
      <pointLight position={[-2.5, 2.5, 2]} color="#dc2626" intensity={1.4} distance={9} />
      <pointLight position={[2.5, -1.5, 2]} color="#fca5a5" intensity={0.7} distance={7} />
      <pointLight position={[0, 0, 3]} color="#ffffff" intensity={0.5} distance={5} />

      <Float speed={1.1} floatIntensity={0.35} rotationIntensity={0.08}>
        <PhoneBody />
      </Float>

      <FloatingCoin position={[-1.5, 0.6, 0.6]}  delay={0}   />
      <FloatingCoin position={[1.5,  0.3, 0.4]}  delay={1.3} />
      <FloatingCoin position={[-1.3, -0.7, 0.3]} delay={2.2} />
      <FloatingCoin position={[1.3,  -0.5, 0.5]} delay={0.7} />
      <FloatingCoin position={[0,     1.4, 0.2]} delay={1.8} />
    </Canvas>
  </div>
)

export default PhoneModel3D
