import { store, useStore } from '../../state/store'
import type { AppId } from '../../state/types'
import { Logo } from '../Logo'

const HOME_APPS: { id: AppId; name: string; color: string; glyph: string }[] = [
  { id: 'guardian', name: 'Guardian', color: 'var(--primary)', glyph: '' },
  { id: 'email', name: 'E-mail', color: '#0E7490', glyph: '✉' },
  { id: 'banco', name: 'Banco', color: '#7C3AED', glyph: '$' },
]

/** Tela inicial do celular. Apps que o Guardian está usando aparecem com cadeado. */
export function HomeScreen() {
  const { phone } = useStore()
  const isLocked = (id: AppId) => !!phone.busy && (phone.busy.app === 'all' || phone.busy.app === id)

  return (
    <div className="p-home">
      <div className="p-grid">
        {HOME_APPS.map((app) => (
          <button
            key={app.id}
            className={`p-app ${isLocked(app.id) ? 'locked' : ''}`}
            onClick={() => store.openApp(app.id)}
          >
            <span className="p-icon" style={{ background: app.color }}>
              {app.id === 'guardian' ? <Logo size={26} /> : app.glyph}
              {isLocked(app.id) && <i className="p-lock">🔒</i>}
            </span>
            {app.name}
          </button>
        ))}
      </div>
    </div>
  )
}
