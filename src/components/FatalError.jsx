import { useSimStore } from '../state/useSimStore'

/** Full-screen red failure state. The run resets and the operator starts over. */
export default function FatalError() {
  const fatal = useSimStore((s) => s.fatal)
  const restart = useSimStore((s) => s.restartAfterFatal)
  if (!fatal) return null

  return (
    <div className="fatal" role="alertdialog" aria-modal="true">
      <div className="fatal-inner">
        <div className="fatal-icon">⚠</div>
        <h1>FATAL ERROR</h1>
        {fatal.cause && <div className="fatal-cause">{fatal.cause}</div>}
        <p>{fatal.message}</p>
        <button className="danger big" onClick={restart}>
          Restart Procedure
        </button>
        <div className="fatal-foot">
          In real operation a mistake like this can injure people or destroy
          equipment. Run it again until it's second nature.
        </div>
      </div>
    </div>
  )
}
