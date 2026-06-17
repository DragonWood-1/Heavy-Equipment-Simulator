import { P, belt, ignition, throttle, joystick, pedal, stepBelt, stepKeyOn, stepKeyStart, hzNoBelt } from './_common'

/** Hydraulic Mining Shovel — production-scale face shovel. */
const miningshovel = {
  id: 'miningshovel',
  name: 'Hydraulic Mining Shovel',
  category: 'Mining',
  manufacturerRef: 'Caterpillar / Komatsu Mining Shovel O&M Manual (generic)',
  summary: 'Large-scale face shovel. Lock out the hydraulics to start, then run crowd, hoist, swing and clam at production scale.',
  ready: true,
  controls: [
    belt(),
    {
      id: 'lockout', type: 'lockout', label: 'Hydraulic Lockout', position: P.leftConsoleBack, color: '#ef4444',
      states: [{ value: 'locked', label: 'LOCKED' }, { value: 'unlocked', label: 'UNLOCKED' }],
    },
    ignition(),
    throttle('enginespeed', 'Engine Speed', P.rightConsoleBack),
    joystick('leftjoy', 'Swing / Crowd (Left)', P.leftJoy, [
      { action: 'crowd-out', label: '▲ Crowd Out', dir: [0, -1] },
      { action: 'crowd-in', label: '▼ Crowd In', dir: [0, 1] },
      { action: 'swing-left', label: '◀ Swing L', dir: [-1, 0] },
      { action: 'swing-right', label: '▶ Swing R', dir: [1, 0] },
    ]),
    joystick('rightjoy', 'Hoist / Clam (Right)', P.rightJoy, [
      { action: 'hoist-up', label: '▲ Hoist Up', dir: [0, -1] },
      { action: 'hoist-down', label: '▼ Hoist Down', dir: [0, 1] },
      { action: 'clam-open', label: '▶ Clam Open', dir: [1, 0] },
      { action: 'clam-close', label: '◀ Clam Close', dir: [-1, 0] },
    ]),
    pedal('travel', 'Travel Pedals', P.pedalC),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself, lock out the hydraulics, then start the engine.',
      steps: [
        stepBelt,
        { id: 'lock', instruction: 'Raise the hydraulic lockout to LOCKED before starting.', target: 'lockout', expect: { type: 'state', value: 'locked' }, success: 'Hydraulics locked out.' },
        stepKeyOn, stepKeyStart,
      ],
    },
    {
      id: 'operate', title: 'Load a Truck',
      description: 'Activate hydraulics and run a dig-swing-dump cycle into a haul truck.',
      initialStates: { seatbelt: 'buckled', lockout: 'locked', ignition: 'start', enginespeed: 'idle' },
      steps: [
        { id: 'unlock', instruction: 'Lower the hydraulic lockout to UNLOCKED to go live.', target: 'lockout', expect: { type: 'state', value: 'unlocked' }, success: 'Hydraulics live.' },
        { id: 'rpm', instruction: 'Raise the engine speed to HIGH.', target: 'enginespeed', expect: { type: 'state', value: 'high' }, success: 'At production speed.' },
        { id: 'crowd', instruction: 'Crowd the dipper into the face.', target: 'leftjoy', expect: { type: 'action', value: 'crowd-out' }, success: 'Digging the face.' },
        { id: 'hoist', instruction: 'Hoist the loaded dipper clear.', target: 'rightjoy', expect: { type: 'action', value: 'hoist-up' }, success: 'Dipper loaded and lifted.' },
        { id: 'swing', instruction: 'Swing to the haul truck.', target: 'leftjoy', expect: { type: 'action', value: 'swing-right' }, success: 'Swung over the tray.' },
        { id: 'dump', instruction: 'Open the clam to dump into the truck.', target: 'rightjoy', expect: { type: 'action', value: 'clam-open' }, success: 'Truck loaded. Cycle complete.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    {
      id: 'start-unlocked',
      when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.lockout !== 'locked',
      cause: 'Hydraulics not locked out',
      message: 'You started the engine with the hydraulics unlocked. A bumped joystick can swing this massive boom into people or the face. Always lock out the hydraulics before starting.',
    },
  ],
}
export default miningshovel
