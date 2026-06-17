import { useSimStore } from './state/useSimStore'
import HomeScreen from './components/HomeScreen'
import EquipmentSelect from './components/EquipmentSelect'
import SimulatorScreen from './components/SimulatorScreen'
import './App.css'

export default function App() {
  const screen = useSimStore((s) => s.screen)

  return (
    <div className="app">
      {screen === 'home' && <HomeScreen />}
      {screen === 'select' && <EquipmentSelect />}
      {screen === 'sim' && <SimulatorScreen />}
    </div>
  )
}
