import { useState } from 'react'
import { useSimStore } from '../state/useSimStore'
import { EQUIPMENT, CATEGORIES } from '../data/equipment'

export default function EquipmentSelect() {
  const goHome = useSimStore((s) => s.goHome)
  const startEquipment = useSimStore((s) => s.startEquipment)
  const [filter, setFilter] = useState('All')

  const list = filter === 'All' ? EQUIPMENT : EQUIPMENT.filter((e) => e.category === filter)

  return (
    <div className="select">
      <header className="topbar">
        <button className="ghost" onClick={goHome}>← Home</button>
        <h2>Select Equipment</h2>
        <span />
      </header>

      <div className="filters">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            className={`chip ${filter === c ? 'active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {list.map((eq) => (
          <button
            key={eq.id}
            className={`card ${eq.ready ? '' : 'disabled'}`}
            onClick={() => eq.ready && startEquipment(eq)}
            disabled={!eq.ready}
          >
            <div className="card-top">
              <span className="cat">{eq.category}</span>
              {eq.ready
                ? <span className="ready">● Ready</span>
                : <span className="soon">Coming soon</span>}
            </div>
            <h3>{eq.name}</h3>
            <p>{eq.summary}</p>
            <div className="card-foot">{eq.manufacturerRef}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
