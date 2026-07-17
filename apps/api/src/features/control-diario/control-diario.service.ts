import { pool } from '../../db/pool.js'
import { queries } from '../../db/queries.js'

type ControlDiarioRegistro = {
  estado: 'asistio' | 'tardanza' | 'falta' | 'salida-anticipada' | 'incompleto' | 'justificado' | 'sin-horario' | 'observado'
  areaId: number | null
}

type ControlDiarioMarcacion = {
  id: number
  fechaHora: string
  hora: string
}

type ControlDiarioDetalle = Record<string, unknown> & {
  marcaciones: ControlDiarioMarcacion[]
}

export async function getControlDiario(fecha?: string | null) {
  const { rows } = await pool.query<ControlDiarioRegistro & Record<string, unknown>>(queries.controlDiario, [fecha ?? null])

  const fechaResuelta = (rows[0]?.fecha as string | undefined) ?? fecha ?? new Date().toISOString().slice(0, 10)

  const resumen = rows.reduce(
    (acc, row) => {
      acc.programados += 1

      if (row.estado === 'asistio') acc.asistencias += 1
      if (row.estado === 'tardanza') acc.tardanzas += 1
      if (row.estado === 'falta') acc.faltas += 1
      if (row.estado === 'salida-anticipada') acc.salidasAnticipadas += 1
      if (row.estado === 'incompleto') acc.incompletas += 1
      if (row.estado === 'justificado') acc.justificados += 1
      if (row.estado === 'sin-horario') acc.sinHorario += 1

      return acc
    },
    {
      programados: 0,
      asistencias: 0,
      tardanzas: 0,
      faltas: 0,
      salidasAnticipadas: 0,
      incompletas: 0,
      justificados: 0,
      sinHorario: 0,
    },
  )

  return {
    fecha: fechaResuelta,
    resumen,
    registros: rows,
  }
}

export async function getControlDiarioDetalle(trabajadorId: number, fecha?: string | null) {
  const { rows } = await pool.query<ControlDiarioDetalle>(queries.controlDiarioDetalle, [fecha ?? null, trabajadorId])
  return rows[0] ?? null
}
