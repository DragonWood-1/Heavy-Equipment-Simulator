import { P, belt, ignition, parkBrake, throttle, toggle, lever3, stepBelt, stepKeyOn, stepKeyStart, hzNoBelt } from './_common'

/** Asphalt Paver — lays and screeds hot mix. Screed must be heated first. */
const paver = {
  id: 'paver',
  name: 'Asphalt Paver',
  category: 'Paving',
  manufacturerRef: 'Caterpillar / Vögele Paver O&M Manual (generic)',
  summary: 'Lays and screeds hot-mix asphalt. Pre-heat the screed before paving — a cold screed tears the mat.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    throttle(),
    toggle('screedheat', 'Screed Heat', P.dashL, '#ef4444', 'HEATING', 'COLD'),
    lever3('propulsion', 'Propulsion', P.rightConsoleBack, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
    ], '#22c55e'),
    toggle('conveyor', 'Feed Conveyor', P.rightConsoleFront, '#0ea5e9'),
    toggle('auger', 'Spreading Auger', P.leftConsoleMid, '#a855f7'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself, start the paver, and begin heating the screed.',
      steps: [
        stepBelt, stepKeyOn, stepKeyStart,
        { id: 'heat', instruction: 'Switch on the screed heat to begin pre-heating.', hint: 'The screed must reach temperature before any mat is laid.', target: 'screedheat', expect: { type: 'state', value: 'on' }, success: 'Screed heating.' },
      ],
    },
    {
      id: 'operate', title: 'Lay a Mat',
      description: 'With the screed hot, start the material flow and pave forward.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'off', throttle: 'idle', screedheat: 'on', propulsion: 'neutral', conveyor: 'off', auger: 'off' },
      steps: [
        { id: 'conveyor', instruction: 'Start the feed conveyor to bring mix to the augers.', target: 'conveyor', expect: { type: 'state', value: 'on' }, success: 'Material feeding.' },
        { id: 'auger', instruction: 'Engage the spreading auger to distribute mix across the width.', target: 'auger', expect: { type: 'state', value: 'on' }, success: 'Mix spread evenly.' },
        { id: 'throttle', instruction: 'Set the throttle to MID.', target: 'throttle', expect: { type: 'state', value: 'mid' }, success: 'Power up.' },
        { id: 'pave', instruction: 'Move FORWARD to lay the mat.', target: 'propulsion', expect: { type: 'state', value: 'forward' }, success: 'Laying a clean mat. Complete.' },
      ],
    },
  ],
  hazards: [
    hzNoBelt,
    {
      id: 'pave-cold-screed',
      when: (w, r) => (r.controlId === 'conveyor' || r.controlId === 'auger' || (r.controlId === 'propulsion' && r.value === 'forward')) && w.controls.screedheat !== 'on',
      cause: 'Cold screed',
      message: 'You started paving with a cold screed. Mix sticks and the mat tears — the whole pull is scrap. Always pre-heat the screed before laying material.',
    },
  ],
}
export default paver
