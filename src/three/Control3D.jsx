import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useSimStore } from '../state/useSimStore'

/**
 * Renders one data-driven control as an interactive 3D object inside the cab.
 * The visual primitive is chosen by control.type; every type funnels user
 * input back through the store's single `interact()` entry point.
 */
export default function Control3D({ control, isTarget }) {
  const interact = useSimStore((s) => s.interact)
  const value = useSimStore((s) => s.controlStates[control.id])
  const status = useSimStore((s) => s.status)
  const group = useRef()
  const [hover, setHover] = useState(false)

  // Gentle pulse on the control the current step wants you to use.
  useFrame((state) => {
    if (!group.current) return
    const s = isTarget && status === 'running'
      ? 1 + Math.sin(state.clock.elapsedTime * 4) * 0.06
      : 1
    group.current.scale.setScalar(s)
  })

  const cur = control.states?.find((st) => st.value === value)
  const label = cur ? `${control.label}: ${cur.label}` : control.label
  const baseColor = control.color || '#64748b'
  const emissive = isTarget ? '#22d3ee' : hover ? '#475569' : '#000000'

  const tap = (interaction) => (e) => {
    e.stopPropagation()
    interact(control.id, interaction)
  }

  const common = {
    onPointerOver: (e) => { e.stopPropagation(); setHover(true) },
    onPointerOut: () => setHover(false),
  }

  return (
    <group ref={group} position={control.position} rotation={control.rotation || [0, 0, 0]}>
      <ControlMesh
        control={control}
        value={value}
        baseColor={baseColor}
        emissive={emissive}
        tap={tap}
        common={common}
      />

      <Html
        center
        position={[0, controlLabelHeight(control), 0]}
        distanceFactor={2.6}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className={`ctl-label ${isTarget ? 'target' : ''}`}>{label}</div>
      </Html>
    </group>
  )
}

function controlLabelHeight(control) {
  if (control.type === 'joystick') return 0.26
  if (control.type === 'pedal') return 0.16
  return 0.2
}

function ControlMesh({ control, value, baseColor, emissive, tap, common }) {
  switch (control.type) {
    case 'joystick':
      return <Joystick control={control} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'key':
      return <KeySwitch value={value} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'lever':
    case 'throttle':
      return <Lever control={control} value={value} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'lapbar':
      return <SeatBar value={value} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'lockout':
      return <Lockout value={value} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'buckle':
      return <Buckle value={value} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'toggle':
      return <Toggle value={value} baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'button':
      return <PushButton baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    case 'pedal':
      return <Pedal baseColor={baseColor} emissive={emissive} tap={tap} common={common} />
    default:
      return (
        <mesh onClick={tap({})} {...common}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color={baseColor} emissive={emissive} />
        </mesh>
      )
  }
}

/* ----------------------------- primitives ----------------------------- */

function Lever({ value, baseColor, emissive, tap, common }) {
  // tilt the lever forward as the discrete state advances
  const lean = value === 'high' || value === 'unlocked' ? 0.5 : value === 'mid' || value === 'run' ? 0.1 : -0.4
  return (
    <group onClick={tap({})} {...common}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.03, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <group rotation={[lean, 0, 0]}>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.18, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 0.19, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function KeySwitch({ value, baseColor, emissive, tap, common }) {
  const turn = value === 'start' ? 0.9 : value === 'run' || value === 'on' ? 0.45 : 0
  return (
    <group onClick={tap({})} {...common}>
      <mesh>
        <cylinderGeometry args={[0.035, 0.035, 0.03, 20]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <group rotation={[0, 0, turn]}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.012, 0.08, 0.004]} />
          <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.6} metalness={0.6} />
        </mesh>
      </group>
    </group>
  )
}

function SeatBar({ value, baseColor, emissive, tap, common }) {
  const down = value === 'down'
  return (
    <group onClick={tap({})} {...common} rotation={[down ? -0.1 : -1.1, 0, 0]}>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.04]} />
        <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.34, 0.09, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
      <mesh position={[0.34, 0.09, 0]}>
        <boxGeometry args={[0.04, 0.18, 0.04]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>
    </group>
  )
}

function Lockout({ value, baseColor, emissive, tap, common }) {
  const locked = value === 'locked'
  return (
    <group onClick={tap({})} {...common} rotation={[locked ? -0.9 : 0.2, 0, 0]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.05, 0.24, 0.05]} />
        <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.16, 0.04, 0.08]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  )
}

function Buckle({ value, baseColor, emissive, tap, common }) {
  const buckled = value === 'buckled'
  return (
    <group onClick={tap({})} {...common}>
      <mesh>
        <boxGeometry args={[0.1, 0.06, 0.03]} />
        <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[buckled ? 0.06 : 0.13, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.025]} />
        <meshStandardMaterial color={buckled ? '#16a34a' : '#7f1d1d'} />
      </mesh>
      {/* webbing */}
      <mesh position={[-0.1, 0.05, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.02, 0.3, 0.01]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  )
}

function Toggle({ value, baseColor, emissive, tap, common }) {
  const on = value === 'on' || value === 'engaged'
  return (
    <group onClick={tap({})} {...common}>
      <mesh>
        <boxGeometry args={[0.07, 0.05, 0.04]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, on ? 0.04 : -0.04, 0.01]} rotation={[on ? -0.5 : 0.5, 0, 0]}>
        <boxGeometry args={[0.04, 0.05, 0.02]} />
        <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function PushButton({ baseColor, emissive, tap, common }) {
  const [down, setDown] = useState(false)
  return (
    <group
      {...common}
      onPointerDown={(e) => { e.stopPropagation(); setDown(true) }}
      onPointerUp={(e) => { e.stopPropagation(); setDown(false) }}
      onClick={tap({ action: 'press' })}
    >
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, down ? 0.01 : 0.025, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.03, 24]} />
        <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

function Pedal({ baseColor, emissive, tap, common }) {
  const [down, setDown] = useState(false)
  return (
    <group
      {...common}
      onPointerDown={(e) => { e.stopPropagation(); setDown(true) }}
      onPointerUp={(e) => { e.stopPropagation(); setDown(false) }}
      onClick={tap({ action: 'press' })}
      rotation={[down ? -0.2 : -0.5, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[0.22, 0.02, 0.16]} />
        <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

function Joystick({ control, baseColor, emissive, tap, common }) {
  const [tilt, setTilt] = useState([0, 0])
  return (
    <group>
      {/* base */}
      <mesh position={[0, -0.02, 0]} {...common}>
        <cylinderGeometry args={[0.08, 0.1, 0.06, 24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* stick */}
      <group rotation={[tilt[1] * 0.4, 0, -tilt[0] * 0.4]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.2, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <sphereGeometry args={[0.05, 20, 20]} />
          <meshStandardMaterial color={baseColor} emissive={emissive} emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* directional tap pads arranged around the stick */}
      {control.directions.map((d) => (
        <mesh
          key={d.action}
          position={[d.dir[0] * 0.14, 0.02, d.dir[1] * 0.14]}
          onPointerDown={(e) => { e.stopPropagation(); setTilt(d.dir) }}
          onPointerUp={() => setTilt([0, 0])}
          onPointerOut={() => setTilt([0, 0])}
          onClick={(e) => { tap({ action: d.action })(e); setTimeout(() => setTilt([0, 0]), 150) }}
        >
          <cylinderGeometry args={[0.035, 0.035, 0.02, 20]} />
          <meshStandardMaterial color="#334155" emissive={emissive} emissiveIntensity={0.3} />
          <Html center position={[0, 0.03, 0]} distanceFactor={2.6} style={{ pointerEvents: 'none' }}>
            <div className="joy-pad">{d.label}</div>
          </Html>
        </mesh>
      ))}
    </group>
  )
}
