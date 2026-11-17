/**
 * Motor de protocolos: executa, passo a passo, cada proteção do Guardian.
 *
 * Cada proteção é um "módulo" com uma lista de passos. Para cada passo o motor:
 *  1. abre o aplicativo certo no celular simulado e trava a tela (efeito de "trabalhando");
 *  2. espera um tempo (simula a chamada real a banco, operadora ou fabricante);
 *  3. aplica o efeito no estado (por exemplo, "cartão bloqueado");
 *  4. registra o passo no histórico.
 *
 * Em um produto real, o passo 2 seria uma chamada de API a cada instituição.
 */
import { store } from '../state/store'
import type { AppId, BusyScope, ModuleId } from '../state/types'

export interface ProtocolStep {
  label: string
  result: string
  /** App que aparece no celular durante o passo (padrão: o próprio Guardian). */
  app?: AppId
  /** Subtela dentro do app. */
  view?: string
  /** Quem fica bloqueado durante o passo (padrão: o app do passo). */
  busy?: BusyScope
  /** Duração simulada do passo, em milissegundos (padrão: 1300). */
  ms?: number
  /** Mudança aplicada ao estado quando o passo termina. */
  effect?: () => void
}

export interface ProtocolModule {
  /** Mensagem mostrada no celular quando o módulo inteiro termina. */
  doneNotice: string
  steps: ProtocolStep[]
}

const registry = new Map<ModuleId, ProtocolModule>()

export const registerModule = (id: ModuleId, module: ProtocolModule) => {
  registry.set(id, module)
}

export const isRegistered = (id: ModuleId) => registry.has(id)

/** Multiplicador de tempo (1 = normal). Útil para acelerar a demo ou os testes. */
export const timing = { speed: 1 }

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms * timing.speed))

export async function runModule(id: ModuleId): Promise<void> {
  const module = registry.get(id)
  // Só um módulo roda por vez: se o celular está ocupado, ignora.
  if (!module || store.getState().phone.busy) return

  store.setModule(id, { status: 'andamento', progress: 0 })

  for (let i = 0; i < module.steps.length; i++) {
    const step = module.steps[i]
    const app = step.app ?? 'guardian'

    store.openApp(app)
    if (step.view !== undefined) store.setView(step.view)
    store.setBusy({ app: step.busy ?? app, label: step.label })
    store.setModule(id, {
      status: 'processando',
      progress: Math.round((i / module.steps.length) * 100),
    })

    await sleep(step.ms ?? 1300)

    step.effect?.()
    store.log(id, step.label, step.result, 'concluido')
  }

  store.setBusy(null)
  store.setView('')
  store.setModule(id, { status: 'concluido', progress: 100 })
  store.notify('Operação concluída (simulação)', module.doneNotice)
  store.openApp('guardian')
}
