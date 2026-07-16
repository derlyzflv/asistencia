import { useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { EquiposBiometricosGrid } from '../components/EquiposBiometricosGrid'
import { HistorialSincronizacionTable } from '../components/HistorialSincronizacionTable'
import { SincronizacionDrawer } from '../components/SincronizacionDrawer'
import {
  detallesSincronizacionMock,
  equiposBiometricosMock,
  historialSincronizacionMock,
  resumenSincronizacionMock,
  ultimaSincronizacionMock,
} from '../data/sincronizacionZkteco.mock'
import type {
  DetalleSincronizacion,
  EquipoBiometrico,
  FiltrosSincronizacion,
  RegistroSincronizacion,
} from '../types'

export function SincronizacionZktecoPage() {
  const [filtros, setFiltros] = useState<FiltrosSincronizacion>({
    busqueda: '',
    equipoId: 'todos',
    estado: 'todos',
    tipo: 'todos',
  })
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [detalleActivo, setDetalleActivo] = useState<DetalleSincronizacion | null>(null)

  const historialFiltrado = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()

    return historialSincronizacionMock.filter((registro) => {
      const coincideBusqueda = !query || registro.equipoNombre.toLowerCase().includes(query)
      const coincideEquipo = filtros.equipoId === 'todos' || registro.equipoId === filtros.equipoId
      const coincideEstado = filtros.estado === 'todos' || registro.estado === filtros.estado
      const coincideTipo = filtros.tipo === 'todos' || registro.tipo === filtros.tipo

      return coincideBusqueda && coincideEquipo && coincideEstado && coincideTipo
    })
  }, [filtros])

  function abrirEquipo(equipo: EquipoBiometrico) {
    const detalle = detallesSincronizacionMock.find(
      (item) => item.origen === 'equipo' && item.equipoNombre === equipo.nombre,
    )
    setDetalleActivo(detalle ?? null)
    setDrawerAbierto(true)
  }

  function abrirRegistro(registro: RegistroSincronizacion) {
    const detalle = detallesSincronizacionMock.find(
      (item) => item.origen === 'registro' && item.equipoNombre === registro.equipoNombre && item.fechaHora === registro.fechaHora,
    )
    setDetalleActivo(detalle ?? null)
    setDrawerAbierto(true)
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Modulo"
        title="Sincronizacion ZKTeco"
        description="Estado de sincronizacion"
      />

      <section className="hero-panel hero-panel--metrics workers-hero">
        <div>
          <h2 className="hero-panel__title workers-hero__title">Sincronizacion de equipos</h2>
        </div>
        <div className="workers-hero__stats workers-hero__stats--wide">
          <ResumenCard label="Equipos activos" value={String(resumenSincronizacionMock.equiposActivos)} />
          <ResumenCard label="Con alerta" value={String(resumenSincronizacionMock.equiposConAlerta)} />
          <ResumenCard label="Usuarios" value={String(resumenSincronizacionMock.usuariosDetectados)} />
          <ResumenCard label="Marcaciones" value={String(resumenSincronizacionMock.marcacionesDetectadas)} />
          <ResumenCard label="Importados" value={String(resumenSincronizacionMock.importados)} />
          <ResumenCard label="Errores" value={String(resumenSincronizacionMock.errores)} />
        </div>
      </section>

      <section className="alert-panel">
        <div>
          <strong>Ultima sincronizacion</strong>
          <p>{ultimaSincronizacionMock}</p>
        </div>
        <button type="button" className="button button--ghost">
          Revisar alertas
        </button>
      </section>

      <section className="workers-toolbar">
        <div className="workers-toolbar__actions">
          <button type="button" className="button button--primary">Sincronizar ahora</button>
          <button type="button" className="button button--ghost">Importar usuarios</button>
          <button type="button" className="button button--ghost">Importar marcaciones</button>
        </div>
      </section>

      <EquiposBiometricosGrid equipos={equiposBiometricosMock} onVerDetalle={abrirEquipo} />

      <section className="filters-card">
        <div className="filters-grid filters-grid--sync">
          <label className="field field--search">
            <span>Buscar</span>
            <input
              type="text"
              value={filtros.busqueda}
              placeholder="Nombre del equipo"
              onChange={(event) => setFiltros((previo) => ({ ...previo, busqueda: event.target.value }))}
            />
          </label>

          <label className="field">
            <span>Equipo</span>
            <select
              value={String(filtros.equipoId)}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  equipoId: event.target.value === 'todos' ? 'todos' : Number(event.target.value),
                }))
              }
            >
              <option value="todos">Todos los equipos</option>
              {equiposBiometricosMock.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Tipo</span>
            <select
              value={filtros.tipo}
              onChange={(event) => setFiltros((previo) => ({ ...previo, tipo: event.target.value as FiltrosSincronizacion['tipo'] }))}
            >
              <option value="todos">Todos</option>
              <option value="usuarios">Usuarios</option>
              <option value="marcaciones">Marcaciones</option>
              <option value="mixta">Mixta</option>
            </select>
          </label>

          <label className="field">
            <span>Estado</span>
            <select
              value={filtros.estado}
              onChange={(event) => setFiltros((previo) => ({ ...previo, estado: event.target.value as FiltrosSincronizacion['estado'] }))}
            >
              <option value="todos">Todos</option>
              <option value="completado">Completado</option>
              <option value="en-proceso">En proceso</option>
              <option value="advertencia">Advertencia</option>
              <option value="error">Error</option>
            </select>
          </label>
        </div>

        <div className="filters-footer">
          <p>
            Mostrando <strong>{historialFiltrado.length}</strong> de <strong>{historialSincronizacionMock.length}</strong> eventos de sincronizacion.
          </p>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setFiltros({ busqueda: '', equipoId: 'todos', estado: 'todos', tipo: 'todos' })}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      <HistorialSincronizacionTable registros={historialFiltrado} onVerDetalle={abrirRegistro} />

      <SincronizacionDrawer abierto={drawerAbierto} detalle={detalleActivo} onCerrar={() => setDrawerAbierto(false)} />
    </div>
  )
}

function ResumenCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="workers-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
