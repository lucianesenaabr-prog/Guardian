/**
 * Estado central da demonstração.
 *
 * Um único objeto de estado, atualizado por ações puras e lido pelos componentes
 * com `useStore()`. O computador e o celular simulados leem o MESMO estado, e é
 * por isso que uma ação em um aparece no outro.
 */
import { useSyncExternalStore } from 'react'
import { MODULE_IDS } from '../data/modules'
import { scenario } from '../data/scenario'
import type {
  AppId,
  AppState,
  Busy,
  Effects,
  ModuleId,
  ModuleProgress,
  ModuleStatus,
} from './types'

const createEffects = (): Effects => ({
  device: { located: false, alarm: false, lost: false, locked: false, signedOut: false },
  line: { msgs: 0, suspended: false },
  banks: Object.fromEntries(
    scenario.banks.map((b) => [b.id, { session: false, card: false, pix: false, trusted: false }]),
  ) as Effects['banks'],
  consents: { reviewed: 0, revoked: 0 },
  mail: { sessions: false, password: false, twofa: false, recovery: false, rules: false },
  report: { prepared: false, sent: false },
})

export const createInitialState = (): AppState => ({
  pairing: { pcLogged: false, phoneLogged: false, code: '', paired: false, error: '' },
  emergency: false,
  modules: Object.fromEntries(
    MODULE_IDS.map((id) => [id, { status: 'pendente', progress: 0 }]),
  ) as Record<ModuleId, ModuleProgress>,
  phone: { app: 'home', notifications: [], busy: null, fx: createEffects(), view: '' },
  history: [],
})

let state: AppState = createInitialState()
const listeners = new Set<() => void>()
let lastId = 0

const timestamp = () =>
  new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

/** Código de pareamento de 6 dígitos (demonstração: não é criptograficamente seguro). */
const generateCode = () => String(Math.floor(1e5 + Math.random() * 9e5))

function setState(update: (current: AppState) => AppState) {
  state = update(state)
  listeners.forEach((notify) => notify())
}

/** Gera o código assim que computador E celular estão autenticados. */
const withPairingCode = (s: AppState): AppState =>
  s.pairing.pcLogged && s.pairing.phoneLogged && !s.pairing.code
    ? { ...s, pairing: { ...s.pairing, code: generateCode() } }
    : s

export const store = {
  getState: (): AppState => state,

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  // ---- Login e pareamento ----
  loginPc: () =>
    setState((s) => withPairingCode({ ...s, pairing: { ...s.pairing, pcLogged: true } })),

  loginPhone: () =>
    setState((s) => withPairingCode({ ...s, pairing: { ...s.pairing, phoneLogged: true } })),

  newCode: () =>
    setState((s) => ({ ...s, pairing: { ...s.pairing, code: generateCode(), error: '' } })),

  tryPair(code: string) {
    setState((s) =>
      code === s.pairing.code
        ? {
            ...s,
            pairing: { ...s.pairing, paired: true, error: '' },
            phone: { ...s.phone, app: 'home' },
          }
        : {
            ...s,
            pairing: {
              ...s.pairing,
              error: 'Código incorreto. Confira o código exibido no computador.',
            },
          },
    )
  },

  // ---- Protocolo de emergência ----
  startEmergency() {
    setState((s) => ({ ...s, emergency: true, phone: { ...s.phone, app: 'guardian' } }))
    store.notify(
      'Protocolo de emergência ativo',
      'Guardian iniciou a proteção da sua identidade digital.',
    )
  },

  setModule(id: ModuleId, patch: Partial<{ status: ModuleStatus; progress: number }>) {
    setState((s) => ({ ...s, modules: { ...s.modules, [id]: { ...s.modules[id], ...patch } } }))
  },

  log(moduleId: ModuleId, step: string, result: string, status: ModuleStatus) {
    setState((s) => ({
      ...s,
      history: [{ id: ++lastId, moduleId, step, result, status, at: timestamp() }, ...s.history],
    }))
  },

  // ---- Celular simulado ----
  openApp: (app: AppId) => setState((s) => ({ ...s, phone: { ...s.phone, app } })),

  setBusy: (busy: Busy | null) => setState((s) => ({ ...s, phone: { ...s.phone, busy } })),

  setView: (view: string) => setState((s) => ({ ...s, phone: { ...s.phone, view } })),

  updateFx: (update: (fx: Effects) => Effects) =>
    setState((s) => ({ ...s, phone: { ...s.phone, fx: update(s.phone.fx) } })),

  notify(title: string, body: string) {
    setState((s) => ({
      ...s,
      phone: {
        ...s.phone,
        // O celular mostra no máximo 3 notificações.
        notifications: [{ id: ++lastId, title, body, at: timestamp() }, ...s.phone.notifications].slice(0, 3),
      },
    }))
  },

  dismiss: (id: number) =>
    setState((s) => ({
      ...s,
      phone: { ...s.phone, notifications: s.phone.notifications.filter((n) => n.id !== id) },
    })),

  reset: () => setState(() => createInitialState()),
}

export const useStore = (): AppState => useSyncExternalStore(store.subscribe, store.getState)
