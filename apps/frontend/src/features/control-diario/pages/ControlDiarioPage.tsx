import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { ControlDiarioDrawer } from '../components/ControlDiarioDrawer'
import { ControlDiarioTable } from '../components/ControlDiarioTable'
import { fetchControlDiario, type ControlDiarioResponse } from '../api'
import {
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
    fecha: '',
    busqueda: '',
    areaId: 'todos',
    estado: 'todos',
  })
  const [controlDiario, setControlDiario] = useState<ControlDiarioResponse>({
    fecha: '',
    resumen: resumenControlDiarioMock,
    registros: registrosControlDiarioMock,
  })
  const [cargando, setCargando] = useState(true)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [detalleActivo, setDetalleActivo] = useState<ControlDiarioDetalle | null>(null)

  useEffect(() => {
    let cancelled = false

    async function cargar() {
      try {
        const data = await fetchControlDiario(filtros.fecha || undefined)

        if (cancelled) return

        setControlDiario(data)
        setErrorApi(null)

        if (!filtros.fecha && data.fecha) {
          setFiltros((previo) => ({ ...previo, fecha: data.fecha }))
        }
      } catch {
        if (cancelled) return

        setErrorApi('No se pudo cargar la API. Se muestran datos locales temporales.')

        if (!filtros.fecha) {
          setFiltros((previo) => ({
            ...previo,
            fecha: registrosControlDiarioMock[0]?.fecha ?? '',
          }))
        }
      } finally {
        if (!cancelled) {
          setCargando(false)
        }
      }
    }

    void cargar()

    return () => {
      cancelled = true
    }
  }, [filtros.fecha])

  const areas = useMemo(() => {
    const source = controlDiario.registros.length > 0 ? controlDiario.registros : registrosControlDiarioMock
    const map = new Map<number, { id: number; nombre: string }>()

    for (const registro of source) {
      map.set(registro.areaId, { id: registro.areaId, nombre: registro.areaNombre })
    }

    return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [controlDiario.registros])

  const registrosFiltrados = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()
    const source = controlDiario.registros.length > 0 ? controlDiario.registros : registrosControlDiarioMock

    return source.filter((registro) => {
      const coincideFecha = registro.fecha === filtros.fecha
      const coincideBusqueda =
        !query ||
        registro.trabajadorNombre.toLowerCase().includes(query) ||
        registro.dni.includes(query)
      const coincideArea = filtros.areaId === 'todos' || registro.areaId === filtros.areaId
      const coincideEstado = filtros.estado === 'todos' || registro.estado === filtros.estado

      return coincideFecha && coincideBusqueda && coincideArea && coincideEstado
    })
  }, [controlDiario.registros, filtros])

  function abrirDetalle(registro: RegistroControlDiario) {
    setDetalleActivo(registro)
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
          <ResumenCard label="Programados" value={String(controlDiario.resumen.programados)} />
          <ResumenCard label="Asistencias" value={String(controlDiario.resumen.asistencias)} />
          <ResumenCard label="Tardanzas" value={String(controlDiario.resumen.tardanzas)} />
          <ResumenCard label="Faltas" value={String(controlDiario.resumen.faltas)} />
          <ResumenCard
            label="S. anticipadas"
            value={String(controlDiario.resumen.salidasAnticipadas)}
          />
          <ResumenCard label="Incompletas" value={String(controlDiario.resumen.incompletas)} />
          <ResumenCard label="Justificados" value={String(controlDiario.resumen.justificados)} />
          <ResumenCard label="Sin horario" value={String(controlDiario.resumen.sinHorario)} />
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

      {cargando ? (
        <section className="empty-panel">
          <strong>Cargando control diario...</strong>
          <p>Obteniendo marcaciones y resumen del dia.</p>
        </section>
      ) : null}

      {errorApi ? (
        <section className="empty-panel">
          <strong>Modo local activo</strong>
          <p>{errorApi}</p>
        </section>
      ) : null}

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
               {(areas.length > 0 ? areas : filtrosControlDiarioMock.areas).map((area) => (
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
            <strong>{(controlDiario.registros.length > 0 ? controlDiario.registros : registrosControlDiarioMock).filter((registro) => registro.fecha === filtros.fecha).length}</strong>{' '}
            registros del dia.
          </p>
          <button
            type="button"
            className="button button--ghost"
            onClick={() =>
              setFiltros({
                fecha: controlDiario.fecha || '',
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
