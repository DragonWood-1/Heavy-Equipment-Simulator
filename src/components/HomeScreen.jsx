import { useSimStore } from '../state/useSimStore'
import { EQUIPMENT } from '../data/equipment'

export default function HomeScreen() {
  const goSelect = useSimStore((s) => s.goSelect)
  const readyCount = EQUIPMENT.filter((e) => e.ready).length

  return (
    <div className="home">
      <div className="home-inner">
        <div className="badge">OPERATOR TRAINING SIMULATOR</div>
        <h1>Heavy Equipment<br />Operations Trainer</h1>
        <p className="lede">
          Learn every control, in the operator's seat, before you ever touch the
          real machine. Realistic cab views and guided start-up &amp; operation
          procedures built from manufacturer operation manuals.
        </p>

        <ul className="features">
          <li>🪑 First-person 3D cab — look around and operate the real controls</li>
          <li>📋 Step-by-step guided procedures for every function</li>
          <li>🛑 Make an unsafe move and you trigger a <b>Fatal Error</b> — and start over</li>
          <li>📱 Works on phone, tablet and desktop</li>
        </ul>

        <button className="primary big" onClick={goSelect}>
          Choose Equipment →
        </button>
        <div className="fleet-note">
          {readyCount} machines ready to train · {EQUIPMENT.length} in the fleet
        </div>
      </div>
    </div>
  )
}
