import { useSimStore } from '../state/useSimStore'
import Cab from '../three/Cab'
import FatalError from './FatalError'

export default function SimulatorScreen() {
  const equipment = useSimStore((s) => s.equipment)
  const goSelect = useSimStore((s) => s.goSelect)
  const procedureIndex = useSimStore((s) => s.procedureIndex)
  const selectProcedure = useSimStore((s) => s.selectProcedure)
  const stepIndex = useSimStore((s) => s.stepIndex)
  const status = useSimStore((s) => s.status)
  const feedback = useSimStore((s) => s.feedback)
  const resetProcedure = useSimStore((s) => s.resetProcedure)
  const attempts = useSimStore((s) => s.attempts)

  const procedure = equipment.procedures[procedureIndex]
  const step = procedure.steps[stepIndex]
  const progress = Math.round((stepIndex / procedure.steps.length) * 100)

  return (
    <div className="sim">
      <div className="sim-3d">
        <Cab />
        <div className="look-hint">drag to look around the cab</div>
      </div>

      <aside className="panel">
        <header className="panel-head">
          <button className="ghost" onClick={goSelect}>← Fleet</button>
          <div className="panel-title">
            <strong>{equipment.name}</strong>
            <span>{equipment.manufacturerRef}</span>
          </div>
        </header>

        <div className="proc-tabs">
          {equipment.procedures.map((p, i) => (
            <button
              key={p.id}
              className={`tab ${i === procedureIndex ? 'active' : ''}`}
              onClick={() => selectProcedure(i)}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {status === 'complete' ? (
          <div className="complete">
            <div className="complete-icon">✓</div>
            <h3>Procedure Complete</h3>
            <p>{procedure.title} finished cleanly{attempts ? ` after ${attempts} reset(s)` : ''}. Great work, operator.</p>
            <button className="primary" onClick={resetProcedure}>Run Again</button>
          </div>
        ) : (
          <div className="step">
            <div className="step-count">
              Step {Math.min(stepIndex + 1, procedure.steps.length)} of {procedure.steps.length}
            </div>
            <p className="proc-desc">{procedure.description}</p>
            <div className="instruction">
              <span className="num">{stepIndex + 1}</span>
              <div>
                <p>{step.instruction}</p>
                {step.hint && <p className="hint">💡 {step.hint}</p>}
              </div>
            </div>

            {feedback && (
              <div className={`feedback ${feedback.kind}`}>{feedback.text}</div>
            )}

            <button className="ghost small reset" onClick={resetProcedure}>
              ↺ Restart this procedure
            </button>
          </div>
        )}

        <div className="safety-note">
          ⚠ Unsafe actions trigger a Fatal Error and reset the run.
        </div>
      </aside>

      <FatalError />
    </div>
  )
}
