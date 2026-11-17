import { scenario } from '../../data/scenario'
import { store, useStore } from '../../state/store'
import { Logo } from '../Logo'
import { Header } from './Header'

function ConnectionItem({ label, on, text }: { label: string; on: boolean; text: string }) {
  return (
    <li>
      <span>{label}</span>
      <b className={`chip ${on ? 'concluido' : 'pendente'}`}>{text}</b>
    </li>
  )
}

const groupCode = (code: string) => `${code.slice(0, 3)} ${code.slice(3)}`

/**
 * Tela de entrada no computador: login e pareamento com o celular.
 * O pareamento imita o login seguro em dois dispositivos: o computador mostra um
 * código e a pessoa precisa digitá-lo no celular.
 */
export function Gate() {
  const { pairing } = useStore()

  return (
    <main className="desktop">
      <Header />
      <section className="gate">
        <Logo size={44} />

        {!pairing.pcLogged && (
          <>
            <h1>Entrar no Guardian</h1>
            <p>Acesse a central a partir de um computador seguro.</p>
            <div className="field">{scenario.user.email}</div>
            <div className="field">••••••••</div>
            <button className="sos primary" onClick={() => store.loginPc()}>
              Entrar
            </button>
          </>
        )}

        {pairing.pcLogged && !pairing.phoneLogged && (
          <>
            <h1>Login concluído</h1>
            <p>Aguardando o login no celular para continuar.</p>
          </>
        )}

        {pairing.pcLogged && pairing.phoneLogged && (
          <>
            <h1>Emparelhar com o celular</h1>
            <p>Digite este código no celular para conectar os dois ambientes.</p>
            <div className="pair-code">{groupCode(pairing.code)}</div>
            <button className="ghost" onClick={() => store.newCode()}>
              Gerar novo código
            </button>
          </>
        )}

        <ul className="conn">
          <ConnectionItem
            label="Computador"
            on={pairing.pcLogged}
            text={pairing.pcLogged ? 'Autenticado' : 'Desconectado'}
          />
          <ConnectionItem
            label="Celular"
            on={pairing.phoneLogged}
            text={pairing.phoneLogged ? 'Autenticado' : 'Desconectado'}
          />
        </ul>
      </section>
    </main>
  )
}
