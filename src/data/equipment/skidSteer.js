/**
 * Skid Steer Loader — controls and start-up/operation training.
 * Control layout and interlock logic are based on the Bobcat S-Series
 * Operation & Maintenance Manual (seat bar restraint system, BICS interlocks).
 */
const skidSteer = {
  id: 'skid-steer',
  name: 'Skid Steer Loader',
  category: 'Loaders',
  manufacturerRef: 'Bobcat S-Series O&M Manual (generic)',
  summary:
    'Compact, highly maneuverable loader with a seat-bar restraint system and ' +
    'BICS interlocks. You steer by driving the left/right tracks at different speeds.',
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
      id: 'seatbar',
      type: 'lapbar',
      label: 'Seat Bar (Restraint)',
      position: [0, 0.62, 0.34],
      color: '#facc15',
      states: [
        { value: 'up', label: 'RAISED' },
        { value: 'down', label: 'LOWERED' },
      ],
    },
    {
      id: 'parkbrake',
      type: 'toggle',
      label: 'Parking Brake',
      position: [-0.5, 0.55, -0.1],
      color: '#ef4444',
      states: [
        { value: 'on', label: 'ENGAGED' },
        { value: 'off', label: 'RELEASED' },
      ],
    },
    {
      id: 'ignition',
      type: 'key',
      label: 'Ignition',
      position: [0.42, 0.74, -0.55],
      color: '#94a3b8',
      cycle: false,
      states: [
        { value: 'off', label: 'OFF' },
        { value: 'run', label: 'RUN' },
        { value: 'start', label: 'START' },
      ],
    },
    {
      id: 'throttle',
      type: 'lever',
      label: 'Hand Throttle',
      position: [-0.5, 0.6, -0.45],
      color: '#0ea5e9',
      states: [
        { value: 'idle', label: 'IDLE' },
        { value: 'mid', label: 'MID' },
        { value: 'high', label: 'HIGH' },
      ],
    },
    {
      id: 'auxhyd',
      type: 'toggle',
      label: 'Auxiliary Hydraulics',
      position: [0.5, 0.74, -0.4],
      color: '#22c55e',
      states: [
        { value: 'off', label: 'OFF' },
        { value: 'on', label: 'ON' },
      ],
    },
    {
      id: 'leftjoy',
      type: 'joystick',
      label: 'Left Joystick (Drive)',
      position: [-0.46, 0.5, 0.12],
      color: '#1e293b',
      directions: [
        { action: 'forward', label: '▲ Forward', dir: [0, -1] },
        { action: 'reverse', label: '▼ Reverse', dir: [0, 1] },
        { action: 'left', label: '◀ Left', dir: [-1, 0] },
        { action: 'right', label: '▶ Right', dir: [1, 0] },
      ],
    },
    {
      id: 'rightjoy',
      type: 'joystick',
      label: 'Right Joystick (Loader)',
      position: [0.46, 0.5, 0.12],
      color: '#1e293b',
      directions: [
        { action: 'raise', label: '▲ Raise Arms', dir: [0, -1] },
        { action: 'lower', label: '▼ Lower Arms', dir: [0, 1] },
        { action: 'dump', label: '▶ Dump Bucket', dir: [1, 0] },
        { action: 'curl', label: '◀ Curl Bucket', dir: [-1, 0] },
      ],
    },
  ],

  procedures: [
    {
      id: 'startup',
      title: 'Pre-Operation & Start-Up',
      description:
        'Enter the machine, secure the restraint system, and start the engine ' +
        'safely. The seat bar and seat belt must be engaged before the loader ' +
        'functions will activate.',
      steps: [
        {
          id: 'belt',
          instruction: 'Fasten your seat belt.',
          hint: 'Tap the orange seat belt buckle at your left hip.',
          target: 'seatbelt',
          expect: { type: 'state', value: 'buckled' },
          success: 'Seat belt fastened.',
        },
        {
          id: 'lowerbar',
          instruction: 'Lower the seat bar (restraint bar).',
          hint: 'Pull the yellow bar down across your lap. This arms the BICS interlocks.',
          target: 'seatbar',
          expect: { type: 'state', value: 'down' },
          success: 'Seat bar lowered — interlocks armed.',
        },
        {
          id: 'key-run',
          instruction: 'Turn the ignition key to RUN and watch the dash check.',
          hint: 'Tap the key once to go OFF → RUN.',
          target: 'ignition',
          expect: { type: 'state', value: 'run' },
          success: 'Key in RUN — system check passed.',
        },
        {
          id: 'key-start',
          instruction: 'Turn the key to START to crank the engine.',
          hint: 'Tap the key again to go RUN → START.',
          target: 'ignition',
          expect: { type: 'state', value: 'start' },
          success: 'Engine running.',
        },
      ],
    },
    {
      id: 'operate',
      title: 'Basic Loader Operation',
      description:
        'With the engine running and restraints secured, warm the machine and ' +
        'practice the lift and tilt functions, then drive.',
      // This lesson begins with the machine already started up safely.
      initialStates: {
        seatbelt: 'buckled',
        seatbar: 'down',
        ignition: 'start',
        throttle: 'idle',
        parkbrake: 'off',
      },
      steps: [
        {
          id: 'warm-throttle',
          instruction: 'Bring the throttle up to MID to warm the hydraulics.',
          target: 'throttle',
          expect: { type: 'state', value: 'mid' },
          success: 'Engine at mid throttle.',
        },
        {
          id: 'curl',
          instruction: 'Curl the bucket back (roll it toward you).',
          hint: 'Use the RIGHT joystick — curl.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'curl' },
          success: 'Bucket curled.',
        },
        {
          id: 'raise',
          instruction: 'Raise the lift arms.',
          hint: 'RIGHT joystick — raise.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'raise' },
          success: 'Arms raised.',
        },
        {
          id: 'lower',
          instruction: 'Lower the lift arms back down.',
          target: 'rightjoy',
          expect: { type: 'action', value: 'lower' },
          success: 'Arms lowered.',
        },
        {
          id: 'drive',
          instruction: 'Drive forward.',
          hint: 'LEFT joystick — forward.',
          target: 'leftjoy',
          expect: { type: 'action', value: 'forward' },
          success: 'Moving forward under control. Lesson complete.',
        },
      ],
    },
  ],

  hazards: [
    {
      id: 'start-no-belt',
      when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.seatbelt !== 'buckled',
      cause: 'Restraint not secured',
      message:
        'You cranked the engine without your seat belt fastened. The seat-bar ' +
        'restraint system is part of the operator protection design — never ' +
        'operate the machine unbuckled.',
    },
    {
      id: 'start-bar-up',
      when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.seatbar !== 'down',
      cause: 'Seat bar raised',
      message:
        'You started the engine with the seat bar raised. With the bar up the ' +
        'BICS interlocks are not armed and loader functions are unsafe. Lower ' +
        'the seat bar first.',
    },
    {
      id: 'loader-bar-up',
      when: (w, r) =>
        (r.controlId === 'rightjoy' || r.controlId === 'leftjoy') &&
        w.controls.seatbar !== 'down',
      cause: 'Safety interlock bypassed',
      message:
        'You operated the drive/loader controls with the seat bar raised. The ' +
        'restraint bar must be lowered before any machine function is used.',
    },
    {
      id: 'highthrottle-start',
      when: (w, r) => r.controlId === 'ignition' && r.value === 'start' && w.controls.throttle === 'high',
      cause: 'High throttle on start',
      message:
        'You started the engine at HIGH throttle. The machine can surge ' +
        'dangerously. Always start at idle.',
    },
  ],
}

export default skidSteer
