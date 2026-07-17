import type { Horario, HorarioInput } from './types'

const defaultApiUrl = 'http://localhost:3001/api'

function getApiUrl() {
  return (import.meta.env.VITE_API_URL ?? defaultApiUrl).replace(/\/$/, '')
}

async function requestJson<T>(path: string, init?: RequestInit) {
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

export async function fetchHorarios() {
  return requestJson<Horario[]>('/horarios', { method: 'GET' })
}

export async function createHorario(input: HorarioInput) {
  return requestJson<Horario>('/horarios', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateHorario(id: number, input: HorarioInput) {
  return requestJson<Horario>(`/horarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}
