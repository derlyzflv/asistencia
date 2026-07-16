import type {
  DetalleSincronizacion,
  RegistroSincronizacion,
} from '../types'

type SincronizacionDrawerProps = {
  abierto: boolean
  detalle: DetalleSincronizacion | null
  onCerrar: () => void
}

export function SincronizacionDrawer({ abierto, detalle, onCerrar }: SincronizacionDrawerProps) {
  return (
    <div className={`drawer-shell${abierto ? ' drawer-shell--open' : ''}`}>
      <button type="button" className="drawer-shell__backdrop" onClick={onCerrar} aria-label="Cerrar panel" />
      <aside className="drawer-shell__panel" aria-hidden={!abierto}>
        <div className="drawer-shell__header">
          <div>
            <p className="drawer-shell__eyebrow">Sincronizacion ZKTeco</p>
            <h2 className="drawer-shell__title">
              {detalle?.origen === 'equipo' ? 'Detalle del equipo' : 'Detalle de sincronizacion'}
            </h2>
            <p className="drawer-shell__description">Detalle de sincronizacion</p>
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
                <h3>Informacion general</h3>
                <p>Datos principales del equipo o del proceso ejecutado.</p>
              </div>
            </div>

            <div className="detail-grid">
              <DetalleItem label="Equipo" value={detalle?.equipoNombre ?? '--'} />
              <DetalleItem label="Estado" value={detalle ? formatearEstado(detalle.estado) : '--'} />
              <DetalleItem label="Fecha y hora" value={detalle?.fechaHora ?? '--'} />
              <DetalleItem label="Tipo" value={detalle?.tipo ? formatearTipo(detalle.tipo) : '--'} />
              <DetalleItem label="IP" value={detalle?.ip ?? '--'} />
              <DetalleItem label="Puerto" value={detalle?.puerto ? String(detalle.puerto) : '--'} />
            </div>
          </section>

          <section className="drawer-section">
            <div className="drawer-section__header">
              <span className="drawer-section__step">2</span>
              <div>
                <h3>Resultado de sincronizacion</h3>
                <p>Cifras principales del intercambio detectado.</p>
              </div>
            </div>

            <div className="detail-grid">
              <DetalleItem label="Usuarios detectados" value={String(detalle?.usuariosDetectados ?? 0)} />
              <DetalleItem label="Marcaciones detectadas" value={String(detalle?.marcacionesDetectadas ?? 0)} />
              <DetalleItem label="Importados" value={String(detalle?.importados ?? 0)} />
              <DetalleItem label="Ultima conexion" value={detalle?.ultimaConexion ?? '--'} />
              <DetalleItem label="Ubicacion" value={detalle?.ubicacion ?? '--'} />
            </div>
          </section>

          <section className="drawer-section drawer-section--muted">
            <div className="drawer-section__header">
              <span className="drawer-section__step">3</span>
              <div>
                <h3>Observacion</h3>
                <p>Resumen operativo para seguimiento inmediato.</p>
              </div>
            </div>

            <div className="biometric-status-box">
              <span className="biometric-status-box__label">Comentario</span>
              <strong>{detalle?.observacion ?? 'Sin observacion adicional.'}</strong>
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

function formatearTipo(tipo: RegistroSincronizacion['tipo']) {
  const labels = { usuarios: 'Usuarios', marcaciones: 'Marcaciones', mixta: 'Mixta' }
  return labels[tipo]
}

function formatearEstado(estado: DetalleSincronizacion['estado']) {
  const labels: Record<string, string> = {
    'en-linea': 'En linea',
    'sin-conexion': 'Sin conexion',
    advertencia: 'Advertencia',
    mantenimiento: 'Mantenimiento',
    completado: 'Completado',
    'en-proceso': 'En proceso',
    error: 'Error',
  }

  return labels[estado]
}
