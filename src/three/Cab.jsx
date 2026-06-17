import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Control3D from './Control3D'
import { useSimStore } from '../state/useSimStore'

/**
 * First-person cab. The camera sits at the operator's eye point looking forward
 * over the console; the user can drag to look around. Controls are placed by the
 * equipment data and rendered as interactive 3D objects.
 */
export default function Cab() {
  const equipment = useSimStore((s) => s.equipment)
  const procedureIndex = useSimStore((s) => s.procedureIndex)
  const stepIndex = useSimStore((s) => s.stepIndex)
  const status = useSimStore((s) => s.status)

  const procedure = equipment.procedures[procedureIndex]
  const currentStep = procedure?.steps[stepIndex]
  const targetId = status === 'running' ? currentStep?.target : null

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.95, 1.15], fov: 60, near: 0.05, far: 50 }}
      style={{ touchAction: 'none' }}
    >
      <color attach="background" args={['#0b1120']} />
      <fog attach="fog" args={['#0b1120', 3, 9]} />

      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>

      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 2]} intensity={1.1} castShadow />
      <pointLight position={[0, 1.4, 0.6]} intensity={0.5} color="#dbeafe" />

      <CabShell />

      {equipment.controls.map((c) => (
        <Control3D key={c.id} control={c} isTarget={c.id === targetId} />
      ))}

      <OrbitControls
        target={[0, 0.5, -0.2]}
        enablePan={false}
        minDistance={0.6}
        maxDistance={2.2}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.62}
        minAzimuthAngle={-Math.PI / 2.3}
        maxAzimuthAngle={Math.PI / 2.3}
        rotateSpeed={0.5}
      />
    </Canvas>
  )
}

/** Simple procedural cab interior so controls read in 3D space. */
function CabShell() {
  return (
    <group>
      {/* floor */}
      <mesh position={[0, -0.05, -0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.4, 2.4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* dash / console in front */}
      <mesh position={[0, 0.62, -0.62]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.18]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* dash screen */}
      <mesh position={[0, 0.74, -0.55]} rotation={[-0.35, 0, 0]}>
        <planeGeometry args={[0.5, 0.22]} />
        <meshStandardMaterial color="#082f49" emissive="#0c4a6e" emissiveIntensity={0.6} />
      </mesh>

      {/* left & right console pods (joystick towers) */}
      <mesh position={[-0.46, 0.32, 0.12]}>
        <boxGeometry args={[0.28, 0.55, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.46, 0.32, 0.12]}>
        <boxGeometry args={[0.28, 0.55, 0.4]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* A-pillars / cab frame */}
      {[-0.78, 0.78].map((x) => (
        <mesh key={x} position={[x, 1.0, -0.55]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.06, 1.4, 0.06]} />
          <meshStandardMaterial color="#0b1220" />
        </mesh>
      ))}
      {/* roof bar */}
      <mesh position={[0, 1.65, -0.4]}>
        <boxGeometry args={[1.7, 0.06, 0.9]} />
        <meshStandardMaterial color="#0b1220" />
      </mesh>

      {/* seat hint */}
      <mesh position={[0, 0.18, 0.55]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  )
}
