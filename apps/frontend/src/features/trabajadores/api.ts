import type { Area, Cargo, CondicionLaboral, Trabajador } from './types'

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

export async function fetchTrabajadoresCatalogos() {
  const [areas, cargos, condicionesLaborales, trabajadores] = await Promise.all([
    requestJson<Area[]>('/areas'),
    requestJson<Cargo[]>('/cargos'),
    requestJson<CondicionLaboral[]>('/condiciones-laborales'),
    requestJson<Trabajador[]>('/trabajadores'),
  ])

  return {
    areas,
    cargos,
    condicionesLaborales,
    trabajadores,
  }
}
