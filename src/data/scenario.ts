/**
 * Cenário FICTÍCIO usado em toda a demonstração.
 * Nenhum dado aqui é real: nomes, telefones, IMEI e bancos são inventados.
 */

export type BankId = 'aurora' | 'meridiano'

export interface Bank {
  id: BankId
  name: string
  card: string
  color: string
}

export interface Consent {
  name: string
  data: string
  validity: string
}

export interface Scenario {
  user: { name: string; email: string }
  device: { maker: string; model: string; imei: string; contact: string }
  line: { carrier: string; number: string }
  banks: Bank[]
  consents: Consent[]
  police: string
}

export const scenario: Scenario = {
  user: { name: 'Marina Alves', email: 'marina.alves@exemplo.com' },
  device: {
    maker: 'Nova',
    model: 'Phone X Pro',
    imei: '00 000000 000000 0',
    contact: '(11) 90000-0001',
  },
  line: { carrier: 'Via Telecom', number: '(11) 90000-0000' },
  banks: [
    { id: 'aurora', name: 'Banco Aurora', card: '•••• 0000', color: '#0F766E' },
    { id: 'meridiano', name: 'Banco Meridiano', card: '•••• 0000', color: '#B45309' },
  ],
  consents: [
    { name: 'App de investimentos', data: 'Saldos e extrato', validity: 'até 12/2027' },
    { name: 'App de crédito', data: 'Dados cadastrais e histórico', validity: 'até 03/2027' },
    { name: 'App de gestão financeira', data: 'Saldos, extrato e cartões', validity: 'até 09/2027' },
  ],
  police: 'Delegacia Online',
}
