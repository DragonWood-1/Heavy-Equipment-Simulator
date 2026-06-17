import { P, belt, ignition, parkBrake, wheel, lever3, joystick, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Telehandler — telescopic boom forklift with frame leveling. */
const telehandler = {
  id: 'telehandler',
  name: 'Telehandler',
  category: 'Lifting',
  manufacturerRef: 'JCB / Genie Telehandler O&M Manual (generic)',
  summary: 'Telescopic handler with forks. Lift, extend and tilt the boom — watch the load chart as you reach out.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    wheel(),
    joystick('boomjoy', 'Boom (Lift / Extend)', P.rightJoy, [
      { action: 'lift', label: '▲ Lift', dir: [0, -1] },
      { action: 'lower', label: '▼ Lower', dir: [0, 1] },
      { action: 'extend', label: '▶ Extend', dir: [1, 0] },
      { action: 'retract', label: '◀ Retract', dir: [-1, 0] },
    ]),
    lever3('forktilt', 'Fork Tilt', P.rightConsoleBack, [
      { value: 'level', label: 'LEVEL' },
      { value: 'crowd', label: 'CROWD BACK' },
      { value: 'dump', label: 'DUMP' },
    ], '#f97316'),
    lever3('framelevel', 'Frame Level', P.leftConsoleFront, [
      { value: 'level', label: 'LEVEL' },
      { value: 'left', label: 'TILT L' },
      { value: 'right', label: 'TILT R' },
    ], '#a855f7'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the machine.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Place a Load',
      description: 'Crowd the forks, lift, reach out to place, then retract.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', forktilt: 'level', framelevel: 'level' },
      steps: [
        stepReleaseBrake,
        { id: 'crowd', instruction: 'Crowd the forks back to secure the load.', target: 'forktilt', expect: { type: 'state', value: 'crowd' }, success: 'Load tilted back and secure.' },
        { id: 'lift', instruction: 'Lift the boom.', target: 'boomjoy', expect: { type: 'action', value: 'lift' }, success: 'Load raised.' },
        { id: 'extend', instruction: 'Extend the boom to reach the placement.', hint: 'Capacity drops fast as you reach out — mind the load chart.', target: 'boomjoy', expect: { type: 'action', value: 'extend' }, success: 'Boom extended.' },
        { id: 'dump', instruction: 'Tilt the forks level/forward to set the load.', target: 'forktilt', expect: { type: 'state', value: 'dump' }, success: 'Load placed.' },
        { id: 'retract', instruction: 'Retract the boom back over the machine.', target: 'boomjoy', expect: { type: 'action', value: 'retract' }, success: 'Boom stowed. Task complete.' },
      ],
    },
  ],
  hazards: [hzNoBelt, hzDriveWithBrake(['wheel'])],
}
export default telehandler
