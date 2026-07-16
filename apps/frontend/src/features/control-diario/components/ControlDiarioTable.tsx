import type { RegistroControlDiario } from '../types'

type ControlDiarioTableProps = {
  registros: RegistroControlDiario[]
  onVerDetalle: (registro: RegistroControlDiario) => void
}

export function ControlDiarioTable({ registros, onVerDetalle }: ControlDiarioTableProps) {
  return (
    <>
      <div className="workers-table-card workers-table-card--desktop">
        <div className="workers-table-wrap">
          <table className="workers-table control-table">
            <thead>
              <tr>
                <th>Trabajador</th>
                <th>DNI</th>
                <th>Area</th>
                <th>Horario</th>
                <th>Ent. prog.</th>
                <th>1ra marc.</th>
                <th>Sal. prog.</th>
                <th>Ult. marc.</th>
                <th>Tard.</th>
                <th>S. ant.</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>
                    <div className="workers-name-cell">
                      <strong>{registro.trabajadorNombre}</strong>
                      <span>{registro.cargoNombre}</span>
                    </div>
                  </td>
                  <td>{registro.dni}</td>
                  <td>{registro.areaNombre}</td>
                  <td>{registro.horarioNombre}</td>
                  <td>{registro.horaProgramadaEntrada ?? '--'}</td>
                  <td>{registro.primeraMarcacion ?? '--'}</td>
                  <td>{registro.horaProgramadaSalida ?? '--'}</td>
                  <td>{registro.ultimaMarcacion ?? '--'}</td>
                  <td>{registro.minutosTardanza > 0 ? `${registro.minutosTardanza} min` : '0'}</td>
                  <td>{registro.minutosSalidaTemprano > 0 ? `${registro.minutosSalidaTemprano} min` : '0'}</td>
                  <td>
                    <ChipEstadoControl estado={registro.estado} />
                  </td>
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
          <article key={registro.id} className="worker-card control-card">
            <div className="worker-card__top">
              <div>
                <p className="worker-card__eyebrow">{registro.dni}</p>
                <h2 className="worker-card__title">{registro.trabajadorNombre}</h2>
              </div>
              <ChipEstadoControl estado={registro.estado} />
            </div>

            <dl className="worker-card__grid control-card__grid">
              <div>
                <dt>Area</dt>
                <dd>{registro.areaNombre}</dd>
              </div>
              <div>
                <dt>Horario</dt>
                <dd>{registro.horarioNombre}</dd>
              </div>
              <div>
                <dt>Entrada</dt>
                <dd>{registro.primeraMarcacion ?? '--'}</dd>
              </div>
              <div>
                <dt>Salida</dt>
                <dd>{registro.ultimaMarcacion ?? '--'}</dd>
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

function ChipEstadoControl({ estado }: { estado: RegistroControlDiario['estado'] }) {
  const config = {
    asistio: { label: 'Asistio', className: 'chip chip--success' },
    tardanza: { label: 'Tardanza', className: 'chip chip--warning' },
    falta: { label: 'Falta', className: 'chip chip--danger' },
    'salida-anticipada': { label: 'Salida anticipada', className: 'chip chip--amber' },
    incompleto: { label: 'Incompleto', className: 'chip chip--violet' },
    justificado: { label: 'Justificado', className: 'chip chip--success-soft' },
    'sin-horario': { label: 'Sin horario', className: 'chip chip--neutral' },
    observado: { label: 'Observado', className: 'chip chip--slate' },
  }[estado]

  return <span className={config.className}>{config.label}</span>
}
