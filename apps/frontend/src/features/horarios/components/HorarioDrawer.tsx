import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Horario, HorarioFormData } from '../types'

type HorarioDrawerProps = {
  abierto: boolean
  horario: Horario | null
  guardando: boolean
  error: string | null
  onGuardar: (data: HorarioFormData) => Promise<void>
  onCerrar: () => void
}

export function HorarioDrawer({
  abierto,
  horario,
  guardando,
  error,
  onGuardar,
  onCerrar,
}: HorarioDrawerProps) {
  const initialData = useMemo(() => crearFormulario(horario), [horario])
  const [formData, setFormData] = useState<HorarioFormData>(initialData)
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null)

  useEffect(() => {
    if (abierto) {
      setFormData(initialData)
      setErrorValidacion(null)
    }
  }, [abierto, initialData])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!formData.codigo.trim()) {
      setErrorValidacion('El codigo es obligatorio.')
      return
    }

    if (!formData.nombre.trim()) {
      setErrorValidacion('El nombre es obligatorio.')
      return
    }

    if (formData.horaEntrada === formData.horaSalida) {
      setErrorValidacion('La hora de entrada y salida no pueden ser iguales.')
      return
    }

    if (formData.toleranciaEntrada < 0 || formData.toleranciaSalida < 0) {
      setErrorValidacion('Las tolerancias deben ser mayores o iguales a 0.')
      return
    }

    setErrorValidacion(null)
    try {
      await onGuardar({
        ...formData,
        codigo: formData.codigo.trim(),
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() ?? '',
      })
    } catch {
      return
    }
  }

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

        <form id="horario-form" className="drawer-shell__body" onSubmit={handleSubmit}>
          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">1</span>
              <div>
                <h3>Datos generales</h3>
                <p>Identifica el horario y describe su uso operativo.</p>
              </div>
            </div>

            <div className="form-grid">
              <CampoInput
                label="Codigo"
                value={formData.codigo}
                onChange={(value) => setFormData((previo) => ({ ...previo, codigo: value }))}
              />
              <CampoInput
                label="Nombre"
                value={formData.nombre}
                onChange={(value) => setFormData((previo) => ({ ...previo, nombre: value }))}
              />
              <CampoSelect
                label="Estado"
                value={formData.estado}
                onChange={(value) =>
                  setFormData((previo) => ({ ...previo, estado: value as HorarioFormData['estado'] }))
                }
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
              <CampoInput
                label="Hora de entrada"
                value={formData.horaEntrada}
                type="time"
                onChange={(value) => setFormData((previo) => ({ ...previo, horaEntrada: value }))}
              />
              <CampoInput
                label="Hora de salida"
                value={formData.horaSalida}
                type="time"
                onChange={(value) => setFormData((previo) => ({ ...previo, horaSalida: value }))}
              />
              <CampoInput
                label="Tolerancia de entrada"
                value={String(formData.toleranciaEntrada)}
                type="number"
                onChange={(value) =>
                  setFormData((previo) => ({
                    ...previo,
                    toleranciaEntrada: Number(value || '0'),
                  }))
                }
              />
              <CampoInput
                label="Tolerancia de salida"
                value={String(formData.toleranciaSalida)}
                type="number"
                onChange={(value) =>
                  setFormData((previo) => ({
                    ...previo,
                    toleranciaSalida: Number(value || '0'),
                  }))
                }
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
              <textarea
                value={formData.descripcion ?? ''}
                rows={5}
                onChange={(event) =>
                  setFormData((previo) => ({ ...previo, descripcion: event.target.value }))
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
          <button type="submit" form="horario-form" className="button button--primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar horario'}
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
  onChange,
}: {
  label: string
  value: string
  type?: 'text' | 'time' | 'number'
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
  opcionesTexto,
  onChange,
}: {
  label: string
  value: string
  opcionesTexto: Array<{ value: string; label: string }>
  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {opcionesTexto.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </label>
  )
}
