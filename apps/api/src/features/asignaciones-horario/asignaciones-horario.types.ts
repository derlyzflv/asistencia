export type EstadoAsignacionHorario = 'activo' | 'inactivo'

export type ModoHorario = 'FIJO' | 'VARIABLE'

export type AsignacionHorarioInput = {
  trabajadorId: number
  modoHorario: ModoHorario
  horarioBaseId?: number | null
  fechaInicio: string
  fechaFin?: string | null
  estado: EstadoAsignacionHorario
  observacion?: string | null
}

export type AsignacionHorarioDiaInput = {
  diaSemana: number
  horarioId: number
  activo: boolean
  observacion?: string | null
}
