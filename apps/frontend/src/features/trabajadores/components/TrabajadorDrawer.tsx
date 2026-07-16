import type {
  Area,
  Cargo,
  CondicionLaboral,
  Trabajador,
  TrabajadorFormData,
} from '../types'

type TrabajadorDrawerProps = {
  abierto: boolean
  trabajador: Trabajador | null
  areas: Area[]
  cargos: Cargo[]
  condicionesLaborales: CondicionLaboral[]
  onCerrar: () => void
}

export function TrabajadorDrawer({
  abierto,
  trabajador,
  areas,
  cargos,
  condicionesLaborales,
  onCerrar,
}: TrabajadorDrawerProps) {
  const formData = crearFormulario(trabajador)

  return (
    <div className={`drawer-shell${abierto ? ' drawer-shell--open' : ''}`}>
      <button type="button" className="drawer-shell__backdrop" onClick={onCerrar} aria-label="Cerrar panel" />
      <aside className="drawer-shell__panel" aria-hidden={!abierto}>
        <div className="drawer-shell__header">
          <div>
            <p className="drawer-shell__eyebrow">Trabajadores</p>
            <h2 className="drawer-shell__title">
              {trabajador ? 'Detalle del trabajador' : 'Registrar trabajador'}
            </h2>
            <p className="drawer-shell__description">Registro de trabajador</p>
          </div>
          <button type="button" className="drawer-shell__close" onClick={onCerrar}>
            Cerrar
          </button>
        </div>

        <div className="drawer-shell__body">
          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">1</span>
              <div>
                <h3>Datos personales</h3>
                <p>Se registra la informacion maestra del trabajador.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoInput label="DNI" value={formData.dni} />
              <CampoInput label="Codigo interno" value={formData.codigoInterno} />
              <CampoInput label="Nombres" value={formData.nombres} />
              <CampoInput label="Apellidos" value={formData.apellidos} />
              <CampoInput label="Correo" value={formData.correo ?? ''} />
              <CampoInput label="Telefono" value={formData.telefono ?? ''} />
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">2</span>
              <div>
                <h3>Datos laborales</h3>
                <p>Jornada laboral se mapea a la tabla de condiciones laborales.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoSelect label="Area" value={trabajador?.areaId ?? ''} opciones={areas} />
              <CampoSelect label="Cargo" value={trabajador?.cargoId ?? ''} opciones={cargos} />
              <CampoSelect
                label="Jornada laboral"
                value={trabajador?.condicionLaboralId ?? ''}
                opciones={condicionesLaborales}
              />
              <CampoInput label="Fecha de ingreso" value={formData.fechaIngreso ?? ''} type="date" />
              <CampoSelect
                label="Estado"
                value={formData.estado}
                opcionesTexto={[
                  { value: 'activo', label: 'Activo' },
                  { value: 'inactivo', label: 'Inactivo' },
                ]}
              />
            </div>
          </section>

          <section className="drawer-section drawer-section--muted">
            <div className="drawer-section__header">
              <span className="drawer-section__step">3</span>
              <div>
                <h3>Estado biometrico</h3>
              </div>
            </div>

            <div className="biometric-status-box">
              <span className="biometric-status-box__label">Estado actual</span>
              <strong>{formatearEstadoBiometrico(trabajador?.estadoBiometrico ?? 'pendiente')}</strong>
              <p>Estado actual de vinculacion biometrica.</p>
            </div>
          </section>
        </div>

        <div className="drawer-shell__footer">
          <button type="button" className="button button--ghost" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="button" className="button button--primary">
            Guardar trabajador
          </button>
        </div>
      </aside>
    </div>
  )
}

function crearFormulario(trabajador: Trabajador | null): TrabajadorFormData {
  return {
    dni: trabajador?.dni ?? '',
    codigoInterno: trabajador?.codigoInterno ?? '',
    apellidos: trabajador?.apellidos ?? '',
    nombres: trabajador?.nombres ?? '',
    cargoId: trabajador?.cargoId,
    areaId: trabajador?.areaId,
    condicionLaboralId: trabajador?.condicionLaboralId,
    fechaIngreso: trabajador?.fechaIngreso ?? '',
    correo: trabajador?.correo ?? '',
    telefono: trabajador?.telefono ?? '',
    observacion: trabajador?.observacion ?? '',
    estado: trabajador?.estado ?? 'activo',
  }
}

function CampoInput({
  label,
  value,
  type = 'text',
}: {
  label: string
  value: string
  type?: 'text' | 'date'
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} defaultValue={value} />
    </label>
  )
}

function CampoSelect({
  label,
  value,
  opciones,
  opcionesTexto,
}: {
  label: string
  value: number | string
  opciones?: Array<{ id: number; nombre: string }>
  opcionesTexto?: Array<{ value: string; label: string }>
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select defaultValue={String(value)}>
        <option value="">Selecciona una opcion</option>
        {opciones?.map((opcion) => (
          <option key={opcion.id} value={String(opcion.id)}>
            {opcion.nombre}
          </option>
        ))}
        {opcionesTexto?.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function formatearEstadoBiometrico(estado: Trabajador['estadoBiometrico']) {
  if (estado === 'vinculado') return 'Vinculado'
  if (estado === 'sin-vinculacion') return 'Sin vinculacion'
  return 'Pendiente'
}
