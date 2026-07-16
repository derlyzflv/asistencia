import type { Trabajador } from '../types'

type TrabajadoresTableProps = {
  trabajadores: Trabajador[]
  onEditar: (trabajador: Trabajador) => void
}

export function TrabajadoresTable({ trabajadores, onEditar }: TrabajadoresTableProps) {
  return (
    <>
      <div className="workers-table-card workers-table-card--desktop">
        <div className="workers-table-wrap">
          <table className="workers-table">
            <thead>
              <tr>
                <th>DNI</th>
                <th>Apellidos y nombres</th>
                <th>Cargo</th>
                <th>Area</th>
                <th>Jornada laboral</th>
                <th>Codigo interno</th>
                <th>Estado biometrico</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trabajadores.map((trabajador) => (
                <tr key={trabajador.id}>
                  <td>{trabajador.dni}</td>
                  <td>
                    <div className="workers-name-cell">
                      <strong>{trabajador.apellidos}</strong>
                      <span>{trabajador.nombres}</span>
                    </div>
                  </td>
                  <td>{trabajador.cargoNombre}</td>
                  <td>{trabajador.areaNombre}</td>
                  <td>{trabajador.condicionLaboralNombre}</td>
                  <td>{trabajador.codigoInterno ?? 'Pendiente'}</td>
                  <td>
                    <ChipEstadoBiometrico estado={trabajador.estadoBiometrico} />
                  </td>
                  <td>
                    <ChipEstadoTrabajador estado={trabajador.estado} />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="workers-row-button"
                      onClick={() => onEditar(trabajador)}
                    >
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
        {trabajadores.map((trabajador) => (
          <article key={trabajador.id} className="worker-card">
            <div className="worker-card__top">
              <div>
                <p className="worker-card__eyebrow">{trabajador.dni}</p>
                <h2 className="worker-card__title">{trabajador.nombreCompleto}</h2>
              </div>
              <ChipEstadoTrabajador estado={trabajador.estado} />
            </div>

            <dl className="worker-card__grid">
              <div>
                <dt>Cargo</dt>
                <dd>{trabajador.cargoNombre}</dd>
              </div>
              <div>
                <dt>Area</dt>
                <dd>{trabajador.areaNombre}</dd>
              </div>
              <div>
                <dt>Jornada</dt>
                <dd>{trabajador.condicionLaboralNombre}</dd>
              </div>
              <div>
                <dt>Codigo interno</dt>
                <dd>{trabajador.codigoInterno ?? 'Pendiente'}</dd>
              </div>
            </dl>

            <div className="worker-card__footer">
              <ChipEstadoBiometrico estado={trabajador.estadoBiometrico} />
              <button
                type="button"
                className="workers-row-button"
                onClick={() => onEditar(trabajador)}
              >
                Ver detalle
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function ChipEstadoTrabajador({ estado }: { estado: Trabajador['estado'] }) {
  const label = estado === 'activo' ? 'Activo' : 'Inactivo'
  const className = estado === 'activo' ? 'chip chip--success' : 'chip chip--neutral'

  return <span className={className}>{label}</span>
}

function ChipEstadoBiometrico({ estado }: { estado: Trabajador['estadoBiometrico'] }) {
  const config = {
    vinculado: { label: 'Vinculado', className: 'chip chip--success-soft' },
    pendiente: { label: 'Pendiente', className: 'chip chip--warning' },
    'sin-vinculacion': { label: 'Sin vinculacion', className: 'chip chip--danger' },
  }[estado]

  return <span className={config.className}>{config.label}</span>
}
