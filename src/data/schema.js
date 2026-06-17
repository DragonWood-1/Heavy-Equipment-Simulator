/**
 * Equipment definition schema (documentation only — these are plain JS modules).
 *
 * Every machine in the fleet is described by one of these objects. The 3D cab,
 * the guided training, and the fatal-error system are all generated from it, so
 * adding a new machine is purely a matter of authoring data.
 *
 * @typedef {Object} ControlState
 * @property {string} value   Machine-readable state id, e.g. 'on'
 * @property {string} label   Human label shown in the cab, e.g. 'RUN'
 *
 * @typedef {Object} Control
 * @property {string} id            Unique within the machine
 * @property {ControlType} type     Drives the 3D primitive + interaction model
 * @property {string} label         Name shown on the control
 * @property {[number,number,number]} position  Cab-space position (seated POV)
 * @property {[number,number,number]} [rotation]
 * @property {string} [color]
 * @property {ControlState[]} [states]   Discrete controls only (toggle/key/lever/buckle)
 * @property {boolean} [cycle]           false = clamp at last state (e.g. ignition key)
 * @property {{action:string,label:string,dir:[number,number]}[]} [directions] Joystick only
 *
 * ControlType is one of:
 *   'buckle'   two-state seat belt
 *   'lapbar'   skid-steer seat/restraint bar (up/down)
 *   'lockout'  hydraulic lockout lever (locked/unlocked)
 *   'key'      ignition (off/run/start, non-cycling)
 *   'lever'    throttle / discrete lever
 *   'toggle'   on/off switch
 *   'button'   momentary push button (fires an action)
 *   'pedal'    momentary foot pedal (fires an action)
 *   'joystick' directional control (fires directional actions)
 *
 * @typedef {Object} Step
 * @property {string} id
 * @property {string} instruction  What the operator must do
 * @property {string} [hint]
 * @property {string} [target]     Control id this step concerns
 * @property {{type:'state'|'action'|'custom', value?:string, test?:Function}} expect
 * @property {string} [success]    Feedback on correct action
 * @property {string} [wrong]      Feedback on wrong (non-fatal) action
 *
 * @typedef {Object} Hazard
 * @property {string} id
 * @property {(world:{controls:Object,equipment:Object}, resolved:Object)=>boolean} when
 * @property {string} message      Shown on the red Fatal Error screen
 * @property {string} [cause]      Short tag, e.g. 'Safety interlock bypassed'
 *
 * @typedef {Object} Equipment
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} manufacturerRef  Manual basis, e.g. 'Bobcat S-Series O&M'
 * @property {string} summary
 * @property {boolean} [ready]         false = stub (listed but not yet built)
 * @property {Control[]} controls
 * @property {{id:string,title:string,description:string,steps:Step[]}[]} procedures
 * @property {Hazard[]} hazards
 */

export const CONTROL_TYPES = [
  'buckle', 'lapbar', 'lockout', 'key', 'lever', 'toggle', 'button', 'pedal', 'joystick', 'wheel',
]
