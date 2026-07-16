import type { Horario } from '../types'

type HorariosTableProps = {
  horarios: Horario[]
  onEditar: (horario: Horario) => void
}

export function HorariosTable({ horarios, onEditar }: HorariosTableProps) {
  return (
    <>
      <div className="workers-table-card workers-table-card--desktop">
        <div className="workers-table-wrap">
          <table className="workers-table horarios-table">
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Hora entrada</th>
                <th>Hora salida</th>
                <th>Tol. entrada</th>
                <th>Tol. salida</th>
                <th>Descripcion</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map((horario) => (
                <tr key={horario.id}>
                  <td><strong>{horario.codigo}</strong></td>
                  <td>{horario.nombre}</td>
                  <td>{horario.horaEntrada}</td>
                  <td>{horario.horaSalida}</td>
                  <td>{horario.toleranciaEntrada} min</td>
                  <td>{horario.toleranciaSalida} min</td>
                  <td className="horarios-table__description">{horario.descripcion ?? 'Sin descripcion'}</td>
                  <td><ChipEstadoHorario estado={horario.estado} /></td>
                  <td>
                    <button type="button" className="workers-row-button" onClick={() => onEditar(horario)}>
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
        {horarios.map((horario) => (
          <article key={horario.id} className="worker-card horario-card">
            <div className="worker-card__top">
              <div>
                <p className="worker-card__eyebrow">{horario.codigo}</p>
                <h2 className="worker-card__title">{horario.nombre}</h2>
              </div>
              <ChipEstadoHorario estado={horario.estado} />
            </div>

            <dl className="worker-card__grid horario-card__grid">
              <div>
                <dt>Entrada</dt>
                <dd>{horario.horaEntrada}</dd>
              </div>
              <div>
                <dt>Salida</dt>
                <dd>{horario.horaSalida}</dd>
              </div>
              <div>
                <dt>Tol. entrada</dt>
                <dd>{horario.toleranciaEntrada} min</dd>
              </div>
              <div>
                <dt>Tol. salida</dt>
                <dd>{horario.toleranciaSalida} min</dd>
              </div>
            </dl>

            <p className="horario-card__description">{horario.descripcion ?? 'Sin descripcion registrada.'}</p>

            <div className="worker-card__footer">
              <button type="button" className="workers-row-button" onClick={() => onEditar(horario)}>
                Editar horario
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function ChipEstadoHorario({ estado }: { estado: Horario['estado'] }) {
  const label = estado === 'activo' ? 'Activo' : 'Inactivo'
  const className = estado === 'activo' ? 'chip chip--success-soft' : 'chip chip--neutral'

  return <span className={className}>{label}</span>
}
