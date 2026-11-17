import { scenario, type BankId } from '../../data/scenario'
import { store, useStore } from '../../state/store'
import { Row } from './shared'

const { banks, consents, device } = scenario

type Tab = BankId | 'consents'

/** Descobre a aba aberta e, na aba de consentimentos, qual item está em foco. */
function parseView(view: string): { tab: Tab; focus: number } {
  if (view.startsWith('consents')) {
    return { tab: 'consents', focus: view.startsWith('consents:') ? Number(view.split(':')[1]) : -1 }
  }
  return { tab: view === 'meridiano' ? 'meridiano' : 'aurora', focus: -1 }
}

const TABS: { id: Tab; label: string }[] = [
  ...banks.map((b) => ({ id: b.id, label: b.name.replace('Banco ', '') })),
  { id: 'consents', label: 'Consentimentos' },
]

/** App do banco: uma aba por banco e uma aba de consentimentos do Open Finance. */
export function BankScreen() {
  const { fx, view } = useStore().phone
  const { tab, focus } = parseView(view)
  const bank = banks.find((b) => b.id === tab)

  return (
    <div className="p-screen">
      <div className="p-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => store.setView(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {bank ? (
        <>
          <div className="p-appbar" style={{ color: bank.color }}>
            {bank.name}
          </div>
          <ul className="p-list">
            <Row label="Sessões" before="3 aparelhos" after="Encerradas" done={fx.banks[bank.id].session} />
            <Row label={`Cartão ${bank.card}`} before="Ativo" after="Bloqueado" done={fx.banks[bank.id].card} />
            <Row label="Limite do Pix" before="R$ 5.000" after="R$ 0,00" done={fx.banks[bank.id].pix} />
            <Row
              label="Aparelhos confiáveis"
              before={device.model}
              after="Removido"
              done={fx.banks[bank.id].trusted}
            />
          </ul>
        </>
      ) : (
        <>
          <div className="p-appbar" style={{ color: '#7C3AED' }}>
            Open Finance
          </div>
          <p className="p-sub">
            Verificados {fx.consents.reviewed}/{consents.length} · Revogados {fx.consents.revoked}/
            {consents.length}
          </p>
          <ul className="p-list">
            {consents.map((consent, index) => {
              const [status, label] =
                index < fx.consents.revoked
                  ? ['concluido', 'Revogado']
                  : index < fx.consents.reviewed
                    ? ['andamento', 'Verificado']
                    : ['pendente', 'Ativo']
              return (
                <li key={consent.name} className={index === focus ? 'focus' : ''}>
                  <span>
                    {consent.name}
                    {index === focus && (
                      <small>
                        <br />
                        {consent.data} · {consent.validity}
                      </small>
                    )}
                  </span>
                  <b className={`dot ${status}`}>{label}</b>
                </li>
              )
            })}
          </ul>
          {fx.consents.revoked === consents.length && <p className="p-lead">Nenhum consentimento ativo</p>}
        </>
      )}
    </div>
  )
}
