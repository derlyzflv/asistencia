export type EstadoEquipoBiometrico =
  | 'en-linea'
  | 'sin-conexion'
  | 'advertencia'
  | 'mantenimiento'

export type EquipoBiometrico = {
  id: number
  nombre: string
  ip: string
  puerto: number
  ubicacion: string
  estado: EstadoEquipoBiometrico
  ultimaConexion?: string | null
  activo: boolean
}

export type EstadoSincronizacion = 'completado' | 'en-proceso' | 'advertencia' | 'error'

export type TipoSincronizacion = 'usuarios' | 'marcaciones' | 'mixta'

export type RegistroSincronizacion = {
  id: number
  equipoId: number
  equipoNombre: string
  fechaHora: string
  tipo: TipoSincronizacion
  usuariosDetectados: number
  marcacionesDetectadas: number
  importados: number
  observacion?: string | null
  estado: EstadoSincronizacion
}

export type FiltrosSincronizacion = {
  busqueda: string
  equipoId: number | 'todos'
  estado: EstadoSincronizacion | 'todos'
  tipo: TipoSincronizacion | 'todos'
}

export type ResumenSincronizacion = {
  equiposActivos: number
  equiposConAlerta: number
  usuariosDetectados: number
  marcacionesDetectadas: number
  importados: number
  errores: number
}

export type DetalleSincronizacion = {
  equipoNombre: string
  fechaHora?: string
  tipo?: TipoSincronizacion
  estado: EstadoEquipoBiometrico | EstadoSincronizacion
  usuariosDetectados?: number
  marcacionesDetectadas?: number
  importados?: number
  observacion?: string | null
  ip?: string
  puerto?: number
  ubicacion?: string
  ultimaConexion?: string | null
  origen: 'equipo' | 'registro'
}
