import { useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { AsignacionHorarioDrawer } from '../components/AsignacionHorarioDrawer'
import { AsignacionHorariosTable } from '../components/AsignacionHorariosTable'
import { asignacionesHorariosMock, filtrosAsignacionMock } from '../data/asignacionHorarios.mock'
import type { AsignacionHorario, FiltrosAsignacionHorarios } from '../types'

export function AsignacionHorariosPage() {
  const [filtros, setFiltros] = useState<FiltrosAsignacionHorarios>({
    busqueda: '',
    areaId: 'todos',
    horarioId: 'todos',
    estado: 'todos',
  })
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [asignacionActiva, setAsignacionActiva] = useState<AsignacionHorario | null>(null)

  const asignacionesFiltradas = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()

    return asignacionesHorariosMock.filter((asignacion) => {
      const coincideBusqueda =
        !query ||
        asignacion.trabajadorNombre.toLowerCase().includes(query) ||
        asignacion.dni.includes(query)
      const coincideArea = filtros.areaId === 'todos' || asignacion.areaId === filtros.areaId
      const coincideHorario =
        filtros.horarioId === 'todos' || asignacion.horarioId === filtros.horarioId
      const coincideEstado = filtros.estado === 'todos' || asignacion.estado === filtros.estado

      return coincideBusqueda && coincideArea && coincideHorario && coincideEstado
    })
  }, [filtros])

  const resumen = useMemo(
    () => ({
      total: asignacionesHorariosMock.length,
      vigentes: asignacionesHorariosMock.filter((asignacion) => asignacion.estado === 'activo').length,
      inactivas: asignacionesHorariosMock.filter((asignacion) => asignacion.estado === 'inactivo').length,
      abiertas: asignacionesHorariosMock.filter((asignacion) => !asignacion.fechaFin).length,
    }),
    [],
  )

  function abrirDrawer(asignacion: AsignacionHorario | null) {
    setAsignacionActiva(asignacion)
    setDrawerAbierto(true)
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Modulo"
        title="Asignacion de horarios"
        description="Asignacion de horarios vigentes"
      />

      <section className="hero-panel workers-hero">
        <div>
          <h2 className="hero-panel__title workers-hero__title">Asignaciones del personal</h2>
        </div>
        <div className="workers-hero__stats">
          <ResumenCard label="Asignaciones" value={String(resumen.total)} />
          <ResumenCard label="Vigentes" value={String(resumen.vigentes)} />
          <ResumenCard label="Inactivas" value={String(resumen.inactivas)} />
          <ResumenCard label="Sin fecha fin" value={String(resumen.abiertas)} />
        </div>
      </section>

      <section className="workers-toolbar">
        <div className="workers-toolbar__actions">
          <button type="button" className="button button--ghost">
            Exportar asignaciones
          </button>
          <button type="button" className="button button--primary" onClick={() => abrirDrawer(null)}>
            Nueva asignacion
          </button>
        </div>
      </section>

      <section className="filters-card">
        <div className="filters-grid filters-grid--asignaciones">
          <label className="field field--search">
            <span>Buscar</span>
            <input
              type="text"
              value={filtros.busqueda}
              placeholder="DNI o nombre del trabajador"
              onChange={(event) =>
                setFiltros((previo) => ({ ...previo, busqueda: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Area</span>
            <select
              value={String(filtros.areaId)}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  areaId:
                    event.target.value === 'todos' ? 'todos' : Number(event.target.value),
                }))
              }
            >
              <option value="todos">Todas las areas</option>
              {filtrosAsignacionMock.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Horario</span>
            <select
              value={String(filtros.horarioId)}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  horarioId:
                    event.target.value === 'todos' ? 'todos' : Number(event.target.value),
                }))
              }
            >
              <option value="todos">Todos los horarios</option>
              {filtrosAsignacionMock.horarios.map((horario) => (
                <option key={horario.id} value={horario.id}>
                  {horario.codigo} - {horario.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Estado</span>
            <select
              value={filtros.estado}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  estado: event.target.value as FiltrosAsignacionHorarios['estado'],
                }))
              }
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
        </div>

        <div className="filters-footer">
          <p>
            Mostrando <strong>{asignacionesFiltradas.length}</strong> de{' '}
            <strong>{asignacionesHorariosMock.length}</strong> asignaciones.
          </p>
          <button
            type="button"
            className="button button--ghost"
            onClick={() =>
              setFiltros({ busqueda: '', areaId: 'todos', horarioId: 'todos', estado: 'todos' })
            }
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {asignacionesFiltradas.length > 0 ? (
        <AsignacionHorariosTable asignaciones={asignacionesFiltradas} onEditar={abrirDrawer} />
      ) : (
        <section className="empty-panel">
          <strong>No se encontraron asignaciones</strong>
          <p>Prueba con otra busqueda o cambia los filtros aplicados.</p>
        </section>
      )}

      <AsignacionHorarioDrawer
        abierto={drawerAbierto}
        asignacion={asignacionActiva}
        onCerrar={() => setDrawerAbierto(false)}
      />
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
