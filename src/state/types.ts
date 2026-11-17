import type { BankId } from '../data/scenario'

export type ModuleId =
  | 'dispositivo'
  | 'linha'
  | 'financeiro'
  | 'openfinance'
  | 'email'
  | 'ocorrencia'

export type ModuleStatus =
  | 'pendente'
  | 'andamento'
  | 'processando'
  | 'concluido'
  | 'naoConcluido'
  | 'indisponivel'

/** Aplicativos do celular simulado. */
export type AppId = 'home' | 'guardian' | 'email' | 'banco' | 'encontrar' | 'sms'

/** Qual app fica "bloqueado" enquanto o Guardian trabalha; 'all' bloqueia o celular todo. */
export type BusyScope = AppId | 'all'

export interface Busy {
  app: BusyScope
  label: string
}

export interface Notification {
  id: number
  title: string
  body: string
  at: string
}

export interface HistoryEntry {
  id: number
  moduleId: ModuleId
  step: string
  result: string
  status: ModuleStatus
  at: string
}

export interface Pairing {
  pcLogged: boolean
  phoneLogged: boolean
  code: string
  paired: boolean
  error: string
}

/** O que cada proteção já fez no celular simulado (mostrado nas telas do celular). */
export interface DeviceFx {
  located: boolean
  alarm: boolean
  lost: boolean
  locked: boolean
  signedOut: boolean
}

export interface BankFx {
  session: boolean
  card: boolean
  pix: boolean
  trusted: boolean
}

export interface MailFx {
  sessions: boolean
  password: boolean
  twofa: boolean
  recovery: boolean
  rules: boolean
}

export interface Effects {
  device: DeviceFx
  line: { msgs: number; suspended: boolean }
  banks: Record<BankId, BankFx>
  consents: { reviewed: number; revoked: number }
  mail: MailFx
  report: { prepared: boolean; sent: boolean }
}

export interface PhoneState {
  app: AppId
  notifications: Notification[]
  busy: Busy | null
  fx: Effects
  /** Subtela aberta dentro do app (ex.: 'meridiano', 'consents:1', 'ocorrencia'). */
  view: string
}

export interface ModuleProgress {
  status: ModuleStatus
  progress: number
}

export interface AppState {
  pairing: Pairing
  emergency: boolean
  modules: Record<ModuleId, ModuleProgress>
  phone: PhoneState
  history: HistoryEntry[]
}
