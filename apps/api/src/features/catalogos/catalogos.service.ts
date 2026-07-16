import { pool } from '../../db/pool.js'
import { queries } from '../../db/queries.js'

export async function listAreas() {
  const { rows } = await pool.query(queries.areas)
  return rows
}

export async function listCargos() {
  const { rows } = await pool.query(queries.cargos)
  return rows
}

export async function listCondicionesLaborales() {
  const { rows } = await pool.query(queries.condicionesLaborales)
  return rows
}
