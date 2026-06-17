import { P, belt, ignition, parkBrake, throttle, lever3, joystick, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Bulldozer — differential-steer tracked dozer with blade and ripper. */
const bulldozer = {
  id: 'bulldozer',
  name: 'Bulldozer',
  category: 'Earthmoving',
  manufacturerRef: 'Caterpillar D-Series O&M Manual (generic)',
  summary: 'Tracked dozer for pushing, grading and ripping. Left joystick steers and propels; right joystick runs the blade.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    throttle(),
    joystick('steerjoy', 'Steer / Propel (Left)', P.leftJoy, [
      { action: 'forward', label: '▲ Forward', dir: [0, -1] },
      { action: 'reverse', label: '▼ Reverse', dir: [0, 1] },
      { action: 'left', label: '◀ Left', dir: [-1, 0] },
      { action: 'right', label: '▶ Right', dir: [1, 0] },
    ]),
    joystick('bladejoy', 'Blade Control (Right)', P.rightJoy, [
      { action: 'raise', label: '▲ Raise', dir: [0, -1] },
      { action: 'lower', label: '▼ Lower', dir: [0, 1] },
      { action: 'tilt-l', label: '◀ Tilt L', dir: [-1, 0] },
      { action: 'tilt-r', label: '▶ Tilt R', dir: [1, 0] },
    ]),
    lever3('ripper', 'Ripper', P.rightConsoleBack, [
      { value: 'up', label: 'RAISED' },
      { value: 'down', label: 'LOWERED' },
    ], '#f97316'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the dozer with the controls at idle.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Dozing Operation',
      description: 'Warm up, drop the blade into the cut, and push a pass of material.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', throttle: 'idle', ripper: 'up' },
      steps: [
        stepReleaseBrake,
        { id: 'throttle', instruction: 'Raise the throttle to MID.', target: 'throttle', expect: { type: 'state', value: 'mid' }, success: 'Engine at working speed.' },
        { id: 'lower-blade', instruction: 'Lower the blade into the cut.', target: 'bladejoy', expect: { type: 'action', value: 'lower' }, success: 'Blade in the ground.' },
        { id: 'push', instruction: 'Push forward to carry the load.', target: 'steerjoy', expect: { type: 'action', value: 'forward' }, success: 'Pushing a full blade.' },
        { id: 'raise-blade', instruction: 'Raise the blade to spread and finish the pass.', target: 'bladejoy', expect: { type: 'action', value: 'raise' }, success: 'Pass complete.' },
      ],
    },
  ],
  hazards: [hzNoBelt, hzDriveWithBrake(['steerjoy'])],
}
export default bulldozer
