export type EstadoAsignacionHorario = 'activo' | 'inactivo'

export type AsignacionHorario = {
  id: number
  trabajadorId: number
  trabajadorNombre: string
  dni: string
  areaId: number
  areaNombre: string
  cargoNombre: string
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
  horarioId?: number
  fechaInicio: string
  fechaFin?: string
  estado: EstadoAsignacionHorario
  observacion?: string
}
