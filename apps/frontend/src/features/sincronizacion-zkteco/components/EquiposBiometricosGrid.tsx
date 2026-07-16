import type { EquipoBiometrico } from '../types'

type EquiposBiometricosGridProps = {
  equipos: EquipoBiometrico[]
  onVerDetalle: (equipo: EquipoBiometrico) => void
}

export function EquiposBiometricosGrid({ equipos, onVerDetalle }: EquiposBiometricosGridProps) {
  return (
    <section className="device-grid">
      {equipos.map((equipo) => (
        <article key={equipo.id} className="device-card">
          <div className="device-card__top">
            <div>
              <p className="worker-card__eyebrow">{equipo.ubicacion}</p>
              <h2 className="worker-card__title">{equipo.nombre}</h2>
            </div>
            <ChipEstadoEquipo estado={equipo.estado} />
          </div>

          <dl className="device-card__grid">
            <div>
              <dt>IP</dt>
              <dd>{equipo.ip}</dd>
            </div>
            <div>
              <dt>Puerto</dt>
              <dd>{equipo.puerto}</dd>
            </div>
            <div>
              <dt>Ultima conexion</dt>
              <dd>{equipo.ultimaConexion ?? 'Sin registro'}</dd>
            </div>
            <div>
              <dt>Estado de alta</dt>
              <dd>{equipo.activo ? 'Activo' : 'Inactivo'}</dd>
            </div>
          </dl>

          <div className="worker-card__footer">
            <button type="button" className="workers-row-button" onClick={() => onVerDetalle(equipo)}>
              Ver detalle
            </button>
          </div>
        </article>
      ))}
    </section>
  )
}

function ChipEstadoEquipo({ estado }: { estado: EquipoBiometrico['estado'] }) {
  const config = {
    'en-linea': { label: 'En linea', className: 'chip chip--success' },
    advertencia: { label: 'Advertencia', className: 'chip chip--warning' },
    'sin-conexion': { label: 'Sin conexion', className: 'chip chip--danger' },
    mantenimiento: { label: 'Mantenimiento', className: 'chip chip--neutral' },
  }[estado]

  return <span className={config.className}>{config.label}</span>
}
