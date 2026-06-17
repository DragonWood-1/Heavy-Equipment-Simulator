import { P, belt, ignition, parkBrake, wheel, throttle, lever3, joystick, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Motor Grader — precision moldboard machine for fine grading. */
const grader = {
  id: 'grader',
  name: 'Motor Grader',
  category: 'Earthmoving',
  manufacturerRef: 'Caterpillar M-Series Grader O&M Manual (generic)',
  summary: 'Precision blade machine. Independent left/right blade lift, circle turn and frame articulation produce a fine grade.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    throttle(),
    wheel(),
    lever3('transmission', 'Transmission (F-N-R)', P.rightConsoleBack, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#22c55e'),
    lever3('bladeleft', 'Blade Lift (Left)', P.leftConsoleMid, [
      { value: 'up', label: 'RAISED' },
      { value: 'down', label: 'LOWERED' },
    ]),
    lever3('bladeright', 'Blade Lift (Right)', P.rightConsoleFront, [
      { value: 'up', label: 'RAISED' },
      { value: 'down', label: 'LOWERED' },
    ]),
    joystick('articulate', 'Frame Articulation', P.leftConsoleBack, [
      { action: 'left', label: '◀ Artic L', dir: [-1, 0] },
      { action: 'right', label: '▶ Artic R', dir: [1, 0] },
    ]),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the grader.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Set the Blade & Make a Pass',
      description: 'Set both ends of the moldboard, then make a forward grading pass.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', throttle: 'idle', transmission: 'neutral', bladeleft: 'up', bladeright: 'up' },
      steps: [
        stepReleaseBrake,
        { id: 'throttle', instruction: 'Bring the throttle to MID.', target: 'throttle', expect: { type: 'state', value: 'mid' }, success: 'Power up.' },
        { id: 'left', instruction: 'Lower the LEFT end of the blade to grade depth.', target: 'bladeleft', expect: { type: 'state', value: 'down' }, success: 'Left end set.' },
        { id: 'right', instruction: 'Lower the RIGHT end of the blade to match.', target: 'bladeright', expect: { type: 'state', value: 'down' }, success: 'Blade set level.' },
        { id: 'drive', instruction: 'Drive FORWARD to make the pass.', target: 'transmission', expect: { type: 'state', value: 'forward' }, success: 'Grading a clean pass. Complete.' },
      ],
    },
  ],
  hazards: [hzNoBelt, hzDriveWithBrake(['transmission'])],
}
export default grader
