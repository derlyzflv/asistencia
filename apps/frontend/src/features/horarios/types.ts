export type EstadoHorario = 'activo' | 'inactivo'

export type Horario = {
  id: number
  codigo: string
  nombre: string
  horaEntrada: string
  horaSalida: string
  toleranciaEntrada: number
  toleranciaSalida: number
  descripcion?: string | null
  estado: EstadoHorario
}

export type FiltrosHorarios = {
  busqueda: string
  estado: EstadoHorario | 'todos'
}

export type HorarioFormData = {
  codigo: string
  nombre: string
  horaEntrada: string
  horaSalida: string
  toleranciaEntrada: number
  toleranciaSalida: number
  descripcion?: string
  estado: EstadoHorario
}

export type HorarioInput = HorarioFormData
