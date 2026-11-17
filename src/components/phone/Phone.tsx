import { scenario } from '../../data/scenario'
import { store, useStore } from '../../state/store'
import { BankScreen } from './BankScreen'
import { FindDeviceScreen } from './FindDeviceScreen'
import { GuardianScreen } from './GuardianScreen'
import { HomeScreen } from './HomeScreen'
import { MailScreen } from './MailScreen'
import { PairScreen } from './PairScreen'
import { SmsScreen } from './SmsScreen'

const { device } = scenario

/** Smartphone virtual. Lê o mesmo estado da central, então reage a cada passo executado. */
export function Phone() {
  const state = useStore()
  const { app, notifications, busy, fx } = state.phone
  const latest = notifications[0]

  // Bloqueio remoto aplicado e nenhum passo em andamento: mostra a tela de bloqueio.
  const showLockScreen = fx.device.locked && !busy
  // Enquanto o Guardian usa o app aberto, cobre a tela com "Aplicativo bloqueado".
  const showBusyOverlay = !!busy && (busy.app === 'all' || busy.app === app)

  return (
    <div className="phone" aria-label="Smartphone virtual">
      <div className="p-notch" />
      <div className="p-status">
        <span>09:41</span>
        <span>{fx.line.suspended ? 'Sem serviço' : '5G ▂▄▆'} · 82%</span>
      </div>

      <div className="p-body">
        {!state.pairing.paired && <PairScreen />}

        {state.pairing.paired && (
          <>
            {latest && !showLockScreen && (
              <button className="p-notif" onClick={() => store.dismiss(latest.id)}>
                <b>{latest.title}</b>
                <span>{latest.body}</span>
              </button>
            )}

            {app === 'home' && <HomeScreen />}
            {app === 'guardian' && <GuardianScreen />}
            {app === 'email' && <MailScreen />}
            {app === 'banco' && <BankScreen />}
            {app === 'encontrar' && <FindDeviceScreen />}
            {app === 'sms' && <SmsScreen />}

            {showBusyOverlay && (
              <div className="p-block" role="status">
                <div className="p-blockcard">
                  <span className="p-spin" />
                  <b>Aplicativo bloqueado</b>
                  <small>
                    Guardian está executando:
                    <br />
                    {busy.label}
                  </small>
                </div>
              </div>
            )}

            {showLockScreen && (
              <div className="p-lockscreen">
                <span style={{ fontSize: 34 }}>🔒</span>
                <b>{fx.device.lost ? 'Aparelho perdido' : 'Dispositivo bloqueado'}</b>
                <small>
                  {fx.device.lost
                    ? `Ligue para ${device.contact}`
                    : `Bloqueio remoto aplicado ao ${device.model}`}
                </small>
              </div>
            )}
          </>
        )}
      </div>

      <button
        className="p-homebar"
        onClick={() => !showLockScreen && store.openApp('home')}
        aria-label="Tela inicial"
      />
    </div>
  )
}
