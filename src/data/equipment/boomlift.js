import { P, joystick } from './_common'

/** Boom / Scissor Lift — aerial work platform with platform controls. */
const boomlift = {
  id: 'boomlift',
  name: 'Boom / Scissor Lift',
  category: 'Aerial',
  manufacturerRef: 'Genie / JLG MEWP O&M Manual (generic)',
  summary: 'Aerial work platform. Clip in, release the emergency stop, select PLATFORM, then elevate. Never drive elevated on rough ground.',
  ready: true,
  controls: [
    {
      id: 'harness', type: 'buckle', label: 'Harness / Lanyard', position: P.belt, color: '#c2410c',
      states: [{ value: 'unbuckled', label: 'NOT CLIPPED' }, { value: 'buckled', label: 'CLIPPED IN' }],
    },
    {
      id: 'estop', type: 'toggle', label: 'Emergency Stop', position: P.dashL, color: '#ef4444',
      states: [{ value: 'on', label: 'PRESSED' }, { value: 'off', label: 'RELEASED' }],
    },
    {
      id: 'selector', type: 'key', label: 'Ground / Platform Select', position: P.dashR, color: '#94a3b8', cycle: false,
      states: [{ value: 'off', label: 'OFF' }, { value: 'platform', label: 'PLATFORM' }],
    },
    joystick('liftjoy', 'Platform Lift', P.rightJoy, [
      { action: 'up', label: '▲ Raise', dir: [0, -1] },
      { action: 'down', label: '▼ Lower', dir: [0, 1] },
    ]),
    joystick('drivejoy', 'Drive / Steer', P.leftJoy, [
      { action: 'forward', label: '▲ Forward', dir: [0, -1] },
      { action: 'reverse', label: '▼ Reverse', dir: [0, 1] },
      { action: 'left', label: '◀ Left', dir: [-1, 0] },
      { action: 'right', label: '▶ Right', dir: [1, 0] },
    ]),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Use & Power-Up',
      description: 'Clip your harness, release the e-stop, and energize the platform controls.',
      steps: [
        { id: 'harness', instruction: 'Clip your harness lanyard to the anchor point.', target: 'harness', expect: { type: 'state', value: 'buckled' }, success: 'Clipped in.' },
        { id: 'estop', instruction: 'Release (pull out) the emergency stop button.', target: 'estop', expect: { type: 'state', value: 'off' }, success: 'Controls live.' },
        { id: 'select', instruction: 'Turn the selector to PLATFORM.', target: 'selector', expect: { type: 'state', value: 'platform' }, success: 'Platform controls active.' },
      ],
    },
    {
      id: 'operate', title: 'Elevate & Reposition',
      description: 'Raise the platform to work height, then lower fully before driving.',
      initialStates: { harness: 'buckled', estop: 'off', selector: 'platform' },
      steps: [
        { id: 'raise', instruction: 'Raise the platform to working height.', target: 'liftjoy', expect: { type: 'action', value: 'up' }, success: 'Elevating.' },
        { id: 'lower', instruction: 'Lower the platform fully before moving.', hint: 'Driving elevated on rough ground tips the machine.', target: 'liftjoy', expect: { type: 'action', value: 'down' }, success: 'Platform lowered.' },
        { id: 'drive', instruction: 'Now drive to reposition.', target: 'drivejoy', expect: { type: 'action', value: 'forward' }, success: 'Repositioning safely. Task complete.' },
      ],
    },
  ],
  hazards: [
    {
      id: 'op-no-harness',
      when: (w, r) => (r.controlId === 'liftjoy' || r.controlId === 'drivejoy') && w.controls.harness !== 'buckled',
      cause: 'Not clipped in',
      message: 'You operated the lift without your harness clipped to the anchor. A fall from height is fatal — always clip in before using the controls.',
    },
    {
      id: 'op-estop-pressed',
      when: (w, r) => (r.controlId === 'liftjoy' || r.controlId === 'drivejoy') && w.controls.estop === 'on',
      cause: 'Emergency stop engaged',
      message: 'Nothing should move with the emergency stop pressed in. In training this counts as an unsafe attempt — release the e-stop and select PLATFORM before operating.',
    },
  ],
}

export default boomlift
