import type { ControlDiarioDetalle, ControlDiarioResumen, RegistroControlDiario } from './types'

const defaultApiUrl = 'http://localhost:3001/api'

function getApiUrl() {
  return (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '')
}

export type ControlDiarioResponse = {
  fecha: string
  resumen: ControlDiarioResumen
  registros: RegistroControlDiario[]
}

export async function fetchControlDiario(fecha?: string) {
  const search = fecha ? `?fecha=${encodeURIComponent(fecha)}` : ''
  const response = await fetch(`${getApiUrl()}/control-diario${search}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<ControlDiarioResponse>
}

export async function fetchControlDiarioDetalle(trabajadorId: number, fecha: string) {
  const response = await fetch(
    `${getApiUrl()}/control-diario/${trabajadorId}?fecha=${encodeURIComponent(fecha)}`,
  )

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<ControlDiarioDetalle>
}
