import { pool } from '../../db/pool.js'
import { queries } from '../../db/queries.js'
import type {
  AsignacionHorarioDiaInput,
  AsignacionHorarioInput,
} from './asignaciones-horario.types.js'

function normalizeNullableString(value?: string | null) {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function mapAsignacionInput(input: AsignacionHorarioInput) {
  return [
    input.trabajadorId,
    input.modoHorario,
    input.horarioBaseId ?? null,
    input.fechaInicio,
    normalizeNullableString(input.fechaFin),
    input.estado === 'activo',
    normalizeNullableString(input.observacion),
  ]
}

export async function listAsignacionesHorario() {
  const { rows } = await pool.query(queries.asignacionesHorario)
  return rows
}

export async function getAsignacionHorarioById(id: number) {
  const { rows } = await pool.query(queries.asignacionHorarioById, [id])
  return rows[0] ?? null
}

export async function getAsignacionHorarioDias(id: number) {
  const { rows } = await pool.query(queries.asignacionHorarioDias, [id])
  return rows
}

export async function createAsignacionHorario(input: AsignacionHorarioInput) {
  const values = mapAsignacionInput(input)
  const result = await pool.query(queries.insertAsignacionHorario, values)
  return getAsignacionHorarioById(result.rows[0].id)
}

export async function updateAsignacionHorario(id: number, input: AsignacionHorarioInput) {
  const values = [id, ...mapAsignacionInput(input)]
  const result = await pool.query(queries.updateAsignacionHorario, values)

  if (result.rowCount === 0) {
    return null
  }

  return getAsignacionHorarioById(id)
}

export async function updateAsignacionHorarioActivo(id: number, activo: boolean) {
  const result = await pool.query(queries.updateAsignacionHorarioActivo, [id, activo])

  if (result.rowCount === 0) {
    return null
  }

  return getAsignacionHorarioById(id)
}

export async function replaceAsignacionHorarioDias(
  id: number,
  dias: AsignacionHorarioDiaInput[],
) {
  const client = await pool.connect()

  try {
    await client.query('begin')
    await client.query(queries.deleteAsignacionHorarioDias, [id])

    for (const dia of dias) {
      await client.query(queries.insertAsignacionHorarioDia, [
        id,
        dia.diaSemana,
        dia.horarioId,
        dia.activo,
        normalizeNullableString(dia.observacion),
      ])
    }

    await client.query('commit')
  } catch (error) {
    await client.query('rollback')
    throw error
  } finally {
    client.release()
  }

  return getAsignacionHorarioDias(id)
}
