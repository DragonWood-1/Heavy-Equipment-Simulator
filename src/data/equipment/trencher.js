import { P, belt, ignition, parkBrake, throttle, toggle, lever3, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Trencher — chain digging boom with a ground-drive for utility runs. */
const trencher = {
  id: 'trencher',
  name: 'Trencher',
  category: 'Excavation',
  manufacturerRef: 'Ditch Witch / Vermeer O&M Manual (generic)',
  summary: 'Chain trencher for utility runs. Engage the digging chain, set depth, then crawl the ground-drive forward.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    throttle(),
    toggle('chain', 'Digging Chain', P.rightConsoleBack, '#f97316', 'ENGAGED', 'OFF'),
    lever3('boom', 'Boom Depth', P.rightConsoleFront, [
      { value: 'up', label: 'RAISED' },
      { value: 'down', label: 'LOWERED' },
    ]),
    lever3('grounddrive', 'Ground Drive', P.leftConsoleMid, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#22c55e'),
    toggle('conveyor', 'Spoil Conveyor', P.dashR, '#0ea5e9'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself, confirm the chain is OFF, and start.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Trenching Operation',
      description: 'Bring the chain up to speed, set depth, then crawl forward.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', throttle: 'idle', chain: 'off', boom: 'up', grounddrive: 'neutral' },
      steps: [
        stepReleaseBrake,
        { id: 'throttle', instruction: 'Raise the throttle to HIGH for digging.', target: 'throttle', expect: { type: 'state', value: 'high' }, success: 'Engine at digging speed.' },
        { id: 'chain', instruction: 'Engage the digging chain.', hint: 'Stand clear of the chain before engaging.', target: 'chain', expect: { type: 'state', value: 'on' }, success: 'Chain running.' },
        { id: 'boom', instruction: 'Lower the boom to dig depth.', target: 'boom', expect: { type: 'state', value: 'down' }, success: 'Cutting to depth.' },
        { id: 'drive', instruction: 'Crawl the ground-drive FORWARD to advance the trench.', target: 'grounddrive', expect: { type: 'state', value: 'forward' }, success: 'Trenching forward.' },
      ],
    },
  ],
  hazards: [hzNoBelt, hzDriveWithBrake(['grounddrive'])],
}
export default trencher
