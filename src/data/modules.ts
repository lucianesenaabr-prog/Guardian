import type { ModuleId, ModuleStatus } from '../state/types'
import { scenario } from './scenario'

export interface ModuleInfo {
  id: ModuleId
  title: string
  category: string
  /** Serviço ou conta afetada, mostrado abaixo do título. */
  service: string
}

const { device, line, banks, consents, user, police } = scenario

/** As seis proteções, na ordem sugerida ao usuário. */
export const MODULES: ModuleInfo[] = [
  {
    id: 'dispositivo',
    title: 'Proteger o dispositivo',
    category: 'Dispositivo',
    service: `${device.maker} · ${device.model}`,
  },
  {
    id: 'linha',
    title: 'Bloquear a linha telefônica',
    category: 'Telefonia',
    service: `${line.carrier} · ${line.number}`,
  },
  {
    id: 'financeiro',
    title: 'Proteger as instituições financeiras',
    category: 'Financeiro',
    service: banks.map((b) => b.name).join(' e '),
  },
  {
    id: 'openfinance',
    title: 'Revogar consentimentos Open Finance',
    category: 'Open Finance',
    service: `${consents.length} consentimentos ativos`,
  },
  {
    id: 'email',
    title: 'Proteger e-mail e contas digitais',
    category: 'Contas digitais',
    service: user.email,
  },
  { id: 'ocorrencia', title: 'Registrar a ocorrência', category: 'Governo', service: police },
]

export const MODULE_IDS: ModuleId[] = MODULES.map((m) => m.id)

export const STATUS_LABEL: Record<ModuleStatus, string> = {
  pendente: 'Pendente',
  andamento: 'Em andamento',
  processando: 'Processando',
  concluido: 'Concluído',
  naoConcluido: 'Não concluído',
  indisponivel: 'Indisponível',
}

export const findModule = (id: ModuleId): ModuleInfo | undefined =>
  MODULES.find((m) => m.id === id)
