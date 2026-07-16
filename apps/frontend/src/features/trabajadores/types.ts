export type EstadoTrabajador = 'activo' | 'inactivo'

export type EstadoBiometrico = 'vinculado' | 'pendiente' | 'sin-vinculacion'

export type Cargo = {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

export type Area = {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

export type CondicionLaboral = {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

export type Trabajador = {
  id: number
  dni: string
  codigoInterno?: string | null
  apellidos: string
  nombres: string
  nombreCompleto: string
  cargoId: number
  cargoNombre: string
  areaId: number
  areaNombre: string
  condicionLaboralId: number
  condicionLaboralNombre: string
  fechaIngreso?: string | null
  correo?: string | null
  telefono?: string | null
  observacion?: string | null
  estado: EstadoTrabajador
  estadoBiometrico: EstadoBiometrico
}

export type FiltrosTrabajadores = {
  busqueda: string
  areaId: number | 'todos'
  cargoId: number | 'todos'
  condicionLaboralId: number | 'todos'
  estado: EstadoTrabajador | 'todos'
  estadoBiometrico: EstadoBiometrico | 'todos'
}

export type TrabajadorFormData = {
  dni: string
  codigoInterno: string
  apellidos: string
  nombres: string
  cargoId?: number
  areaId?: number
  condicionLaboralId?: number
  fechaIngreso?: string
  correo?: string
  telefono?: string
  observacion?: string
  estado: EstadoTrabajador
}
