import { P, belt, ignition, parkBrake, wheel, throttle, lever3, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Wheel Tractor-Scraper — self-loading cut/haul/spread earthmover. */
const scraper = {
  id: 'scraper',
  name: 'Wheel Tractor-Scraper',
  category: 'Earthmoving',
  manufacturerRef: 'Caterpillar Scraper O&M Manual (generic)',
  summary: 'Self-loading earthmover. Lower the bowl to cut, open the apron to load, then haul and eject the spread.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    wheel(),
    throttle(),
    lever3('transmission', 'Transmission (F-N-R)', P.rightConsoleBack, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#22c55e'),
    lever3('bowl', 'Bowl', P.rightConsoleFront, [
      { value: 'up', label: 'RAISED' },
      { value: 'down', label: 'LOWERED (cut)' },
    ]),
    lever3('apron', 'Apron', P.leftConsoleMid, [
      { value: 'closed', label: 'CLOSED' },
      { value: 'open', label: 'OPEN' },
    ], '#f97316'),
    lever3('ejector', 'Ejector', P.leftConsoleBack, [
      { value: 'back', label: 'BACK' },
      { value: 'forward', label: 'EJECT' },
    ], '#a855f7'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the tractor.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Load, Haul & Eject',
      description: 'Run a full scraper cycle: cut a load, haul it, and eject.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', throttle: 'idle', transmission: 'neutral', bowl: 'up', apron: 'closed', ejector: 'back' },
      steps: [
        stepReleaseBrake,
        { id: 'throttle', instruction: 'Bring the throttle to MID.', target: 'throttle', expect: { type: 'state', value: 'mid' }, success: 'Power up.' },
        { id: 'open-apron', instruction: 'Open the apron to take a load.', target: 'apron', expect: { type: 'state', value: 'open' }, success: 'Apron open.' },
        { id: 'lower-bowl', instruction: 'Lower the bowl into the cut.', target: 'bowl', expect: { type: 'state', value: 'down' }, success: 'Cutting.' },
        { id: 'drive', instruction: 'Move FORWARD to load and haul.', target: 'transmission', expect: { type: 'state', value: 'forward' }, success: 'Loading on the move.' },
        { id: 'raise-bowl', instruction: 'Raise the bowl for hauling.', target: 'bowl', expect: { type: 'state', value: 'up' }, success: 'Loaded and hauling.' },
        { id: 'eject', instruction: 'Eject the load to spread it.', target: 'ejector', expect: { type: 'state', value: 'forward' }, success: 'Load spread. Cycle complete.' },
      ],
    },
  ],
  hazards: [hzNoBelt, hzDriveWithBrake(['transmission'])],
}
export default scraper
