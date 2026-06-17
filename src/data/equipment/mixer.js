import { P, belt, ignition, parkBrake, wheel, lever3, stepBelt, stepKeyOn, stepKeyStart, stepReleaseBrake, hzNoBelt, hzDriveWithBrake } from './_common'

/** Concrete Mixer Truck — transit mixer with drum charge/mix/discharge. */
const mixer = {
  id: 'mixer',
  name: 'Concrete Mixer Truck',
  category: 'Concrete',
  manufacturerRef: 'McNeilus / Oshkosh Mixer O&M Manual (generic)',
  summary: 'Transit mixer. Keep the drum turning to mix in transit, then reverse it to discharge at the pour.',
  ready: true,
  controls: [
    belt(),
    ignition(),
    parkBrake(),
    wheel(),
    lever3('transmission', 'Transmission (F-N-R)', P.rightConsoleBack, [
      { value: 'neutral', label: 'NEUTRAL' },
      { value: 'forward', label: 'FORWARD' },
      { value: 'reverse', label: 'REVERSE' },
    ], '#22c55e'),
    lever3('drum', 'Drum Direction', P.rightConsoleFront, [
      { value: 'charge', label: 'CHARGE' },
      { value: 'mix', label: 'MIX' },
      { value: 'discharge', label: 'DISCHARGE' },
    ], '#f97316'),
    lever3('drumspeed', 'Drum Speed', P.leftConsoleFront, [
      { value: 'low', label: 'LOW' },
      { value: 'high', label: 'HIGH' },
    ], '#0ea5e9'),
  ],
  procedures: [
    {
      id: 'startup', title: 'Pre-Operation & Start-Up',
      description: 'Secure yourself and start the truck.',
      steps: [stepBelt, stepKeyOn, stepKeyStart],
    },
    {
      id: 'operate', title: 'Transit & Pour',
      description: 'Keep the load mixing in transit, then discharge at the site.',
      initialStates: { seatbelt: 'buckled', ignition: 'start', parkbrake: 'on', transmission: 'neutral', drum: 'charge', drumspeed: 'low' },
      steps: [
        { id: 'mix', instruction: 'Set the drum to MIX to keep the load agitated.', target: 'drum', expect: { type: 'state', value: 'mix' }, success: 'Drum mixing.' },
        stepReleaseBrake,
        { id: 'drive', instruction: 'Drive FORWARD to the pour site.', target: 'transmission', expect: { type: 'state', value: 'forward' }, success: 'In transit, drum turning.' },
        { id: 'stop', instruction: 'At the site, return the transmission to NEUTRAL.', target: 'transmission', expect: { type: 'state', value: 'neutral' }, success: 'Positioned at the pour.' },
        { id: 'discharge', instruction: 'Set the drum to DISCHARGE to pour.', target: 'drum', expect: { type: 'state', value: 'discharge' }, success: 'Pouring. Load delivered.' },
      ],
    },
  ],
  hazards: [hzNoBelt, hzDriveWithBrake(['transmission'])],
}
export default mixer
