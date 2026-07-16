import type { Horario, HorarioFormData } from '../types'

type HorarioDrawerProps = {
  abierto: boolean
  horario: Horario | null
  onCerrar: () => void
}

export function HorarioDrawer({ abierto, horario, onCerrar }: HorarioDrawerProps) {
  const formData = crearFormulario(horario)

  return (
    <div className={`drawer-shell${abierto ? ' drawer-shell--open' : ''}`}>
      <button type="button" className="drawer-shell__backdrop" onClick={onCerrar} aria-label="Cerrar panel" />
      <aside className="drawer-shell__panel" aria-hidden={!abierto}>
        <div className="drawer-shell__header">
          <div>
            <p className="drawer-shell__eyebrow">Horarios</p>
            <h2 className="drawer-shell__title">{horario ? 'Editar horario' : 'Crear horario'}</h2>
            <p className="drawer-shell__description">Registro de horario</p>
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
                <h3>Datos generales</h3>
                <p>Identifica el horario y describe su uso operativo.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoInput label="Codigo" value={formData.codigo} />
              <CampoInput label="Nombre" value={formData.nombre} />
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

          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">2</span>
              <div>
                <h3>Configuracion de jornada</h3>
                <p>Define las horas y las tolerancias para entrada y salida.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoInput label="Hora de entrada" value={formData.horaEntrada} type="time" />
              <CampoInput label="Hora de salida" value={formData.horaSalida} type="time" />
              <CampoInput
                label="Tolerancia de entrada"
                value={String(formData.toleranciaEntrada)}
                type="number"
              />
              <CampoInput
                label="Tolerancia de salida"
                value={String(formData.toleranciaSalida)}
                type="number"
              />
            </div>
          </section>

          <section className="drawer-section drawer-section--muted">
            <div className="drawer-section__header">
              <span className="drawer-section__step">3</span>
              <div>
                <h3>Descripcion</h3>
                <p>Agrega un contexto breve para facilitar la asignacion posterior.</p>
              </div>
            </div>

            <label className="field">
              <span>Descripcion</span>
              <textarea defaultValue={formData.descripcion ?? ''} rows={5} />
            </label>
          </section>
        </div>

        <div className="drawer-shell__footer">
          <button type="button" className="button button--ghost" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="button" className="button button--primary">
            Guardar horario
          </button>
        </div>
      </aside>
    </div>
  )
}

function crearFormulario(horario: Horario | null): HorarioFormData {
  return {
    codigo: horario?.codigo ?? '',
    nombre: horario?.nombre ?? '',
    horaEntrada: horario?.horaEntrada ?? '08:00',
    horaSalida: horario?.horaSalida ?? '17:00',
    toleranciaEntrada: horario?.toleranciaEntrada ?? 0,
    toleranciaSalida: horario?.toleranciaSalida ?? 0,
    descripcion: horario?.descripcion ?? '',
    estado: horario?.estado ?? 'activo',
  }
}

function CampoInput({
  label,
  value,
  type = 'text',
}: {
  label: string
  value: string
  type?: 'text' | 'time' | 'number'
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
  opcionesTexto,
}: {
  label: string
  value: string
  opcionesTexto: Array<{ value: string; label: string }>
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select defaultValue={value}>
        {opcionesTexto.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </label>
  )
}
