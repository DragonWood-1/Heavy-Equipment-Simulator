import { P, belt, ignition, parkBrake, throttle, toggle, lever3, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Compactor (Road Roller) — vibratory drum roller. */
const compactor = {
  id: 'compactor',
  name: 'Compactor (Road Roller)',
  category: 'Compaction',
  manufacturerRef: 'Caterpillar / Hamm Roller O&M Manual (generic)',
  summary: 'Vibratory drum roller. Get rolling first, then switch on vibration — never vibrate while parked on the mat.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    throttle(),
    lever3('propulsion', 'Propulsion (F-N-R)', P.rightConsoleBack, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#22c55e'),
    toggle('vibration', 'Drum Vibration', P.rightConsoleFront, '#f97316'),
    toggle('waterspray', 'Water Spray', P.dashR, '#0ea5e9'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the roller.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Compaction Pass',
      description: 'Roll forward with the water spray on, then engage vibration while moving.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', throttle: 'idle', propulsion: 'neutral', vibration: 'off', waterspray: 'off' },
      steps: [
        stepReleaseBrake,
        { id: 'water', instruction: 'Turn the water spray ON to stop asphalt sticking to the drum.', target: 'waterspray', expect: { type: 'state', value: 'on' }, success: 'Spray on.' },
        { id: 'throttle', instruction: 'Bring the throttle to MID.', target: 'throttle', expect: { type: 'state', value: 'mid' }, success: 'Power up.' },
        { id: 'drive', instruction: 'Move FORWARD onto the mat.', target: 'propulsion', expect: { type: 'state', value: 'forward' }, success: 'Rolling.' },
        { id: 'vibe', instruction: 'Now engage drum vibration to compact.', hint: 'Only vibrate while the drum is moving.', target: 'vibration', expect: { type: 'state', value: 'on' }, success: 'Compacting. Pass complete.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    hzDriveWithBrake(['propulsion']),
    {
      id: 'vibrate-stopped',
      when: (w, r) => r.controlId === 'vibration' && r.value === 'on' && w.controls.propulsion === 'neutral',
      cause: 'Vibrating while stopped',
      message: 'You switched on vibration while the roller was stopped. Vibrating in place gouges the mat and damages the drum bearings. Always be moving before you turn vibration on.',
    },
  ],
}
export default compactor
