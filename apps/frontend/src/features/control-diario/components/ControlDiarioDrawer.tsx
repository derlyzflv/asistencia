import type { ControlDiarioDetalle, RegistroControlDiario } from '../types'

type ControlDiarioDrawerProps = {
  abierto: boolean
  detalle: ControlDiarioDetalle | null
  onCerrar: () => void
}

export function ControlDiarioDrawer({ abierto, detalle, onCerrar }: ControlDiarioDrawerProps) {
  return (
    <div className={`drawer-shell${abierto ? ' drawer-shell--open' : ''}`}>
      <button type="button" className="drawer-shell__backdrop" onClick={onCerrar} aria-label="Cerrar panel" />
      <aside className="drawer-shell__panel" aria-hidden={!abierto}>
        <div className="drawer-shell__header">
          <div>
            <p className="drawer-shell__eyebrow">Control diario</p>
            <h2 className="drawer-shell__title">Detalle del trabajador</h2>
            <p className="drawer-shell__description">Detalle del registro diario</p>
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
                <p>Informacion principal del registro diario.</p>
              </div>
            </div>

            <div className="detail-grid">
              <DetalleItem label="Trabajador" value={detalle?.trabajadorNombre ?? '--'} />
              <DetalleItem label="DNI" value={detalle?.dni ?? '--'} />
              <DetalleItem label="Area" value={detalle?.areaNombre ?? '--'} />
              <DetalleItem label="Cargo" value={detalle?.cargoNombre ?? '--'} />
              <DetalleItem label="Fecha" value={formatearFecha(detalle?.fecha)} />
              <DetalleItem label="Horario" value={detalle?.horarioNombre ?? '--'} />
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">2</span>
              <div>
                <h3>Marcaciones y horario</h3>
                <p>Comparacion entre horario esperado y registro capturado.</p>
              </div>
            </div>

            <div className="detail-grid">
              <DetalleItem label="Entrada programada" value={detalle?.horaProgramadaEntrada ?? '--'} />
              <DetalleItem label="Primera marcacion" value={detalle?.primeraMarcacion ?? '--'} />
              <DetalleItem label="Salida programada" value={detalle?.horaProgramadaSalida ?? '--'} />
              <DetalleItem label="Ultima marcacion" value={detalle?.ultimaMarcacion ?? '--'} />
              <DetalleItem label="Minutos de tardanza" value={detalle ? `${detalle.minutosTardanza} min` : '--'} />
              <DetalleItem label="Salida temprana" value={detalle ? `${detalle.minutosSalidaTemprano} min` : '--'} />
            </div>
          </section>

          <section className="drawer-section drawer-section--muted">
            <div className="drawer-section__header">
              <span className="drawer-section__step">3</span>
              <div>
                <h3>Estado del registro</h3>
                <p>Resumen operativo para revisiones y seguimiento.</p>
              </div>
            </div>

            <div className="biometric-status-box">
              <span className="biometric-status-box__label">Estado actual</span>
              <strong>{detalle ? formatearEstado(detalle.estado) : '--'}</strong>
              <p>
                {detalle
                  ? `${detalle.cantidadMarcaciones} marcacion(es) registradas. ${detalle.observacion ?? 'Sin observacion adicional.'}`
                  : 'Sin informacion disponible.'}
              </p>
            </div>
          </section>
        </div>

        <div className="drawer-shell__footer">
          <button type="button" className="button button--ghost" onClick={onCerrar}>
            Cerrar
          </button>
        </div>
      </aside>
    </div>
  )
}

function DetalleItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function formatearFecha(value?: string) {
  if (!value) return '--'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function formatearEstado(estado: RegistroControlDiario['estado']) {
  const labels = {
    asistio: 'Asistio',
    tardanza: 'Tardanza',
    falta: 'Falta',
    'salida-anticipada': 'Salida anticipada',
    incompleto: 'Incompleto',
    justificado: 'Justificado',
    'sin-horario': 'Sin horario',
    observado: 'Observado',
  }

  return labels[estado]
}
