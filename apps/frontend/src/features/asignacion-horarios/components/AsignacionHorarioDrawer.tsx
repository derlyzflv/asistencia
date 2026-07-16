import { filtrosAsignacionMock } from '../data/asignacionHorarios.mock'
import type { AsignacionHorario, AsignacionHorarioFormData } from '../types'

type AsignacionHorarioDrawerProps = {
  abierto: boolean
  asignacion: AsignacionHorario | null
  onCerrar: () => void
}

export function AsignacionHorarioDrawer({
  abierto,
  asignacion,
  onCerrar,
}: AsignacionHorarioDrawerProps) {
  const formData = crearFormulario(asignacion)

  return (
    <div className={`drawer-shell${abierto ? ' drawer-shell--open' : ''}`}>
      <button
        type="button"
        className="drawer-shell__backdrop"
        onClick={onCerrar}
        aria-label="Cerrar panel"
      />
      <aside className="drawer-shell__panel" aria-hidden={!abierto}>
        <div className="drawer-shell__header">
          <div>
            <p className="drawer-shell__eyebrow">Asignacion de horarios</p>
            <h2 className="drawer-shell__title">
              {asignacion ? 'Editar asignacion' : 'Nueva asignacion'}
            </h2>
            <p className="drawer-shell__description">Registro de asignacion</p>
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
                <h3>Asignacion individual</h3>
                <p>Selecciona al trabajador y el horario que se aplicara.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoSelect
                label="Trabajador"
                value={String(formData.trabajadorId ?? '')}
                opciones={filtrosAsignacionMock.trabajadores.map((trabajador) => ({
                  value: String(trabajador.id),
                  label: trabajador.nombreCompleto,
                }))}
              />
              <CampoSelect
                label="Horario a asignar"
                value={String(formData.horarioId ?? '')}
                opciones={filtrosAsignacionMock.horarios.map((horario) => ({
                  value: String(horario.id),
                  label: `${horario.codigo} - ${horario.nombre}`,
                }))}
              />
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">2</span>
              <div>
                <h3>Periodo de vigencia</h3>
                <p>Define desde cuando aplica la asignacion y si tiene una fecha de cierre.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoInput label="Fecha de inicio" value={formData.fechaInicio} type="date" />
              <CampoInput label="Fecha de fin" value={formData.fechaFin ?? ''} type="date" />
              <CampoSelect
                label="Estado"
                value={formData.estado}
                opciones={[
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
                <h3>Observacion</h3>
                <p>Agrega una nota breve para contextualizar la asignacion.</p>
              </div>
            </div>

            <label className="field">
              <span>Observacion</span>
              <textarea defaultValue={formData.observacion ?? ''} rows={5} />
            </label>
          </section>
        </div>

        <div className="drawer-shell__footer">
          <button type="button" className="button button--ghost" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="button" className="button button--primary">
            Guardar asignacion
          </button>
        </div>
      </aside>
    </div>
  )
}

function crearFormulario(asignacion: AsignacionHorario | null): AsignacionHorarioFormData {
  return {
    trabajadorId: asignacion?.trabajadorId,
    horarioId: asignacion?.horarioId,
    fechaInicio: asignacion?.fechaInicio ?? '',
    fechaFin: asignacion?.fechaFin ?? '',
    estado: asignacion?.estado ?? 'activo',
    observacion: asignacion?.observacion ?? '',
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
}: {
  label: string
  value: string
  opciones: Array<{ value: string; label: string }>
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select defaultValue={value}>
        <option value="">Selecciona una opcion</option>
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </label>
  )
}
