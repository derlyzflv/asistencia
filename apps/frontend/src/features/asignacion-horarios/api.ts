import type { Horario } from '../horarios/types'
import type { Trabajador } from '../trabajadores/types'
import type { AsignacionHorario } from './types'

const defaultApiUrl = 'http://localhost:3001/api'

function getApiUrl() {
  return (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '')
}

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchAsignacionHorariosData() {
  const [asignaciones, trabajadores, horarios] = await Promise.all([
    requestJson<AsignacionHorario[]>('/asignaciones-horario'),
    requestJson<Trabajador[]>('/trabajadores'),
    requestJson<Horario[]>('/horarios'),
  ])

  return {
    asignaciones,
    trabajadores,
    horarios,
  }
}
