import { useState } from 'react'
import { scenario } from '../../data/scenario'
import { store, useStore } from '../../state/store'
import { Logo } from '../Logo'

const CODE_LENGTH = 6
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

/** Tela do celular antes do pareamento: login e digitação do código mostrado no computador. */
export function PairScreen() {
  const { pairing } = useStore()
  const [typed, setTyped] = useState('')

  const press = (digit: string) => {
    const next = (typed + digit).slice(0, CODE_LENGTH)
    setTyped(next)
    if (next.length === CODE_LENGTH) {
      store.tryPair(next)
      // Código errado: limpa os campos depois de um instante.
      if (next !== pairing.code) setTimeout(() => setTyped(''), 600)
    }
  }

  return (
    <div className="p-pair">
      <Logo size={40} />
      <b className="p-lead">Guardian</b>

      {!pairing.phoneLogged && (
        <>
          <small>Dispositivo desconectado</small>
          <div className="p-field">{scenario.user.email}</div>
          <div className="p-field">••••••••</div>
          <button className="p-cta" onClick={() => store.loginPhone()}>
            Entrar
          </button>
        </>
      )}

      {pairing.phoneLogged && !pairing.code && (
        <>
          <span className="p-spin dark" />
          <small>
            Login concluído.
            <br />
            Aguardando o computador…
          </small>
        </>
      )}

      {pairing.phoneLogged && pairing.code && (
        <>
          <small>Digite o código exibido no computador</small>
          <div className="p-code">
            {Array.from({ length: CODE_LENGTH }, (_, i) => (
              <span key={i}>{typed[i] ?? ''}</span>
            ))}
          </div>
          {pairing.error && <small className="p-err">{pairing.error}</small>}
          <div className="p-keys">
            {KEYS.map((key, i) =>
              key === '' ? (
                <i key={i} />
              ) : (
                <button key={i} onClick={() => (key === '⌫' ? setTyped(typed.slice(0, -1)) : press(key))}>
                  {key}
                </button>
              ),
            )}
          </div>
          <button
            className="p-link"
            onClick={() => {
              setTyped(pairing.code)
              store.tryPair(pairing.code)
            }}
          >
            Preencher código (demo)
          </button>
        </>
      )}
    </div>
  )
}
