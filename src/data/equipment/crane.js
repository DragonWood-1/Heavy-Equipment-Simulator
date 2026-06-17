import { P, belt, ignition, toggle, joystick, stepBelt, stepKeyOn, stepKeyStart, hzNoBelt } from './_common'

/** Mobile Crane — telescoping boom lift. Outriggers MUST be set before lifting. */
const crane = {
  id: 'crane',
  name: 'Mobile Crane',
  category: 'Lifting',
  manufacturerRef: 'Grove / Liebherr Crane O&M Manual (generic)',
  summary: 'Telescoping boom crane. Deploy the outriggers before any boom, swing or hoist motion — the load chart assumes them down.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    toggle('outriggers', 'Outriggers', P.dashL, '#ef4444', 'DEPLOYED', 'STOWED'),
    joystick('boomjoy', 'Boom (Lift / Telescope)', P.rightJoy, [
      { action: 'boom-up', label: '▲ Boom Up', dir: [0, -1] },
      { action: 'boom-down', label: '▼ Boom Down', dir: [0, 1] },
      { action: 'extend', label: '▶ Extend', dir: [1, 0] },
      { action: 'retract', label: '◀ Retract', dir: [-1, 0] },
    ]),
    joystick('swingjoy', 'Swing', P.leftJoy, [
      { action: 'swing-left', label: '◀ Swing L', dir: [-1, 0] },
      { action: 'swing-right', label: '▶ Swing R', dir: [1, 0] },
    ]),
    joystick('hoistjoy', 'Main Hoist', P.leftConsoleFront, [
      { action: 'hoist-up', label: '▲ Hoist Up', dir: [0, -1] },
      { action: 'hoist-down', label: '▼ Hoist Down', dir: [0, 1] },
    ]),
  ],
  procedures: [
    {
      id: 'setup', title: 'Set-Up & Start-Up',
      description: 'Secure yourself, start the carrier, and set the outriggers before any lift.',
      steps: [
        stepBelt, stepKeyOn, stepKeyStart,
        { id: 'outriggers', instruction: 'Deploy the outriggers and level the crane.', hint: 'Lifting on tires/un-level outriggers is a tip-over.', target: 'outriggers', expect: { type: 'state', value: 'on' }, success: 'Outriggers set and level.' },
      ],
    },
    {
      id: 'lift', title: 'Basic Lift',
      description: 'Pick a load, swing it to the set-down, and lower it under control.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', outriggers: 'on' },
      steps: [
        { id: 'boom-up', instruction: 'Raise the boom to working angle.', target: 'boomjoy', expect: { type: 'action', value: 'boom-up' }, success: 'Boom up.' },
        { id: 'hoist-up', instruction: 'Hoist the load off the ground.', target: 'hoistjoy', expect: { type: 'action', value: 'hoist-up' }, success: 'Load airborne — watch the load chart.' },
        { id: 'swing', instruction: 'Swing the load to the set-down point.', target: 'swingjoy', expect: { type: 'action', value: 'swing-right' }, success: 'Swinging slowly.' },
        { id: 'hoist-down', instruction: 'Lower the load to the ground.', target: 'hoistjoy', expect: { type: 'action', value: 'hoist-down' }, success: 'Load landed. Lift complete.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    {
      id: 'lift-no-outriggers',
      when: (w, r) => ['boomjoy', 'swingjoy', 'hoistjoy'].includes(r.controlId) && w.controls.outriggers !== 'on',
      cause: 'Outriggers not set',
      message: 'You operated the crane without the outriggers deployed. The crane will tip over. Always set and level the outriggers before any boom, swing or hoist motion.',
    },
  ],
}
export default crane
