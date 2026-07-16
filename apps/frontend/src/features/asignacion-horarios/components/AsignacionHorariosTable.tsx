import type { AsignacionHorario } from '../types'

type AsignacionHorariosTableProps = {
  asignaciones: AsignacionHorario[]
  onEditar: (asignacion: AsignacionHorario) => void
}

export function AsignacionHorariosTable({
  asignaciones,
  onEditar,
}: AsignacionHorariosTableProps) {
  return (
    <>
      <div className="workers-table-card workers-table-card--desktop">
        <div className="workers-table-wrap">
          <table className="workers-table asignaciones-table">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>DNI</th>
                <th>Area / Cargo</th>
                <th>Horario</th>
                <th>Periodo</th>
                <th>Estado</th>
                <th>Observacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion.id}>
                  <td>
                    <div className="workers-name-cell">
                      <strong>{asignacion.trabajadorNombre}</strong>
                      <span>{asignacion.cargoNombre}</span>
                    </div>
                  </td>
                  <td>{asignacion.dni}</td>
                  <td>
                    <div className="workers-name-cell">
                      <strong>{asignacion.areaNombre}</strong>
                      <span>{asignacion.cargoNombre}</span>
                    </div>
                  </td>
                  <td>
                    <div className="workers-name-cell">
                      <strong>{asignacion.horarioNombre}</strong>
                      <span>{asignacion.horarioCodigo}</span>
                    </div>
                  </td>
                  <td>
                    <div className="workers-name-cell">
                      <strong>{formatearFecha(asignacion.fechaInicio)}</strong>
                      <span>
                        {asignacion.fechaFin
                          ? `Hasta ${formatearFecha(asignacion.fechaFin)}`
                          : 'Sin fecha fin'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <ChipEstadoAsignacion estado={asignacion.estado} />
                  </td>
                  <td className="asignaciones-table__observation">
                    {asignacion.observacion ?? 'Sin observacion'}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="workers-row-button"
                      onClick={() => onEditar(asignacion)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="workers-mobile-list">
        {asignaciones.map((asignacion) => (
          <article key={asignacion.id} className="worker-card asignacion-card">
            <div className="worker-card__top">
              <div>
                <p className="worker-card__eyebrow">{asignacion.dni}</p>
                <h2 className="worker-card__title">{asignacion.trabajadorNombre}</h2>
              </div>
              <ChipEstadoAsignacion estado={asignacion.estado} />
            </div>

            <dl className="worker-card__grid asignacion-card__grid">
              <div>
                <dt>Area</dt>
                <dd>{asignacion.areaNombre}</dd>
              </div>
              <div>
                <dt>Cargo</dt>
                <dd>{asignacion.cargoNombre}</dd>
              </div>
              <div>
                <dt>Horario</dt>
                <dd>{asignacion.horarioCodigo}</dd>
              </div>
              <div>
                <dt>Periodo</dt>
                <dd>{formatearPeriodo(asignacion.fechaInicio, asignacion.fechaFin)}</dd>
              </div>
            </dl>

            <p className="horario-card__description">
              {asignacion.observacion ?? 'Sin observacion registrada.'}
            </p>

            <div className="worker-card__footer">
              <button
                type="button"
                className="workers-row-button"
                onClick={() => onEditar(asignacion)}
              >
                Editar asignacion
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function ChipEstadoAsignacion({ estado }: { estado: AsignacionHorario['estado'] }) {
  const label = estado === 'activo' ? 'Vigente' : 'Inactiva'
  const className = estado === 'activo' ? 'chip chip--success-soft' : 'chip chip--neutral'

  return <span className={className}>{label}</span>
}

function formatearFecha(value: string) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function formatearPeriodo(fechaInicio: string, fechaFin?: string | null) {
  const inicio = formatearFecha(fechaInicio)
  if (!fechaFin) return `${inicio} - Abierto`
  return `${inicio} - ${formatearFecha(fechaFin)}`
}
