import { Dashboard } from './components/desktop/Dashboard'
import { Phone } from './components/phone/Phone'

/** Tela dividida: central de emergência no computador e celular virtual ao lado. */
export function App() {
  return (
    <div className="shell">
      <Dashboard />
      <aside className="side">
        <Phone />
      </aside>
    </div>
  )
}
