import { findModule, MODULES, STATUS_LABEL } from '../../data/modules'
import { isRegistered, runModule } from '../../engine/protocol'
import { store, useStore } from '../../state/store'
import type { ModuleId } from '../../state/types'
import { Gate } from './Gate'
import { Header } from './Header'

/** Central de emergência: lista as proteções, mostra o progresso e o histórico. */
export function Dashboard() {
  const state = useStore()
  if (!state.pairing.paired) return <Gate />

  const modules = MODULES.map((m) => ({ ...m, ...state.modules[m.id] }))
  const done = modules.filter((m) => m.status === 'concluido').length
  const running = modules.filter((m) => m.status === 'andamento' || m.status === 'processando').length
  const pending = modules.filter((m) => m.status === 'pendente').length
  const busy = !!state.phone.busy

  const execute = (id: ModuleId) => {
    if (busy) return
    if (!store.getState().emergency) store.startEmergency()
    void runModule(id)
  }

  return (
    <main className="desktop">
      <Header paired />

      <section className={`hero ${state.emergency ? 'on' : ''}`}>
        <div>
          <h1>{state.emergency ? 'Protocolo de emergência ativo' : 'Roubo ou perda do celular?'}</h1>
          <p>
            {state.emergency
              ? 'Siga a ordem sugerida abaixo ou escolha qualquer proteção.'
              : 'Inicie o protocolo e proteja seu dispositivo, contas e dinheiro em uma única tela.'}
          </p>
        </div>
        {!state.emergency && (
          <button className="sos" onClick={() => store.startEmergency()}>
            Iniciar protocolo de emergência
          </button>
        )}
      </section>

      <section className="kpis">
        <div>
          <b>
            {done}/{MODULES.length}
          </b>
          <span>Concluídas</span>
        </div>
        <div>
          <b>{running}</b>
          <span>Em andamento</span>
        </div>
        <div>
          <b>{pending}</b>
          <span>Pendentes</span>
        </div>
      </section>

      <section className="panel">
        <h2>Proteções na ordem sugerida</h2>
        <ol className="mods">
          {modules.map((m, index) => (
            <li key={m.id}>
              <span className="idx">{index + 1}</span>
              <div className="mtxt">
                <b>{m.title}</b>
                <small>
                  {m.category} · {m.service}
                </small>
              </div>
              <div className="bar">
                <i style={{ width: `${m.progress}%` }} />
              </div>
              {m.status === 'pendente' && isRegistered(m.id) ? (
                <button
                  className="chip pendente selectable"
                  disabled={busy}
                  onClick={() => execute(m.id)}
                  title="Selecionar para executar"
                >
                  {STATUS_LABEL[m.status]}
                </button>
              ) : (
                <span className={`chip ${m.status}`}>{STATUS_LABEL[m.status]}</span>
              )}
              <button
                disabled={busy || m.status !== 'pendente' || !isRegistered(m.id)}
                onClick={() => execute(m.id)}
              >
                {m.status === 'concluido' ? 'Feito' : 'Executar'}
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="panel">
        <h2>Histórico de atividades</h2>
        {state.history.length === 0 ? (
          <p className="empty">Nenhuma atividade ainda. Inicie o protocolo e execute uma proteção.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Horário</th>
                <th>Operação</th>
                <th>Etapa</th>
                <th>Resultado</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.history.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.at}</td>
                  <td>{findModule(entry.moduleId)?.category}</td>
                  <td>{entry.step}</td>
                  <td>{entry.result}</td>
                  <td>
                    <span className={`chip ${entry.status}`}>{STATUS_LABEL[entry.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}
