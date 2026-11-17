import { scenario } from '../../data/scenario'
import { useStore } from '../../state/store'
import { PhoneScreen, Row } from './shared'

/** App de e-mail: segurança da conta (sessões, senha, 2 etapas, recuperação, regras). */
export function MailScreen() {
  const { mail } = useStore().phone.fx

  return (
    <PhoneScreen title="E-mail · Segurança" color="#0E7490">
      <p className="p-sub">{scenario.user.email}</p>
      <ul className="p-list">
        <Row label="Sessões e dispositivos" before="3 ativos" after="Encerrados" done={mail.sessions} />
        <Row label="Senha" before="Atual" after="Redefinida" done={mail.password} />
        <Row label="Verificação em 2 etapas" before="Desativada" after="Ativada" done={mail.twofa} />
        <Row
          label="Telefone de recuperação"
          before={scenario.line.number}
          after="Removido"
          done={mail.recovery}
        />
        <Row label="Regras de encaminhamento" before="Não revisadas" after="Revisadas" done={mail.rules} />
      </ul>
    </PhoneScreen>
  )
}
