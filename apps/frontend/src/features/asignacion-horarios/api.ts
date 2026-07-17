import type { Horario } from '../horarios/types'
import type { Trabajador } from '../trabajadores/types'
import type { AsignacionHorario, AsignacionHorarioInput } from './types'

const defaultApiUrl = 'http://localhost:3001/api'

function getApiUrl() {
  return (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '')
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(data?.message ?? `Request failed with status ${response.status}`)
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

export async function createAsignacionHorario(input: AsignacionHorarioInput) {
  return requestJson<AsignacionHorario>('/asignaciones-horario', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateAsignacionHorario(id: number, input: AsignacionHorarioInput) {
  return requestJson<AsignacionHorario>(`/asignaciones-horario/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}
