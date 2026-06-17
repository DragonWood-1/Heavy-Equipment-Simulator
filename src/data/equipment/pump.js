import { P, belt, ignition, toggle, lever3, joystick, stepBelt, stepKeyOn, stepKeyStart, hzNoBelt } from './_common'

/** Concrete Pump — boom pump. Outriggers must be set before unfolding the boom. */
const pump = {
  id: 'pump',
  name: 'Concrete Pump',
  category: 'Concrete',
  manufacturerRef: 'Putzmeister / Schwing Pump O&M Manual (generic)',
  summary: 'Truck-mounted boom pump. Set the outriggers before unfolding the placing boom, then pump from the hopper.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    toggle('outriggers', 'Outriggers', P.dashL, '#ef4444', 'DEPLOYED', 'STOWED'),
    toggle('agitator', 'Hopper Agitator', P.dashR, '#0ea5e9'),
    joystick('boomjoy', 'Placing Boom', P.rightJoy, [
      { action: 'up', label: '▲ Boom Up', dir: [0, -1] },
      { action: 'down', label: '▼ Boom Down', dir: [0, 1] },
      { action: 'left', label: '◀ Slew L', dir: [-1, 0] },
      { action: 'right', label: '▶ Slew R', dir: [1, 0] },
    ]),
    lever3('pumpstroke', 'Pump', P.leftConsoleFront, [
      { value: 'off', label: 'OFF' },
      { value: 'forward', label: 'PUMPING' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#f97316'),
  ],
  procedures: [
    {
      id: 'setup', title: 'Set-Up & Start-Up',
      description: 'Secure yourself, start the truck, and set the outriggers before the boom.',
      steps: [
        stepBelt, stepKeyOn, stepKeyStart,
        { id: 'outriggers', instruction: 'Fully deploy and level the outriggers.', hint: 'The boom must never move on tires alone.', target: 'outriggers', expect: { type: 'state', value: 'on' }, success: 'Outriggers set and level.' },
      ],
    },
    {
      id: 'operate', title: 'Place Concrete',
      description: 'Unfold the boom, start the agitator, and pump.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', outriggers: 'on', agitator: 'off', pumpstroke: 'off' },
      steps: [
        { id: 'boom-up', instruction: 'Raise the placing boom off its rest.', target: 'boomjoy', expect: { type: 'action', value: 'up' }, success: 'Boom unfolding.' },
        { id: 'slew', instruction: 'Slew the boom over the pour.', target: 'boomjoy', expect: { type: 'action', value: 'right' }, success: 'Boom positioned.' },
        { id: 'agitator', instruction: 'Start the hopper agitator.', target: 'agitator', expect: { type: 'state', value: 'on' }, success: 'Hopper agitating.' },
        { id: 'pump', instruction: 'Engage the pump to place concrete.', target: 'pumpstroke', expect: { type: 'state', value: 'forward' }, success: 'Placing concrete. Pour underway.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    {
      id: 'boom-no-outriggers',
      when: (w, r) => r.controlId === 'boomjoy' && w.controls.outriggers !== 'on',
      cause: 'Outriggers not set',
      message: 'You moved the placing boom without the outriggers deployed. The truck will tip. Always set and level the outriggers before unfolding the boom.',
    },
  ],
}
export default pump
