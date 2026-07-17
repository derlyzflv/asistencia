export type HorarioInput = {
  codigo: string
  nombre: string
  horaEntrada: string
  horaSalida: string
  toleranciaEntrada: number
  toleranciaSalida: number
  descripcion?: string | null
  estado: 'activo' | 'inactivo'
}
