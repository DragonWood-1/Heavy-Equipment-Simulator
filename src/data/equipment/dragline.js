import { P, belt, ignition, joystick, lever3, stepBelt, stepKeyOn, stepKeyStart, hzNoBelt } from './_common'

/** Dragline — rope-operated bucket excavator. */
const dragline = {
  id: 'dragline',
  name: 'Dragline',
  category: 'Mining',
  manufacturerRef: 'Bucyrus / P&H Dragline O&M Manual (generic)',
  summary: 'Bucket controlled by hoist and drag ropes. Cast the bucket, drag it full, hoist, swing and dump.',
  ready: true,
  controls: [
    belt(),
    {
      id: 'masterswitch', type: 'key', label: 'Master Power', position: P.dashL, color: '#94a3b8', cycle: false,
      states: [{ value: 'off', label: 'OFF' }, { value: 'on', label: 'ON' }],
    },
    ignition(),
    lever3('drag', 'Drag Rope', P.leftConsoleFront, [
      { value: 'hold', label: 'HOLD' },
      { value: 'in', label: 'DRAG IN' },
      { value: 'out', label: 'PAY OUT' },
    ], '#f97316'),
    lever3('hoist', 'Hoist Rope', P.rightConsoleFront, [
      { value: 'hold', label: 'HOLD' },
      { value: 'up', label: 'HOIST UP' },
      { value: 'down', label: 'LOWER' },
    ], '#0ea5e9'),
    joystick('swingjoy', 'Swing', P.rightJoy, [
      { action: 'swing-left', label: '◀ Swing L', dir: [-1, 0] },
      { action: 'swing-right', label: '▶ Swing R', dir: [1, 0] },
    ]),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Power-Up',
      description: 'Secure yourself, energize master power, and start the machinery.',
      steps: [
        stepBelt,
        { id: 'master', instruction: 'Switch Master Power ON.', target: 'masterswitch', expect: { type: 'state', value: 'on' }, success: 'Power energized.' },
        stepKeyOn, stepKeyStart,
      ],
    },
    {
      id: 'operate', title: 'Dig Cycle',
      description: 'Cast and drag the bucket full, hoist, swing to spoil, and dump.',
      initialStates: { seatbelt: 'buckled', masterswitch: 'on', ignition: 'start', drag: 'hold', hoist: 'hold' },
      steps: [
        { id: 'drag-in', instruction: 'Drag the bucket in to fill it.', target: 'drag', expect: { type: 'state', value: 'in' }, success: 'Bucket filling.' },
        { id: 'hoist-up', instruction: 'Hoist the loaded bucket clear of the cut.', target: 'hoist', expect: { type: 'state', value: 'up' }, success: 'Bucket lifted.' },
        { id: 'swing', instruction: 'Swing to the spoil pile.', target: 'swingjoy', expect: { type: 'action', value: 'swing-right' }, success: 'Swinging to dump.' },
        { id: 'dump', instruction: 'Pay out the drag rope to dump the bucket.', target: 'drag', expect: { type: 'state', value: 'out' }, success: 'Bucket dumped. Cycle complete.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    {
      id: 'operate-no-power',
      when: (w, r) => ['drag', 'hoist', 'swingjoy'].includes(r.controlId) && w.controls.masterswitch !== 'on',
      cause: 'Master power off',
      message: 'You tried to work the ropes with master power off. In training this is an unsafe sequence — energize master power and start the machinery before operating.',
    },
  ],
}
export default dragline
