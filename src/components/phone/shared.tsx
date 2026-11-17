import type { ReactNode } from 'react'

/** Linha "antes → depois": mostra o valor anterior até a proteção ser aplicada. */
export function Row({
  label,
  before,
  after,
  done,
}: {
  label: string
  before: string
  after: string
  done: boolean
}) {
  return (
    <li>
      <span>{label}</span>
      <b className={`dot ${done ? 'concluido' : 'pendente'}`}>{done ? after : before}</b>
    </li>
  )
}

/** Moldura padrão de uma tela de aplicativo do celular simulado. */
export function PhoneScreen({
  title,
  color,
  children,
}: {
  title: ReactNode
  color?: string
  children: ReactNode
}) {
  return (
    <div className="p-screen">
      <div className="p-appbar" style={{ color }}>
        {title}
      </div>
      {children}
    </div>
  )
}
