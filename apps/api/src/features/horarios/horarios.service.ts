import { pool } from '../../db/pool.js'
import { queries } from '../../db/queries.js'
import type { HorarioInput } from './horarios.types.js'

function normalizeNullableString(value?: string | null) {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function mapHorarioInput(input: HorarioInput) {
  return [
    input.codigo.trim(),
    input.nombre.trim(),
    input.horaEntrada,
    input.horaSalida,
    input.toleranciaEntrada,
    input.toleranciaSalida,
    normalizeNullableString(input.descripcion),
    input.estado === 'activo',
  ]
}

export async function listHorarios() {
  const { rows } = await pool.query(queries.horarios)
  return rows
}

export async function getHorarioById(id: number) {
  const { rows } = await pool.query(queries.horarioById, [id])
  return rows[0] ?? null
}

export async function createHorario(input: HorarioInput) {
  const values = mapHorarioInput(input)
  const result = await pool.query(queries.insertHorario, values)
  return getHorarioById(result.rows[0].id)
}

export async function updateHorario(id: number, input: HorarioInput) {
  const values = [id, ...mapHorarioInput(input)]
  const result = await pool.query(queries.updateHorario, values)

  if (result.rowCount === 0) {
    return null
  }

  return getHorarioById(id)
}

export async function updateHorarioActivo(id: number, activo: boolean) {
  const result = await pool.query(queries.updateHorarioActivo, [id, activo])

  if (result.rowCount === 0) {
    return null
  }

  return getHorarioById(id)
}
