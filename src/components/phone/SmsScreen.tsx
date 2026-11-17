import { scenario } from '../../data/scenario'
import { useStore } from '../../state/store'
import { PhoneScreen } from './shared'

const { line } = scenario

const CARRIER_MESSAGES = [
  `${line.carrier}: recebemos sua solicitação de bloqueio. Protocolo 000123.`,
  `${line.carrier}: a linha ${line.number} foi suspensa.`,
  `${line.carrier}: chip desativado. Bloqueio concluído.`,
]

/** Mensagens da operadora: aparecem uma a uma conforme o bloqueio da linha avança. */
export function SmsScreen() {
  const received = useStore().phone.fx.line.msgs

  return (
    <PhoneScreen title={`Mensagens · ${line.carrier}`}>
      {received === 0 && <p className="p-sub">Aguardando mensagens da operadora…</p>}
      {CARRIER_MESSAGES.slice(0, received).map((text) => (
        <p key={text} className="p-bubble">
          {text}
        </p>
      ))}
    </PhoneScreen>
  )
}
