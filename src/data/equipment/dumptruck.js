import { P, belt, ignition, parkBrake, wheel, lever3, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Dump Truck / Articulated Hauler — off-highway hauler with a hoisting bed. */
const dumptruck = {
  id: 'dumptruck',
  name: 'Dump Truck / Articulated Hauler',
  category: 'Hauling',
  manufacturerRef: 'Caterpillar / Volvo Hauler O&M Manual (generic)',
  summary: 'Off-highway hauler. Haul with the bed down; only raise the bed when stopped on level ground — raising while moving rolls the truck.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    wheel(),
    lever3('transmission', 'Transmission (F-N-R)', P.rightConsoleBack, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#22c55e'),
    lever3('retarder', 'Retarder', P.leftConsoleFront, [
      { value: 'off', label: 'OFF' },
      { value: 'on', label: 'APPLIED' },
    ], '#0ea5e9'),
    lever3('bedhoist', 'Bed Hoist', P.rightConsoleFront, [
      { value: 'down', label: 'DOWN' },
      { value: 'up', label: 'RAISED' },
    ], '#f97316'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the truck.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Haul & Dump',
      description: 'Haul to the dump, stop, then raise and lower the bed.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', transmission: 'neutral', retarder: 'off', bedhoist: 'down' },
      steps: [
        stepReleaseBrake,
        { id: 'drive', instruction: 'Drive FORWARD to the dump area.', target: 'transmission', expect: { type: 'state', value: 'forward' }, success: 'Hauling.' },
        { id: 'stop', instruction: 'Stop: put the transmission to NEUTRAL before dumping.', target: 'transmission', expect: { type: 'state', value: 'neutral' }, success: 'Stopped and level.' },
        { id: 'raise', instruction: 'Raise the bed to dump the load.', hint: 'Only ever raise the bed stopped on level ground.', target: 'bedhoist', expect: { type: 'state', value: 'up' }, success: 'Load dumped.' },
        { id: 'lower', instruction: 'Lower the bed fully before driving away.', target: 'bedhoist', expect: { type: 'state', value: 'down' }, success: 'Bed down. Ready to haul again.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    hzDriveWithBrake(['transmission']),
    {
      id: 'drive-bed-up',
      when: (w, r) => r.controlId === 'transmission' && r.value !== 'neutral' && w.controls.bedhoist === 'up',
      cause: 'Driving with bed raised',
      message: 'You tried to drive with the bed raised. The high center of gravity rolls the truck and can strike overhead lines. Always fully lower the bed before moving.',
    },
  ],
}
export default dumptruck
