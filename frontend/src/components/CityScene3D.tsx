import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

/* ── Building with windows ── */
function Building({ position, height, color, windowColor = '#fef2f2' }: {
  position: [number, number, number]; height: number; color: string; windowColor?: string
}) {
  const w = 0.28 + Math.random() * 0.1
  const d = 0.28 + Math.random() * 0.1
  const windowRows = Math.floor(height / 0.28)
  const windows = useMemo(() => {
    const arr = []
    for (let row = 0; row < windowRows; row++) {
      for (let col = -1; col <= 1; col++) {
        if (Math.random() > 0.35) {
          arr.push({ x: col * 0.08, y: -height / 2 + 0.18 + row * 0.28, lit: Math.random() > 0.4 })
        }
      }
    }
    return arr
  }, [height, windowRows])

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w, height, d]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.25} />
      </mesh>
      {windows.map((win, i) => (
        <mesh key={i} position={[win.x, win.y, d / 2 + 0.001]}>
          <planeGeometry args={[0.055, 0.07]} />
          <meshStandardMaterial
            color={win.lit ? '#fef9c3' : '#374151'}
            emissive={win.lit ? '#fef08a' : '#000000'}
            emissiveIntensity={win.lit ? 0.8 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ── Worker Node with pulse ring ── */
function WorkerNode({ position, delay }: { position: [number, number, number]; delay: number }) {
  const coreRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.position.y = position[1] + Math.sin(t * 1.3 + delay) * 0.12
      const s = 1 + Math.sin(t * 2.5 + delay) * 0.1
      coreRef.current.scale.setScalar(s)
    }
    if (ringRef.current) {
      const pulse = ((t * 0.8 + delay) % 2) / 2
      ringRef.current.scale.setScalar(1 + pulse * 2.5)
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - pulse) * 0.5
      ringRef.current.position.y = position[1] + Math.sin(t * 1.3 + delay) * 0.12
    }
  })

  return (
    <>
      <mesh ref={coreRef} position={position}>
        <sphereGeometry args={[0.11, 20, 20]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={1.2} />
      </mesh>
      <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.11, 0.16, 32]} />
        <meshBasicMaterial color="#dc2626" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

/* ── Data packet traveling along a bezier curve ── */
function DataPacket({ start, end, delay, speed = 1 }: {
  start: [number, number, number]; end: [number, number, number]; delay: number; speed?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const curve = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
    mid.y += 0.7
    return new THREE.QuadraticBezierCurve3(s, mid, e)
  }, [start, end])

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = ((clock.elapsedTime * speed * 0.18 + delay) % 1)
      const pos = curve.getPoint(t)
      ref.current.position.copy(pos)
      ;(ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 6) * 0.4
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshStandardMaterial color="#ffffff" emissive="#dc2626" emissiveIntensity={1} />
    </mesh>
  )
}

/* ── Static bezier arc line ── */
function ConnectionLine({ start, end, delay }: {
  start: [number, number, number]; end: [number, number, number]; delay: number
}) {
  const lineRef = useRef<THREE.Line>(null)

  const geometry = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5)
    mid.y += 0.7
    const curve = new THREE.QuadraticBezierCurve3(s, mid, e)
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(40))
  }, [start, end])

  useFrame(({ clock }) => {
    if (lineRef.current) {
      ;(lineRef.current.material as THREE.LineBasicMaterial).opacity =
        0.2 + Math.sin(clock.elapsedTime * 1.2 + delay) * 0.2
    }
  })

  return (
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial color="#dc2626" transparent opacity={0.35} />
    </line>
  )
}

/* ── Central floating insurance orb ── */
function InsuranceOrb() {
  const groupRef = useRef<THREE.Group>(null)
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.position.y = 2.0 + Math.sin(t * 0.7) * 0.18
    }
    if (ring1.current) ring1.current.rotation.z = t * 0.6
    if (ring2.current) ring2.current.rotation.x = t * 0.4
  })

  return (
    <group ref={groupRef} position={[0, 2.0, 0]}>
      <mesh>
        <sphereGeometry args={[0.22, 32, 32]} />
        <MeshDistortMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.6} distort={0.25} speed={2.5} metalness={0.3} roughness={0.1} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.025, 12, 60]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.55, 0.015, 12, 60]} />
        <meshStandardMaterial color="#fca5a5" emissive="#fca5a5" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/* ── Ground grid ── */
function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]} receiveShadow>
        <circleGeometry args={[4, 72]} />
        <meshStandardMaterial color="#fff1f2" transparent opacity={0.55} />
      </mesh>
      <gridHelper args={[7, 14, '#fecaca', '#fecaca']} position={[0, -0.81, 0]} />
    </>
  )
}

/* ── Ambient floating particles ── */
function Particles() {
  const count = 50
  const data = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const r = 2.8 + Math.random() * 1.0
      return {
        pos: [Math.cos(angle) * r, -0.3 + Math.random() * 2.8, Math.sin(angle) * r] as [number, number, number],
        speed: 0.6 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      }
    })
  }, [])

  const meshRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame(({ clock }) => {
    data.forEach((d, i) => {
      const m = meshRefs.current[i]
      if (m) m.position.y = d.pos[1] + Math.sin(clock.elapsedTime * d.speed + d.offset) * 0.2
    })
  })

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} ref={el => { meshRefs.current[i] = el }} position={d.pos}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.7} transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  )
}

/* ── Full Scene ── */
function Scene() {
  const buildings: Array<{ pos: [number, number, number]; h: number; color: string }> = [
    { pos: [-1.9, -0.22, -0.6], h: 1.1, color: '#fca5a5' },
    { pos: [-1.3, -0.05, 0.9],  h: 1.5, color: '#f87171' },
    { pos: [-0.6, -0.15, -1.6], h: 1.3, color: '#fca5a5' },
    { pos: [0.5,  -0.02, -1.3], h: 1.8, color: '#dc2626' },
    { pos: [1.5,  -0.12, 0.4],  h: 1.2, color: '#f87171' },
    { pos: [1.9,  -0.22, -0.9], h: 1.0, color: '#fca5a5' },
    { pos: [0.3,  -0.05, 1.7],  h: 1.4, color: '#dc2626' },
    { pos: [-1.1, -0.18, 1.5],  h: 0.9, color: '#f87171' },
    { pos: [0.0,  -0.08, -0.8], h: 2.0, color: '#b91c1c' },
    { pos: [-0.8, -0.1,  0.3],  h: 1.6, color: '#ef4444' },
  ]

  const workers: Array<[number, number, number]> = [
    [-1.9, 0.48, -0.6],
    [-1.3, 0.70, 0.9],
    [-0.6, 0.50, -1.6],
    [0.5,  0.78, -1.3],
    [1.5,  0.48, 0.4],
    [1.9,  0.38, -0.9],
    [0.3,  0.65, 1.7],
    [-1.1, 0.32, 1.5],
  ]

  const connections: Array<[number, number]> = [
    [0, 1], [1, 7], [2, 3], [3, 4], [4, 5], [6, 7], [0, 2], [4, 6], [1, 3], [5, 6],
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 10, 6]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 4, 0]} color="#dc2626" intensity={2} distance={10} />
      <pointLight position={[-3, 2, -3]} color="#fca5a5" intensity={1} distance={7} />
      <pointLight position={[3, 1, 3]} color="#fee2e2" intensity={0.8} distance={6} />

      <Ground />
      <Particles />
      <InsuranceOrb />

      {buildings.map((b, i) => (
        <Building key={i} position={[b.pos[0], b.pos[1] + b.h / 2 - 0.82, b.pos[2]]} height={b.h} color={b.color} />
      ))}

      {workers.map((pos, i) => (
        <WorkerNode key={i} position={pos} delay={i * 0.65} />
      ))}

      {connections.map(([a, b], i) => (
        <React.Fragment key={i}>
          <ConnectionLine start={workers[a]} end={workers[b]} delay={i * 0.4} />
          <DataPacket start={workers[a]} end={workers[b]} delay={i * 0.3} speed={0.8 + i * 0.05} />
        </React.Fragment>
      ))}
    </>
  )
}

const CityScene3D: React.FC = () => (
  <div className="w-full h-full">
    <Canvas shadows camera={{ position: [5, 4, 6], fov: 42 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
      <Scene />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 5} />
    </Canvas>
  </div>
)

export default CityScene3D
