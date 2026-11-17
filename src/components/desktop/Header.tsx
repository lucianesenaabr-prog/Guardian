import { store } from '../../state/store'
import { Logo } from '../Logo'

/** Cabeçalho da central. Depois do pareamento mostra o status e o botão de reiniciar. */
export function Header({ paired = false }: { paired?: boolean }) {
  return (
    <header className="top">
      <div className="brand">
        <Logo />{' '}
        <span>Guardian</span>
        <em>Central de Emergência Digital</em>
      </div>
      <div className="top-right">
        {paired && <span className="paired">● Celular emparelhado</span>}
        <span className="badge">Simulação</span>
        {paired && (
          <button className="ghost" onClick={() => store.reset()}>
            Reiniciar cenário
          </button>
        )}
      </div>
    </header>
  )
}
