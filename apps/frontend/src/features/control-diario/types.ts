export type EstadoControlDiario =
  | 'asistio'
  | 'tardanza'
  | 'falta'
  | 'salida-anticipada'
  | 'incompleto'
  | 'justificado'
  | 'sin-horario'
  | 'observado'

export type RegistroControlDiario = {
  id: number
  trabajadorId: number
  trabajadorNombre: string
  dni: string
  areaId: number
  areaNombre: string
  cargoNombre: string
  horarioNombre: string
  fecha: string
  horaProgramadaEntrada?: string | null
  primeraMarcacion?: string | null
  horaProgramadaSalida?: string | null
  ultimaMarcacion?: string | null
  minutosTardanza: number
  minutosSalidaTemprano: number
  cantidadMarcaciones: number
  estado: EstadoControlDiario
  observacion?: string | null
}

export type FiltrosControlDiario = {
  fecha: string
  busqueda: string
  areaId: number | 'todos'
  estado: EstadoControlDiario | 'todos'
}

export type ControlDiarioResumen = {
  programados: number
  asistencias: number
  tardanzas: number
  faltas: number
  salidasAnticipadas: number
  incompletas: number
  justificados: number
  sinHorario: number
}

export type ControlDiarioDetalle = {
  trabajadorId: number
  trabajadorNombre: string
  dni: string
  areaNombre: string
  cargoNombre: string
  fecha: string
  horarioNombre: string
  horaProgramadaEntrada?: string | null
  horaProgramadaSalida?: string | null
  primeraMarcacion?: string | null
  ultimaMarcacion?: string | null
  minutosTardanza: number
  minutosSalidaTemprano: number
  cantidadMarcaciones: number
  estado: EstadoControlDiario
  observacion?: string | null
  marcaciones: ControlDiarioMarcacion[]
}

export type ControlDiarioMarcacion = {
  id: number
  fechaHora: string
  hora: string
}
