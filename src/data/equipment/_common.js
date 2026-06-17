/**
 * Shared building blocks for equipment definitions.
 *
 * Standard cab-space positions and reusable control/step/hazard factories so
 * every machine reads consistently and new machines stay compact.
 */

// Cab-space positions (seated first-person POV; -Z is forward).
export const P = {
  belt: [-0.34, 0.42, 0.42],
  ignition: [0.46, 0.72, -0.5],
  leftJoy: [-0.46, 0.5, 0.12],
  rightJoy: [0.46, 0.5, 0.12],
  wheel: [0, 0.66, -0.4],
  dashL: [-0.28, 0.78, -0.55],
  dashC: [0, 0.8, -0.55],
  dashR: [0.28, 0.78, -0.55],
  leftConsoleFront: [-0.52, 0.6, -0.42],
  leftConsoleMid: [-0.52, 0.58, -0.26],
  leftConsoleBack: [-0.52, 0.55, -0.1],
  rightConsoleFront: [0.52, 0.72, -0.36],
  rightConsoleMid: [0.52, 0.64, -0.22],
  rightConsoleBack: [0.52, 0.55, -0.1],
  pedalL: [-0.2, 0.06, -0.5],
  pedalC: [0, 0.06, -0.5],
  pedalR: [0.2, 0.06, -0.5],
}

/* ----------------------------- controls ----------------------------- */

export const belt = (position = P.belt) => ({
  id: 'seatbelt', type: 'buckle', label: 'Seat Belt', position, color: '#c2410c',
  states: [
    { value: 'unbuckled', label: 'UNBUCKLED' },
    { value: 'buckled', label: 'BUCKLED' },
  ],
})

export const ignition = (position = P.ignition) => ({
  id: 'ignition', type: 'key', label: 'Ignition', position, color: '#94a3b8', cycle: false,
  states: [
    { value: 'off', label: 'OFF' },
    { value: 'on', label: 'ON' },
    { value: 'start', label: 'START' },
  ],
})

export const parkBrake = (position = P.leftConsoleBack) => ({
  id: 'parkbrake', type: 'toggle', label: 'Parking Brake', position, color: '#ef4444',
  states: [
    { value: 'on', label: 'ENGAGED' },
    { value: 'off', label: 'RELEASED' },
  ],
})

export const throttle = (id = 'throttle', label = 'Throttle', position = P.leftConsoleFront) => ({
  id, type: 'lever', label, position, color: '#0ea5e9',
  states: [
    { value: 'idle', label: 'IDLE' },
    { value: 'mid', label: 'MID' },
    { value: 'high', label: 'HIGH' },
  ],
})

export const toggle = (id, label, position, color = '#22c55e', onLabel = 'ON', offLabel = 'OFF') => ({
  id, type: 'toggle', label, position, color,
  states: [
    { value: 'off', label: offLabel },
    { value: 'on', label: onLabel },
  ],
})

export const lever3 = (id, label, position, states, color = '#0ea5e9') => ({
  id, type: 'lever', label, position, color, states,
})

export const button = (id, label, position, color = '#eab308') => ({
  id, type: 'button', label, position, color,
})

export const pedal = (id, label, position, color = '#334155') => ({
  id, type: 'pedal', label, position, color,
})

export const wheel = (position = P.wheel) => ({
  id: 'wheel', type: 'wheel', label: 'Steering Wheel', position, color: '#0f172a',
  directions: [
    { action: 'steer-left', label: '◀ Left', dir: [-1, 0] },
    { action: 'steer-right', label: 'Right ▶', dir: [1, 0] },
  ],
})

export const joystick = (id, label, position, directions) => ({
  id, type: 'joystick', label, position, color: '#1e293b', directions,
})

/* ----------------------------- steps ----------------------------- */

export const stepBelt = {
  id: 'belt', instruction: 'Fasten your seat belt.', target: 'seatbelt',
  expect: { type: 'state', value: 'buckled' }, success: 'Seat belt fastened.',
  hint: 'Tap the orange buckle at your left hip.',
}

export const stepKeyOn = {
  id: 'key-on', instruction: 'Turn the ignition to ON and let the dash self-check complete.',
  target: 'ignition', expect: { type: 'state', value: 'on' }, success: 'System check complete.',
}

export const stepKeyStart = {
  id: 'key-start', instruction: 'Crank the engine — turn the key to START.',
  target: 'ignition', expect: { type: 'state', value: 'start' }, success: 'Engine running.',
}

export const stepReleaseBrake = {
  id: 'release-brake', instruction: 'Release the parking brake.',
  target: 'parkbrake', expect: { type: 'state', value: 'off' }, success: 'Parking brake released.',
}

/* ----------------------------- hazards ----------------------------- */

export const hzNoBelt = {
  id: 'start-no-belt',
  when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.seatbelt !== 'buckled',
  cause: 'Restraint not secured',
  message: 'You started the engine without your seat belt fastened. Buckle up before operating any machine.',
}

/** Fatal if the machine is propelled while the parking brake is still set. */
export const hzDriveWithBrake = (driveControls) => ({
  id: 'drive-with-brake',
  when: (w, r) => driveControls.includes(r.controlId) && w.controls.parkbrake === 'on',
  cause: 'Driven with brake set',
  message: 'You tried to drive with the parking brake engaged. Always release the brake before moving — driving against it damages the driveline.',
})
