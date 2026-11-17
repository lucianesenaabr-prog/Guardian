import { scenario } from '../../data/scenario'
import { useStore } from '../../state/store'
import { PhoneScreen, Row } from './shared'

const { device } = scenario

/** App "Encontrar meu aparelho" do fabricante: localizar, alarme, modo perdido, bloqueio. */
export function FindDeviceScreen() {
  const { device: fx } = useStore().phone.fx

  return (
    <PhoneScreen title={`Encontrar meu aparelho · ${device.maker}`}>
      <div className="p-map">
        {fx.located ? <i className="pin">📍</i> : <span>Localizando…</span>}
      </div>
      <p className="p-sub">{fx.located ? `${device.model} · São Paulo, SP (simulada)` : device.model}</p>
      <ul className="p-list">
        <Row label="Alarme sonoro" before="Desligado" after="Tocando" done={fx.alarm} />
        <Row label="Modo Perdido" before="Inativo" after="Ativo" done={fx.lost} />
        <Row label="Bloqueio remoto" before="Desbloqueado" after="Bloqueado" done={fx.locked} />
        <Row label="Conta do fabricante" before="Conectada" after="Removida" done={fx.signedOut} />
      </ul>
    </PhoneScreen>
  )
}
