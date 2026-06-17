import { P, belt, ignition, parkBrake, wheel, toggle, joystick, stepBelt, stepKeyOn, stepKeyStart, hzNoBelt, hzDriveWithBrake } from './_common'

/** Backhoe Loader — front loader plus rear backhoe with stabilizers. */
const backhoe = {
  id: 'backhoe',
  name: 'Backhoe Loader',
  category: 'Loaders',
  manufacturerRef: 'JCB / Cat Backhoe O&M Manual (generic)',
  summary: 'Loader bucket up front, backhoe out back. Lower the stabilizers before digging — without them the machine can tip.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    wheel(),
    joystick('loaderjoy', 'Loader (Front)', P.leftJoy, [
      { action: 'raise', label: '▲ Raise', dir: [0, -1] },
      { action: 'lower', label: '▼ Lower', dir: [0, 1] },
      { action: 'curl', label: '◀ Curl', dir: [-1, 0] },
      { action: 'dump', label: '▶ Dump', dir: [1, 0] },
    ]),
    toggle('stabilizers', 'Stabilizers', P.rightConsoleBack, '#ef4444', 'DOWN', 'UP'),
    joystick('boomswing', 'Backhoe Boom / Swing', P.leftConsoleFront, [
      { action: 'boom-up', label: '▲ Boom Up', dir: [0, -1] },
      { action: 'boom-down', label: '▼ Boom Down', dir: [0, 1] },
      { action: 'swing-left', label: '◀ Swing L', dir: [-1, 0] },
      { action: 'swing-right', label: '▶ Swing R', dir: [1, 0] },
    ]),
    joystick('stickbucket', 'Backhoe Stick / Bucket', P.rightConsoleFront, [
      { action: 'stick-out', label: '▲ Stick Out', dir: [0, -1] },
      { action: 'stick-in', label: '▼ Stick In', dir: [0, 1] },
      { action: 'curl', label: '◀ Curl', dir: [-1, 0] },
      { action: 'dump', label: '▶ Dump', dir: [1, 0] },
    ]),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the engine.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'backhoe', title: 'Backhoe Digging',
      description: 'Set up the backhoe safely: stabilizers DOWN first, then dig.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', stabilizers: 'off' },
      steps: [
        { id: 'stab', instruction: 'Lower the stabilizers to plant the machine.', hint: 'Without stabilizers the backhoe can tip the machine.', target: 'stabilizers', expect: { type: 'state', value: 'on' }, success: 'Stabilizers down — machine stable.' },
        { id: 'boom-down', instruction: 'Lower the boom toward the dig face.', target: 'boomswing', expect: { type: 'action', value: 'boom-down' }, success: 'Boom positioned.' },
        { id: 'stick-in', instruction: 'Pull the stick in through the material.', target: 'stickbucket', expect: { type: 'action', value: 'stick-in' }, success: 'Bucket loading.' },
        { id: 'curl', instruction: 'Curl the bucket to capture the load.', target: 'stickbucket', expect: { type: 'action', value: 'curl' }, success: 'Bucket full.' },
        { id: 'swing', instruction: 'Swing right to the spoil pile.', target: 'boomswing', expect: { type: 'action', value: 'swing-right' }, success: 'Swung to dump.' },
        { id: 'dump', instruction: 'Dump the load.', target: 'stickbucket', expect: { type: 'action', value: 'dump' }, success: 'Cycle complete.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    hzDriveWithBrake(['wheel']),
    {
      id: 'dig-no-stab',
      when: (w, r) => (r.controlId === 'boomswing' || r.controlId === 'stickbucket') && w.controls.stabilizers !== 'on',
      cause: 'Stabilizers not deployed',
      message: 'You operated the backhoe with the stabilizers up. The machine can lift and tip violently. Always lower the stabilizers before digging.',
    },
  ],
}
export default backhoe
