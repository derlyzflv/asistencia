export type TrabajadorInput = {
  dni?: string | null
  codigoInterno?: string | null
  apellidos: string
  nombres: string
  cargoId?: number | null
  areaId?: number | null
  condicionLaboralId?: number | null
  fechaIngreso?: string | null
  correo?: string | null
  telefono?: string | null
  observacion?: string | null
  estado: 'activo' | 'inactivo'
}
