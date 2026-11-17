/**
 * As seis proteções do Guardian e os passos de cada uma.
 * Tudo aqui é SIMULADO: cada passo só muda o estado da demonstração.
 */
import { scenario, type BankId } from '../data/scenario'
import { store } from '../state/store'
import type { BankFx, DeviceFx, MailFx, ModuleId } from '../state/types'
import { registerModule, type ProtocolStep } from './protocol'

const { device, line, banks, consents, police } = scenario

// ---- Efeitos reutilizáveis: cada um devolve uma função que altera uma parte do estado ----
const setDevice = (key: keyof DeviceFx) => () =>
  store.updateFx((fx) => ({ ...fx, device: { ...fx.device, [key]: true } }))

const setMail = (key: keyof MailFx) => () =>
  store.updateFx((fx) => ({ ...fx, mail: { ...fx.mail, [key]: true } }))

const setBank = (id: BankId, key: keyof BankFx) => () =>
  store.updateFx((fx) => ({ ...fx, banks: { ...fx.banks, [id]: { ...fx.banks[id], [key]: true } } }))

const setLine = (msgs: number, suspended?: boolean) => () =>
  store.updateFx((fx) => ({ ...fx, line: { msgs, suspended: suspended ?? fx.line.suspended } }))

const setConsents = (patch: Partial<{ reviewed: number; revoked: number }>) => () =>
  store.updateFx((fx) => ({ ...fx, consents: { ...fx.consents, ...patch } }))

const inApp = (app: ProtocolStep['app'], extra: Partial<ProtocolStep> = {}) =>
  (step: ProtocolStep): ProtocolStep => ({ ...step, app, ...extra })

// ---- Registro ----
export function registerProtocols(): void {
  const define = (id: ModuleId, doneNotice: string, steps: ProtocolStep[]) =>
    registerModule(id, { doneNotice, steps })

  define(
    'dispositivo',
    `${device.model} bloqueado e em Modo Perdido.`,
    [
      {
        label: 'Consultar localização',
        result: 'Última localização: São Paulo, SP (simulada)',
        effect: setDevice('located'),
      },
      { label: 'Tocar alarme', result: 'Alarme sonoro acionado por 2 min', effect: setDevice('alarm') },
      {
        label: 'Ativar Modo Perdido',
        result: `Mensagem exibida: contato ${device.contact}`,
        effect: setDevice('lost'),
      },
      {
        label: 'Aplicar bloqueio remoto',
        result: `Bloqueio enviado ao ${device.model}`,
        effect: setDevice('locked'),
      },
      {
        label: 'Remover conta do aparelho',
        result: 'Conta do fabricante desconectada',
        effect: setDevice('signedOut'),
      },
    ].map(inApp('encontrar', { busy: 'all' })),
  )

  define(
    'linha',
    `Linha ${line.number} suspensa na ${line.carrier}.`,
    [
      {
        label: `Solicitar bloqueio à ${line.carrier}`,
        result: 'Protocolo 000123 gerado',
        effect: setLine(1),
      },
      { label: 'Suspender a linha', result: `Linha ${line.number} suspensa`, effect: setLine(2, true) },
      { label: 'Desativar chip/eSIM', result: 'Chip desativado', effect: setLine(3) },
    ].map(inApp('sms', { busy: 'all' })),
  )

  define(
    'financeiro',
    'Sessões encerradas, cartões bloqueados e Pix zerado nos bancos.',
    banks.flatMap((bank) =>
      [
        {
          label: `${bank.name}: encerrar sessões`,
          result: 'Sessões encerradas em todos os aparelhos',
          effect: setBank(bank.id, 'session'),
        },
        {
          label: `${bank.name}: bloquear cartões`,
          result: `Cartão físico e virtual ${bank.card} bloqueados`,
          effect: setBank(bank.id, 'card'),
        },
        {
          label: `${bank.name}: zerar limite do Pix`,
          result: 'Limite do Pix: R$ 0,00',
          effect: setBank(bank.id, 'pix'),
        },
        {
          label: `${bank.name}: remover aparelho confiável`,
          result: `${device.model} removido`,
          effect: setBank(bank.id, 'trusted'),
        },
      ].map(inApp('banco', { view: bank.id })),
    ),
  )

  define(
    'openfinance',
    `${consents.length} consentimentos verificados e revogados.`,
    [
      {
        label: 'Abrir aba Consentimentos',
        result: `${consents.length} consentimentos ativos encontrados`,
        app: 'banco',
        view: 'consents',
      },
      ...consents.flatMap((consent, index): ProtocolStep[] => [
        {
          label: `Verificar: ${consent.name}`,
          result: `Compartilha ${consent.data}, ${consent.validity}`,
          app: 'banco',
          view: `consents:${index}`,
          effect: setConsents({ reviewed: index + 1 }),
        },
        {
          label: `Revogar: ${consent.name}`,
          result: 'Consentimento revogado',
          app: 'banco',
          view: `consents:${index}`,
          effect: setConsents({ revoked: index + 1 }),
        },
      ]),
    ],
  )

  define(
    'email',
    'Conta de e-mail protegida.',
    [
      {
        label: 'Encerrar sessões e dispositivos',
        result: '3 sessões encerradas',
        effect: setMail('sessions'),
      },
      { label: 'Redefinir senha', result: 'Senha redefinida (simulada)', effect: setMail('password') },
      {
        label: 'Ativar verificação em duas etapas',
        result: 'Verificação em duas etapas ativada',
        effect: setMail('twofa'),
      },
      {
        label: 'Remover telefone da recuperação',
        result: `${line.number} removido`,
        effect: setMail('recovery'),
      },
      {
        label: 'Revisar regras de encaminhamento',
        result: 'Nenhuma regra suspeita',
        effect: setMail('rules'),
      },
    ].map(inApp('email')),
  )

  define(
    'ocorrencia',
    `Ocorrência encaminhada à ${police} (simulação).`,
    [
      {
        label: 'Organizar dados da ocorrência',
        result: 'Dados do aparelho e do fato reunidos',
        effect: () => store.updateFx((fx) => ({ ...fx, report: { ...fx.report, prepared: true } })),
      },
      {
        label: `Encaminhar à ${police}`,
        result: 'Protocolo BO-SIM-000123 gerado',
        effect: () => store.updateFx((fx) => ({ ...fx, report: { prepared: true, sent: true } })),
      },
    ].map(inApp('guardian', { view: 'ocorrencia' })),
  )
}
