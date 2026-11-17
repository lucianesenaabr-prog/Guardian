import { MODULES, STATUS_LABEL } from '../../data/modules'
import { scenario } from '../../data/scenario'
import { useStore } from '../../state/store'
import { Logo } from '../Logo'
import { PhoneScreen } from './shared'

const { device, user } = scenario

/** App Guardian no celular: resumo das proteções ou, durante o registro, o comprovante. */
export function GuardianScreen() {
  const state = useStore()
  const { fx, view } = state.phone

  if (view === 'ocorrencia' || fx.report.sent) {
    return (
      <PhoneScreen
        title={
          <>
            <Logo size={20} /> Ocorrência
          </>
        }
      >
        <p className="p-lead">{fx.report.sent ? 'Comprovante (simulação)' : 'Preparando dados'}</p>
        <ul className="p-list">
          <li>
            <span>Fato</span>
            <b>Roubo/perda de celular</b>
          </li>
          <li>
            <span>Aparelho</span>
            <b>{device.model}</b>
          </li>
          <li>
            <span>IMEI</span>
            <b>{device.imei}</b>
          </li>
          <li>
            <span>Titular</span>
            <b>{user.name}</b>
          </li>
          <li>
            <span>Protocolo</span>
            <b>{fx.report.sent ? 'BO-SIM-000123' : 'Aguardando envio'}</b>
          </li>
        </ul>
      </PhoneScreen>
    )
  }

  return (
    <PhoneScreen
      title={
        <>
          <Logo size={20} /> Guardian
        </>
      }
    >
      <p className="p-lead">{state.emergency ? 'Proteção ativa' : 'Dispositivo protegido e vinculado'}</p>
      <p className="p-sub">
        {device.model} · {user.name}
      </p>
      <ul className="p-list">
        {MODULES.map((m) => (
          <li key={m.id}>
            <span>{m.category}</span>
            <b className={`dot ${state.modules[m.id].status}`}>
              {STATUS_LABEL[state.modules[m.id].status]}
            </b>
          </li>
        ))}
      </ul>
    </PhoneScreen>
  )
}
