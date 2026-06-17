/**
 * Hydraulic Excavator — controls and start-up/operation training.
 * Layout and the hydraulic lockout lever logic are based on the Caterpillar
 * Next Gen excavator Operation & Maintenance Manual (generic). ISO controls.
 */
const excavator = {
  id: 'excavator',
  name: 'Hydraulic Excavator',
  category: 'Excavation',
  manufacturerRef: 'Caterpillar Next Gen O&M Manual (generic, ISO pattern)',
  summary:
    'Tracked digging machine. The hydraulic lockout lever MUST be raised ' +
    '(locked) before starting and lowered (unlocked) only when ready to work. ' +
    'Joysticks follow the ISO control pattern; foot pedals/levers travel the tracks.',
  ready: true,

  controls: [
    {
      id: 'seatbelt',
      type: 'buckle',
      label: 'Seat Belt',
      position: [-0.34, 0.42, 0.42],
      color: '#c2410c',
      states: [
        { value: 'unbuckled', label: 'UNBUCKLED' },
        { value: 'buckled', label: 'BUCKLED' },
      ],
    },
    {
      id: 'lockout',
      type: 'lockout',
      label: 'Hydraulic Lockout Lever',
      position: [-0.52, 0.46, 0.3],
      color: '#ef4444',
      states: [
        { value: 'locked', label: 'LOCKED (raised)' },
        { value: 'unlocked', label: 'UNLOCKED (lowered)' },
      ],
    },
    {
      id: 'ignition',
      type: 'key',
      label: 'Ignition',
      position: [0.46, 0.72, -0.5],
      color: '#94a3b8',
      cycle: false,
      states: [
        { value: 'off', label: 'OFF' },
        { value: 'on', label: 'ON' },
        { value: 'start', label: 'START' },
      ],
    },
    {
      id: 'enginedial',
      type: 'lever',
      label: 'Engine Speed Dial',
      position: [0.5, 0.72, -0.34],
      color: '#0ea5e9',
      states: [
        { value: 'low', label: 'LOW' },
        { value: 'mid', label: 'MID' },
        { value: 'high', label: 'HIGH' },
      ],
    },
    {
      id: 'leftjoy',
      type: 'joystick',
      label: 'Left Joystick (Stick / Swing)',
      position: [-0.46, 0.5, 0.12],
      color: '#1e293b',
      directions: [
        { action: 'stick-out', label: '▲ Stick Out', dir: [0, -1] },
        { action: 'stick-in', label: '▼ Stick In', dir: [0, 1] },
        { action: 'swing-left', label: '◀ Swing Left', dir: [-1, 0] },
        { action: 'swing-right', label: '▶ Swing Right', dir: [1, 0] },
      ],
    },
    {
      id: 'rightjoy',
      type: 'joystick',
      label: 'Right Joystick (Boom / Bucket)',
      position: [0.46, 0.5, 0.12],
      color: '#1e293b',
      directions: [
        { action: 'boom-up', label: '▲ Boom Up', dir: [0, -1] },
        { action: 'boom-down', label: '▼ Boom Down', dir: [0, 1] },
        { action: 'bucket-dump', label: '▶ Bucket Dump', dir: [1, 0] },
        { action: 'bucket-curl', label: '◀ Bucket Curl', dir: [-1, 0] },
      ],
    },
    {
      id: 'travel',
      type: 'pedal',
      label: 'Travel Pedals/Levers',
      position: [0, 0.06, -0.5],
      color: '#334155',
    },
    {
      id: 'horn',
      type: 'button',
      label: 'Horn',
      position: [0.46, 0.46, 0.32],
      color: '#eab308',
    },
  ],

  procedures: [
    {
      id: 'startup',
      title: 'Pre-Operation & Start-Up',
      description:
        'Secure yourself, confirm the hydraulics are LOCKED, then start the ' +
        'engine. The lockout lever prevents the machine from lurching on a ' +
        'bumped joystick during start.',
      // Operator has just climbed in; lockout found in the down/unlocked
      // position so the trainee must actively lock it out.
      initialStates: { lockout: 'unlocked' },
      steps: [
        {
          id: 'belt',
          instruction: 'Fasten your seat belt.',
          target: 'seatbelt',
          expect: { type: 'state', value: 'buckled' },
          success: 'Seat belt fastened.',
        },
        {
          id: 'lock',
          instruction: 'Raise the hydraulic lockout lever to LOCKED before starting.',
          hint: 'The red lever on your left console — raised = locked.',
          target: 'lockout',
          expect: { type: 'state', value: 'locked' },
          success: 'Hydraulics locked out — safe to start.',
        },
        {
          id: 'key-on',
          instruction: 'Turn the ignition to ON and let the system self-check.',
          target: 'ignition',
          expect: { type: 'state', value: 'on' },
          success: 'System check complete.',
        },
        {
          id: 'horn',
          instruction: 'Sound the horn to warn anyone nearby before starting.',
          hint: 'Tap the yellow horn button.',
          target: 'horn',
          expect: { type: 'action', value: 'press' },
          success: 'Area warned.',
        },
        {
          id: 'key-start',
          instruction: 'Crank the engine — turn the key to START.',
          target: 'ignition',
          expect: { type: 'state', value: 'start' },
          success: 'Engine running. Let it warm before working.',
        },
      ],
    },
    {
      id: 'operate',
      title: 'Basic Digging Operation',
      description:
        'Activate the hydraulics and run a basic dig cycle: position, dig, ' +
        'swing, and dump using the ISO joystick pattern.',
      // Engine already started with hydraulics still locked out for safety.
      initialStates: {
        seatbelt: 'buckled',
        lockout: 'locked',
        ignition: 'start',
        enginedial: 'low',
      },
      steps: [
        {
          id: 'unlock',
          instruction: 'Lower the hydraulic lockout lever to UNLOCKED to activate the controls.',
          target: 'lockout',
          expect: { type: 'state', value: 'unlocked' },
          success: 'Hydraulics live.',
        },
        {
          id: 'rpm',
          instruction: 'Raise the engine speed dial to MID.',
          target: 'enginedial',
          expect: { type: 'state', value: 'mid' },
          success: 'Engine speed set.',
        },
        {
          id: 'boom-down',
          instruction: 'Lower the boom toward the dig face.',
          hint: 'RIGHT joystick — boom down.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'boom-down' },
          success: 'Boom positioned.',
        },
        {
          id: 'stick-in',
          instruction: 'Pull the stick in to drag the bucket through the material.',
          hint: 'LEFT joystick — stick in.',
          target: 'leftjoy',
          expect: { type: 'action', value: 'stick-in' },
          success: 'Stick drawn in.',
        },
        {
          id: 'curl',
          instruction: 'Curl the bucket to capture the load.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'bucket-curl' },
          success: 'Bucket loaded.',
        },
        {
          id: 'boom-up',
          instruction: 'Raise the boom to clear the trench.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'boom-up' },
          success: 'Load lifted clear.',
        },
        {
          id: 'swing',
          instruction: 'Swing to the spoil pile (swing right).',
          target: 'leftjoy',
          expect: { type: 'action', value: 'swing-right' },
          success: 'Swung to dump position.',
        },
        {
          id: 'dump',
          instruction: 'Dump the bucket.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'bucket-dump' },
          success: 'Load dumped. Dig cycle complete.',
        },
      ],
    },
  ],

  hazards: [
    {
      id: 'start-unlocked',
      when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.lockout !== 'locked',
      cause: 'Hydraulics not locked out',
      message:
        'You started the engine with the hydraulic lockout DISENGAGED. A bumped ' +
        'joystick at start-up can swing the boom or lurch the machine into ' +
        'people or structures. Always lock out the hydraulics before starting.',
    },
    {
      id: 'start-no-belt',
      when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.seatbelt !== 'buckled',
      cause: 'Restraint not secured',
      message: 'You started the engine without your seat belt fastened. Buckle up before operating.',
    },
    {
      id: 'operate-locked',
      when: (w, r) =>
        (r.controlId === 'leftjoy' || r.controlId === 'rightjoy' || r.controlId === 'travel') &&
        w.controls.lockout === 'locked' &&
        w.controls.ignition === 'start',
      // Not fatal in reality (controls are simply dead), so this is handled as
      // coaching rather than a hazard. Kept out of hazards on purpose.
      when_disabled: true,
      message: '',
    },
  ].filter((h) => !h.when_disabled),
}

export default excavator
