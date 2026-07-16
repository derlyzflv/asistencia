import { pool } from '../../db/pool.js'
import { queries } from '../../db/queries.js'
import type { TrabajadorInput } from './trabajadores.types.js'

function normalizeNullableString(value?: string | null) {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function mapTrabajadorInput(input: TrabajadorInput) {
  return [
    normalizeNullableString(input.dni),
    normalizeNullableString(input.codigoInterno),
    input.apellidos.trim(),
    input.nombres.trim(),
    input.cargoId ?? null,
    input.areaId ?? null,
    input.condicionLaboralId ?? null,
    normalizeNullableString(input.fechaIngreso),
    input.estado === 'activo',
    normalizeNullableString(input.correo),
    normalizeNullableString(input.telefono),
    normalizeNullableString(input.observacion),
  ]
}

export async function listTrabajadores() {
  const { rows } = await pool.query(queries.trabajadores)
  return rows
}

export async function getTrabajadorById(id: number) {
  const { rows } = await pool.query(queries.trabajadorById, [id])
  return rows[0] ?? null
}

export async function createTrabajador(input: TrabajadorInput) {
  const values = mapTrabajadorInput(input)
  const result = await pool.query(queries.insertTrabajador, values)
  return getTrabajadorById(result.rows[0].id)
}

export async function updateTrabajador(id: number, input: TrabajadorInput) {
  const values = [id, ...mapTrabajadorInput(input)]
  const result = await pool.query(queries.updateTrabajador, values)

  if (result.rowCount === 0) {
    return null
  }

  return getTrabajadorById(id)
}

export async function updateTrabajadorActivo(id: number, activo: boolean) {
  const result = await pool.query(queries.updateTrabajadorActivo, [id, activo])

  if (result.rowCount === 0) {
    return null
  }

  return getTrabajadorById(id)
}
