import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import {
  createAsignacionHorario,
  fetchAsignacionHorariosData,
  updateAsignacionHorario,
} from '../api'
import { AsignacionHorarioDrawer } from '../components/AsignacionHorarioDrawer'
import { AsignacionHorariosTable } from '../components/AsignacionHorariosTable'
import { asignacionesHorariosMock, filtrosAsignacionMock } from '../data/asignacionHorarios.mock'
import type {
  AsignacionHorario,
  AsignacionHorarioFormData,
  AsignacionHorarioInput,
  FiltrosAsignacionHorarios,
} from '../types'

export function AsignacionHorariosPage() {
  const [asignaciones, setAsignaciones] = useState(asignacionesHorariosMock)
  const [trabajadores, setTrabajadores] = useState(filtrosAsignacionMock.trabajadores)
  const [horarios, setHorarios] = useState(filtrosAsignacionMock.horarios)
  const [cargando, setCargando] = useState(true)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [errorGuardado, setErrorGuardado] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosAsignacionHorarios>({
    busqueda: '',
    areaId: 'todos',
    horarioId: 'todos',
    estado: 'todos',
  })
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [asignacionActiva, setAsignacionActiva] = useState<AsignacionHorario | null>(null)

  async function cargarAsignaciones() {
    const data = await fetchAsignacionHorariosData()
    setAsignaciones(data.asignaciones)
    setTrabajadores(data.trabajadores)
    setHorarios(data.horarios)
    setErrorApi(null)
  }

  useEffect(() => {
    let cancelled = false

    async function cargarDatos() {
      try {
        const data = await fetchAsignacionHorariosData()

        if (cancelled) {
          return
        }

        setAsignaciones(data.asignaciones)
        setTrabajadores(data.trabajadores)
        setHorarios(data.horarios)
        setErrorApi(null)
      } catch {
        if (!cancelled) {
          setErrorApi('No se pudo cargar la API. Se muestran datos locales temporales.')
        }
      } finally {
        if (!cancelled) {
          setCargando(false)
        }
      }
    }

    void cargarDatos()

    return () => {
      cancelled = true
    }
  }, [])

  const asignacionesFiltradas = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()

    return asignaciones.filter((asignacion) => {
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
  }, [asignaciones, filtros])

  const resumen = useMemo(
    () => ({
      total: asignaciones.length,
      vigentes: asignaciones.filter((asignacion) => asignacion.estado === 'activo').length,
      inactivas: asignaciones.filter((asignacion) => asignacion.estado === 'inactivo').length,
      abiertas: asignaciones.filter((asignacion) => !asignacion.fechaFin).length,
    }),
    [asignaciones],
  )

  function abrirDrawer(asignacion: AsignacionHorario | null) {
    setErrorGuardado(null)
    setAsignacionActiva(asignacion)
    setDrawerAbierto(true)
  }

  async function guardarAsignacion(formData: AsignacionHorarioFormData) {
    const payload: AsignacionHorarioInput = {
      trabajadorId: formData.trabajadorId ?? 0,
      modoHorario: formData.modoHorario,
      horarioBaseId: formData.horarioId ?? null,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin?.trim() ? formData.fechaFin : null,
      estado: formData.estado,
      observacion: formData.observacion?.trim() ?? '',
    }

    setGuardando(true)
    setErrorGuardado(null)

    try {
      if (asignacionActiva) {
        await updateAsignacionHorario(asignacionActiva.id, payload)
      } else {
        await createAsignacionHorario(payload)
      }

      await cargarAsignaciones()
      setDrawerAbierto(false)
      setAsignacionActiva(null)
    } catch (error) {
      setErrorGuardado(error instanceof Error ? error.message : 'No se pudo guardar la asignacion.')
      throw error
    } finally {
      setGuardando(false)
    }
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

      {cargando ? (
        <section className="empty-panel">
          <strong>Cargando asignaciones...</strong>
          <p>Obteniendo padron, horarios y vigencias desde la API.</p>
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
              {horarios.map((horario) => (
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
            <strong>{asignaciones.length}</strong> asignaciones.
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
        trabajadores={trabajadores}
        horarios={horarios}
        guardando={guardando}
        error={errorGuardado}
        onGuardar={guardarAsignacion}
        onCerrar={() => {
          setDrawerAbierto(false)
          setErrorGuardado(null)
        }}
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
