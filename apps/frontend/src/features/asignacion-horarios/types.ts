export type EstadoAsignacionHorario = 'activo' | 'inactivo'
export type ModoHorario = 'FIJO' | 'VARIABLE'

export type AsignacionHorario = {
  id: number
  trabajadorId: number
  trabajadorNombre: string
  dni: string
  areaId: number
  areaNombre: string
  cargoNombre: string
  modoHorario: ModoHorario
  horarioId: number
  horarioCodigo: string
  horarioNombre: string
  fechaInicio: string
  fechaFin?: string | null
  estado: EstadoAsignacionHorario
  observacion?: string | null
}

export type FiltrosAsignacionHorarios = {
  busqueda: string
  areaId: number | 'todos'
  horarioId: number | 'todos'
  estado: EstadoAsignacionHorario | 'todos'
}

export type AsignacionHorarioFormData = {
  trabajadorId?: number
  modoHorario: ModoHorario
  horarioId?: number
  fechaInicio: string
  fechaFin?: string
  estado: EstadoAsignacionHorario
  observacion?: string
}

export type AsignacionHorarioDia = {
  id: number
  diaSemana: number
  horarioId: number
  horarioCodigo: string
  horarioNombre: string
  activo: boolean
  observacion?: string | null
}
