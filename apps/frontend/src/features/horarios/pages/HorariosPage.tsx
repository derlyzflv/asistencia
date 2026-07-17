import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { HorarioDrawer } from '../components/HorarioDrawer'
import { HorariosTable } from '../components/HorariosTable'
import { fetchHorarios } from '../api'
import { horariosMock } from '../data/horarios.mock'
import type { FiltrosHorarios, Horario } from '../types'

export function HorariosPage() {
  const [horarios, setHorarios] = useState(horariosMock)
  const [cargando, setCargando] = useState(true)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosHorarios>({
    busqueda: '',
    estado: 'todos',
  })
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [horarioActivo, setHorarioActivo] = useState<Horario | null>(null)

  useEffect(() => {
    let cancelled = false

    async function cargarDatos() {
      try {
        const data = await fetchHorarios()

        if (cancelled) {
          return
        }

        setHorarios(data)
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

  const horariosFiltrados = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()

    return horarios.filter((horario) => {
      const coincideBusqueda =
        !query ||
        horario.codigo.toLowerCase().includes(query) ||
        horario.nombre.toLowerCase().includes(query)
      const coincideEstado = filtros.estado === 'todos' || horario.estado === filtros.estado

      return coincideBusqueda && coincideEstado
    })
  }, [filtros, horarios])

  const resumen = useMemo(
    () => ({
      total: horarios.length,
      activos: horarios.filter((horario) => horario.estado === 'activo').length,
      inactivos: horarios.filter((horario) => horario.estado === 'inactivo').length,
    }),
    [horarios],
  )

  function abrirDrawer(horario: Horario | null) {
    setHorarioActivo(horario)
    setDrawerAbierto(true)
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Modulo"
        title="Horarios"
        description="Catalogo de horarios"
      />

      <section className="hero-panel workers-hero">
        <div>
          <h2 className="hero-panel__title workers-hero__title">Horarios disponibles</h2>
        </div>
        <div className="workers-hero__stats">
          <ResumenCard label="Horarios" value={String(resumen.total)} />
          <ResumenCard label="Activos" value={String(resumen.activos)} />
          <ResumenCard label="Inactivos" value={String(resumen.inactivos)} />
          <ResumenCard label="Con tolerancia" value={String(horarios.filter((horario) => horario.toleranciaEntrada > 0 || horario.toleranciaSalida > 0).length)} />
        </div>
      </section>

      {cargando ? (
        <section className="empty-panel">
          <strong>Cargando horarios...</strong>
          <p>Obteniendo el catalogo desde la API.</p>
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
            Exportar horarios
          </button>
          <button type="button" className="button button--primary" onClick={() => abrirDrawer(null)}>
            Crear horario
          </button>
        </div>
      </section>

      <section className="filters-card">
        <div className="filters-grid filters-grid--horarios">
          <label className="field field--search">
            <span>Buscar</span>
            <input
              type="text"
              value={filtros.busqueda}
              placeholder="Codigo o nombre del horario"
              onChange={(event) =>
                setFiltros((previo) => ({ ...previo, busqueda: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span>Estado</span>
            <select
              value={filtros.estado}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  estado: event.target.value as FiltrosHorarios['estado'],
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
            Mostrando <strong>{horariosFiltrados.length}</strong> de <strong>{horarios.length}</strong>{' '}
            horarios.
          </p>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setFiltros({ busqueda: '', estado: 'todos' })}
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {horariosFiltrados.length > 0 ? (
        <HorariosTable horarios={horariosFiltrados} onEditar={abrirDrawer} />
      ) : (
        <section className="empty-panel">
          <strong>No se encontraron horarios</strong>
          <p>Prueba con otra busqueda o cambia el filtro de estado.</p>
        </section>
      )}

      <HorarioDrawer
        abierto={drawerAbierto}
        horario={horarioActivo}
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
