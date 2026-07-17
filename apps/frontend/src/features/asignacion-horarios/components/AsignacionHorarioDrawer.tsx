import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Horario } from '../../horarios/types'
import type { Trabajador } from '../../trabajadores/types'
import type { AsignacionHorario, AsignacionHorarioFormData } from '../types'

type AsignacionHorarioDrawerProps = {
  abierto: boolean
  asignacion: AsignacionHorario | null
  trabajadores: Trabajador[]
  horarios: Horario[]
  guardando: boolean
  error: string | null
  onGuardar: (data: AsignacionHorarioFormData) => Promise<void>
  onCerrar: () => void
}

export function AsignacionHorarioDrawer({
  abierto,
  asignacion,
  trabajadores,
  horarios,
  guardando,
  error,
  onGuardar,
  onCerrar,
}: AsignacionHorarioDrawerProps) {
  const initialData = useMemo(() => crearFormulario(asignacion), [asignacion])
  const [formData, setFormData] = useState<AsignacionHorarioFormData>(initialData)
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null)

  useEffect(() => {
    if (abierto) {
      setFormData(initialData)
      setErrorValidacion(null)
    }
  }, [abierto, initialData])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.trabajadorId) {
      setErrorValidacion('Debes seleccionar un trabajador.')
      return
    }

    if (!formData.horarioId) {
      setErrorValidacion('Debes seleccionar un horario base.')
      return
    }

    if (!formData.fechaInicio) {
      setErrorValidacion('La fecha de inicio es obligatoria.')
      return
    }

    if (formData.fechaFin && formData.fechaFin < formData.fechaInicio) {
      setErrorValidacion('La fecha de fin no puede ser menor a la fecha de inicio.')
      return
    }

    setErrorValidacion(null)

    try {
      await onGuardar({
        ...formData,
        observacion: formData.observacion?.trim() ?? '',
      })
    } catch {
      return
    }
  }

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

        <form id="asignacion-horario-form" className="drawer-shell__body" onSubmit={handleSubmit}>
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
                onChange={(value) =>
                  setFormData((previo) => ({
                    ...previo,
                    trabajadorId: value ? Number(value) : undefined,
                  }))
                }
                opciones={trabajadores.map((trabajador) => ({
                  value: String(trabajador.id),
                  label: trabajador.nombreCompleto,
                }))}
              />
              <CampoSelect
                label="Modo"
                value={formData.modoHorario}
                onChange={(value) =>
                  setFormData((previo) => ({
                    ...previo,
                    modoHorario: value as AsignacionHorarioFormData['modoHorario'],
                  }))
                }
                opciones={[
                  { value: 'FIJO', label: 'Fijo' },
                  { value: 'VARIABLE', label: 'Variable' },
                ]}
              />
              <CampoSelect
                label="Horario base"
                value={String(formData.horarioId ?? '')}
                onChange={(value) =>
                  setFormData((previo) => ({
                    ...previo,
                    horarioId: value ? Number(value) : undefined,
                  }))
                }
                opciones={horarios.map((horario) => ({
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
              <CampoInput
                label="Fecha de inicio"
                value={formData.fechaInicio}
                type="date"
                onChange={(value) => setFormData((previo) => ({ ...previo, fechaInicio: value }))}
              />
              <CampoInput
                label="Fecha de fin"
                value={formData.fechaFin ?? ''}
                type="date"
                onChange={(value) => setFormData((previo) => ({ ...previo, fechaFin: value }))}
              />
              <CampoSelect
                label="Estado"
                value={formData.estado}
                onChange={(value) =>
                  setFormData((previo) => ({
                    ...previo,
                    estado: value as AsignacionHorarioFormData['estado'],
                  }))
                }
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
              <textarea
                value={formData.observacion ?? ''}
                rows={5}
                onChange={(event) =>
                  setFormData((previo) => ({ ...previo, observacion: event.target.value }))
                }
              />
            </label>
          </section>

          {errorValidacion || error ? (
            <section className="empty-panel">
              <strong>No se pudo guardar</strong>
              <p>{errorValidacion ?? error}</p>
            </section>
          ) : null}
        </form>

        <div className="drawer-shell__footer">
          <button type="button" className="button button--ghost" onClick={onCerrar}>
            Cancelar
          </button>
          <button
            type="submit"
            form="asignacion-horario-form"
            className="button button--primary"
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar asignacion'}
          </button>
        </div>
      </aside>
    </div>
  )
}

function crearFormulario(asignacion: AsignacionHorario | null): AsignacionHorarioFormData {
  return {
    trabajadorId: asignacion?.trabajadorId,
    modoHorario: asignacion?.modoHorario ?? 'FIJO',
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
  onChange,
}: {
  label: string
  value: string
  type?: 'text' | 'date'
  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function CampoSelect({
  label,
  value,
  opciones,
  onChange,
}: {
  label: string
  value: string
  opciones: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
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
