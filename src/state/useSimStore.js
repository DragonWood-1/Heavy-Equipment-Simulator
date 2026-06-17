import { create } from 'zustand'

/**
 * Central simulator state.
 *
 * The simulator is fully data-driven: an "equipment" definition supplies the
 * 3D controls, the guided procedures (ordered steps), and the safety hazards
 * (invariants checked on every interaction). This store runs the engine that
 * ties them together.
 */
export const useSimStore = create((set, get) => ({
  // ---- navigation ----
  screen: 'home', // 'home' | 'select' | 'sim'
  equipment: null, // active equipment definition
  procedureIndex: 0,

  // ---- runtime ----
  controlStates: {}, // controlId -> current discrete state value (e.g. 'on')
  stepIndex: 0,
  status: 'idle', // 'idle' | 'running' | 'fatal' | 'complete'
  feedback: null, // { kind:'good'|'bad'|'info', text }
  fatal: null, // { title, message, cause } when a fatal error occurs
  attempts: 0,
  log: [], // completed step history for the current run

  // ---- navigation actions ----
  goHome: () => set({ screen: 'home', equipment: null }),
  goSelect: () => set({ screen: 'select' }),

  startEquipment: (equipment) => {
    set({ screen: 'sim', equipment, procedureIndex: 0 })
    get().resetProcedure()
  },

  selectProcedure: (index) => {
    set({ procedureIndex: index })
    get().resetProcedure()
  },

  /** Reset the active procedure to its starting state. */
  resetProcedure: () => {
    const { equipment, procedureIndex } = get()
    if (!equipment) return
    const procedure = equipment.procedures[procedureIndex]
    const overrides = procedure?.initialStates || {}
    const initial = {}
    for (const c of equipment.controls) {
      // discrete controls start at their first declared state unless the
      // procedure overrides it (e.g. an "operate" lesson begins with the
      // engine already running). Momentary controls have no resting state.
      if (c.states && c.states.length) {
        initial[c.id] = overrides[c.id] ?? c.states[0].value
      }
    }
    set({
      controlStates: initial,
      stepIndex: 0,
      status: 'running',
      feedback: null,
      fatal: null,
      log: [],
    })
  },

  /** Full restart after a fatal error — same procedure from scratch. */
  restartAfterFatal: () => {
    set((s) => ({ attempts: s.attempts + 1 }))
    get().resetProcedure()
  },

  /**
   * The single entry point for every control interaction in the 3D cab.
   * @param {string} controlId
   * @param {{action?:string, value?:string}} interaction
   */
  interact: (controlId, interaction = {}) => {
    const state = get()
    if (state.status !== 'running') return

    const equipment = state.equipment
    const control = equipment.controls.find((c) => c.id === controlId)
    if (!control) return

    // 1. Resolve the resulting control state.
    const nextStates = { ...state.controlStates }
    let resolved = { controlId, action: interaction.action, value: interaction.value }

    if (control.states && control.states.length) {
      // Discrete control: either set explicitly or advance to next state.
      if (interaction.value !== undefined) {
        nextStates[controlId] = interaction.value
      } else {
        const order = control.states.map((s) => s.value)
        const cur = state.controlStates[controlId]
        const idx = order.indexOf(cur)
        // 'key' style controls don't wrap; others cycle.
        const nextIdx = control.cycle === false
          ? Math.min(idx + 1, order.length - 1)
          : (idx + 1) % order.length
        nextStates[controlId] = order[nextIdx]
      }
      resolved.value = nextStates[controlId]
    }

    // Build the world snapshot hazards/steps see *after* this interaction.
    const world = { controls: nextStates, equipment }

    // 2. Hazard check (safety invariants) — these cause fatal errors.
    for (const hz of equipment.hazards || []) {
      try {
        if (hz.when(world, resolved)) {
          set({
            controlStates: nextStates,
            status: 'fatal',
            fatal: {
              title: 'FATAL ERROR',
              message: hz.message,
              cause: hz.cause || null,
            },
          })
          return
        }
      } catch (e) {
        // a malformed hazard should never crash the sim
        console.error('hazard check failed', hz.id, e)
      }
    }

    // 3. Step progression.
    const procedure = equipment.procedures[state.procedureIndex]
    const step = procedure.steps[state.stepIndex]
    const matched = matchExpectation(step, resolved, world)

    if (matched) {
      const nextStepIndex = state.stepIndex + 1
      const done = nextStepIndex >= procedure.steps.length
      set({
        controlStates: nextStates,
        stepIndex: nextStepIndex,
        status: done ? 'complete' : 'running',
        feedback: done
          ? { kind: 'good', text: 'Procedure complete. Well done, operator.' }
          : { kind: 'good', text: step.success || 'Correct.' },
        log: [...state.log, step.id],
      })
    } else {
      // Wrong, but not hazardous — coach, don't punish.
      set({
        controlStates: nextStates,
        feedback: { kind: 'bad', text: step.wrong || 'That is not the next step. Check the instruction and hint.' },
      })
    }
  },
}))

/**
 * Does the resolved interaction satisfy the current step?
 * Steps declare a `target` control plus an `expect`:
 *   { type:'state', value }  — discrete control reached this value
 *   { type:'action', value } — momentary action fired (joystick dir, button)
 *   { type:'custom', test(world, resolved) } — escape hatch
 */
function matchExpectation(step, resolved, world) {
  if (!step) return false
  if (step.expect?.type === 'custom') return !!step.expect.test(world, resolved)
  if (step.target && step.target !== resolved.controlId) return false
  const exp = step.expect || {}
  if (exp.type === 'state') return resolved.value === exp.value
  if (exp.type === 'action') return resolved.action === exp.value
  return false
}
