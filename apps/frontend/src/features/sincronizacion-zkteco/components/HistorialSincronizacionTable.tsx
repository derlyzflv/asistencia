import type { RegistroSincronizacion } from '../types'

type HistorialSincronizacionTableProps = {
  registros: RegistroSincronizacion[]
  onVerDetalle: (registro: RegistroSincronizacion) => void
}

export function HistorialSincronizacionTable({
  registros,
  onVerDetalle,
}: HistorialSincronizacionTableProps) {
  return (
    <>
      <div className="workers-table-card workers-table-card--desktop">
        <div className="workers-table-wrap">
          <table className="workers-table sync-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Fecha y hora</th>
                <th>Tipo</th>
                <th>Usuarios</th>
                <th>Marcaciones</th>
                <th>Importados</th>
                <th>Estado</th>
                <th>Observacion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.equipoNombre}</td>
                  <td>{registro.fechaHora}</td>
                  <td>{formatearTipo(registro.tipo)}</td>
                  <td>{registro.usuariosDetectados}</td>
                  <td>{registro.marcacionesDetectadas}</td>
                  <td>{registro.importados}</td>
                  <td>
                    <ChipEstadoSync estado={registro.estado} />
                  </td>
                  <td className="sync-table__observation">{registro.observacion ?? 'Sin observacion'}</td>
                  <td>
                    <button type="button" className="workers-row-button" onClick={() => onVerDetalle(registro)}>
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="workers-mobile-list">
        {registros.map((registro) => (
          <article key={registro.id} className="worker-card sync-card">
            <div className="worker-card__top">
              <div>
                <p className="worker-card__eyebrow">{registro.fechaHora}</p>
                <h2 className="worker-card__title">{registro.equipoNombre}</h2>
              </div>
              <ChipEstadoSync estado={registro.estado} />
            </div>

            <dl className="worker-card__grid sync-card__grid">
              <div>
                <dt>Tipo</dt>
                <dd>{formatearTipo(registro.tipo)}</dd>
              </div>
              <div>
                <dt>Usuarios</dt>
                <dd>{registro.usuariosDetectados}</dd>
              </div>
              <div>
                <dt>Marcaciones</dt>
                <dd>{registro.marcacionesDetectadas}</dd>
              </div>
              <div>
                <dt>Importados</dt>
                <dd>{registro.importados}</dd>
              </div>
            </dl>

            <p className="horario-card__description">{registro.observacion ?? 'Sin observacion registrada.'}</p>

            <div className="worker-card__footer">
              <button type="button" className="workers-row-button" onClick={() => onVerDetalle(registro)}>
                Ver detalle
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function ChipEstadoSync({ estado }: { estado: RegistroSincronizacion['estado'] }) {
  const config = {
    completado: { label: 'Completado', className: 'chip chip--success-soft' },
    'en-proceso': { label: 'En proceso', className: 'chip chip--slate' },
    advertencia: { label: 'Advertencia', className: 'chip chip--warning' },
    error: { label: 'Error', className: 'chip chip--danger' },
  }[estado]

  return <span className={config.className}>{config.label}</span>
}

function formatearTipo(tipo: RegistroSincronizacion['tipo']) {
  const labels = {
    usuarios: 'Usuarios',
    marcaciones: 'Marcaciones',
    mixta: 'Mixta',
  }

  return labels[tipo]
}
