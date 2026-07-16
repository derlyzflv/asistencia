import { useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { ControlDiarioDrawer } from '../components/ControlDiarioDrawer'
import { ControlDiarioTable } from '../components/ControlDiarioTable'
import {
  detalleControlDiarioMock,
  fechaControlDiarioMock,
  filtrosControlDiarioMock,
  registrosControlDiarioMock,
  resumenControlDiarioMock,
} from '../data/controlDiario.mock'
import type {
  ControlDiarioDetalle,
  FiltrosControlDiario,
  RegistroControlDiario,
} from '../types'

export function ControlDiarioPage() {
  const [filtros, setFiltros] = useState<FiltrosControlDiario>({
    fecha: fechaControlDiarioMock,
    busqueda: '',
    areaId: 'todos',
    estado: 'todos',
  })
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [detalleActivo, setDetalleActivo] = useState<ControlDiarioDetalle | null>(null)

  const registrosFiltrados = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()

    return registrosControlDiarioMock.filter((registro) => {
      const coincideFecha = registro.fecha === filtros.fecha
      const coincideBusqueda =
        !query ||
        registro.trabajadorNombre.toLowerCase().includes(query) ||
        registro.dni.includes(query)
      const coincideArea = filtros.areaId === 'todos' || registro.areaId === filtros.areaId
      const coincideEstado = filtros.estado === 'todos' || registro.estado === filtros.estado

      return coincideFecha && coincideBusqueda && coincideArea && coincideEstado
    })
  }, [filtros])

  function abrirDetalle(registro: RegistroControlDiario) {
    const detalle = detalleControlDiarioMock.find(
      (item) => item.trabajadorId === registro.trabajadorId && item.fecha === registro.fecha,
    )

    setDetalleActivo(detalle ?? null)
    setDrawerAbierto(true)
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Modulo"
        title="Control diario"
        description="Revision diaria de asistencia"
      />

      <section className="hero-panel hero-panel--metrics workers-hero">
        <div>
          <h2 className="hero-panel__title workers-hero__title">Asistencia del dia</h2>
        </div>
        <div className="workers-hero__stats workers-hero__stats--wide">
          <ResumenCard label="Programados" value={String(resumenControlDiarioMock.programados)} />
          <ResumenCard label="Asistencias" value={String(resumenControlDiarioMock.asistencias)} />
          <ResumenCard label="Tardanzas" value={String(resumenControlDiarioMock.tardanzas)} />
          <ResumenCard label="Faltas" value={String(resumenControlDiarioMock.faltas)} />
          <ResumenCard
            label="S. anticipadas"
            value={String(resumenControlDiarioMock.salidasAnticipadas)}
          />
          <ResumenCard label="Incompletas" value={String(resumenControlDiarioMock.incompletas)} />
          <ResumenCard label="Justificados" value={String(resumenControlDiarioMock.justificados)} />
          <ResumenCard label="Sin horario" value={String(resumenControlDiarioMock.sinHorario)} />
        </div>
      </section>

      <section className="alert-panel">
        <div>
          <strong>Atencion requerida</strong>
          <p>
            Se detectaron registros con marcaciones incompletas y sin horario que requieren revision antes del cierre del dia.
          </p>
        </div>
        <button type="button" className="button button--ghost">
          Atender ahora
        </button>
      </section>

      <section className="workers-toolbar">
        <div className="workers-toolbar__actions">
          <label className="field field--compact">
            <span>Fecha</span>
            <input
              type="date"
              value={filtros.fecha}
              onChange={(event) => setFiltros((previo) => ({ ...previo, fecha: event.target.value }))}
            />
          </label>
          <button type="button" className="button button--ghost">
            Exportar
          </button>
          <button type="button" className="button button--primary">
            Procesar dia
          </button>
        </div>
      </section>

      <section className="filters-card">
        <div className="filters-grid filters-grid--control">
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
              {filtrosControlDiarioMock.areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
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
                  estado: event.target.value as FiltrosControlDiario['estado'],
                }))
              }
            >
              <option value="todos">Todos</option>
              <option value="asistio">Asistio</option>
              <option value="tardanza">Tardanza</option>
              <option value="falta">Falta</option>
              <option value="salida-anticipada">Salida anticipada</option>
              <option value="incompleto">Incompleto</option>
              <option value="justificado">Justificado</option>
              <option value="sin-horario">Sin horario</option>
              <option value="observado">Observado</option>
            </select>
          </label>
        </div>

        <div className="filters-footer">
          <p>
            Mostrando <strong>{registrosFiltrados.length}</strong> de{' '}
            <strong>
              {registrosControlDiarioMock.filter((registro) => registro.fecha === filtros.fecha).length}
            </strong>{' '}
            registros del dia.
          </p>
          <button
            type="button"
            className="button button--ghost"
            onClick={() =>
              setFiltros({
                fecha: fechaControlDiarioMock,
                busqueda: '',
                areaId: 'todos',
                estado: 'todos',
              })
            }
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {registrosFiltrados.length > 0 ? (
        <ControlDiarioTable registros={registrosFiltrados} onVerDetalle={abrirDetalle} />
      ) : (
        <section className="empty-panel">
          <strong>No se encontraron registros</strong>
          <p>Prueba con otra fecha o cambia los filtros aplicados.</p>
        </section>
      )}

      <ControlDiarioDrawer
        abierto={drawerAbierto}
        detalle={detalleActivo}
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
