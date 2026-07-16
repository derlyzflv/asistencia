import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../../../components/shared/PageHeader'
import { TrabajadorDrawer } from '../components/TrabajadorDrawer'
import { TrabajadoresTable } from '../components/TrabajadoresTable'
import { fetchTrabajadoresCatalogos } from '../api'
import {
  areasMock,
  cargosMock,
  condicionesLaboralesMock,
  trabajadoresMock,
} from '../data/trabajadores.mock'
import type { FiltrosTrabajadores, Trabajador } from '../types'

export function TrabajadoresPage() {
  const [areas, setAreas] = useState(areasMock)
  const [cargos, setCargos] = useState(cargosMock)
  const [condicionesLaborales, setCondicionesLaborales] = useState(condicionesLaboralesMock)
  const [trabajadores, setTrabajadores] = useState(trabajadoresMock)
  const [cargando, setCargando] = useState(true)
  const [errorApi, setErrorApi] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosTrabajadores>({
    busqueda: '',
    areaId: 'todos',
    cargoId: 'todos',
    condicionLaboralId: 'todos',
    estado: 'todos',
    estadoBiometrico: 'todos',
  })
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const [trabajadorActivo, setTrabajadorActivo] = useState<Trabajador | null>(null)

  useEffect(() => {
    let cancelled = false

    async function cargarDatos() {
      try {
        const data = await fetchTrabajadoresCatalogos()

        if (cancelled) {
          return
        }

        setAreas(data.areas)
        setCargos(data.cargos)
        setCondicionesLaborales(data.condicionesLaborales)
        setTrabajadores(data.trabajadores)
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

  const trabajadoresFiltrados = useMemo(() => {
    const query = filtros.busqueda.trim().toLowerCase()

    return trabajadores.filter((trabajador) => {
      const coincideBusqueda =
        !query ||
        trabajador.dni.toLowerCase().includes(query) ||
        trabajador.nombreCompleto.toLowerCase().includes(query) ||
        (trabajador.codigoInterno ?? '').toLowerCase().includes(query)

      const coincideArea = filtros.areaId === 'todos' || trabajador.areaId === filtros.areaId
      const coincideCargo = filtros.cargoId === 'todos' || trabajador.cargoId === filtros.cargoId
      const coincideCondicion =
        filtros.condicionLaboralId === 'todos' ||
        trabajador.condicionLaboralId === filtros.condicionLaboralId
      const coincideEstado = filtros.estado === 'todos' || trabajador.estado === filtros.estado
      const coincideBiometrico =
        filtros.estadoBiometrico === 'todos' ||
        trabajador.estadoBiometrico === filtros.estadoBiometrico

      return (
        coincideBusqueda &&
        coincideArea &&
        coincideCargo &&
        coincideCondicion &&
        coincideEstado &&
        coincideBiometrico
      )
    })
  }, [filtros, trabajadores])

  const resumen = useMemo(
    () => ({
      total: trabajadores.length,
      activos: trabajadores.filter((trabajador) => trabajador.estado === 'activo').length,
      pendientes: trabajadores.filter(
        (trabajador) => trabajador.estadoBiometrico === 'pendiente',
      ).length,
      sinVincular: trabajadores.filter(
        (trabajador) => trabajador.estadoBiometrico === 'sin-vinculacion',
      ).length,
    }),
    [trabajadores],
  )

  function abrirDrawer(trabajador: Trabajador | null) {
    setTrabajadorActivo(trabajador)
    setDrawerAbierto(true)
  }

  function limpiarFiltros() {
    setFiltros({
      busqueda: '',
      areaId: 'todos',
      cargoId: 'todos',
      condicionLaboralId: 'todos',
      estado: 'todos',
      estadoBiometrico: 'todos',
    })
  }

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Modulo"
        title="Trabajadores"
        description="Gestion del personal"
      />

      <section className="hero-panel workers-hero">
        <div>
          <h2 className="hero-panel__title workers-hero__title">Padron de trabajadores</h2>
        </div>
        <div className="workers-hero__stats">
          <ResumenCard label="Trabajadores" value={String(resumen.total)} />
          <ResumenCard label="Activos" value={String(resumen.activos)} />
          <ResumenCard label="Pendientes" value={String(resumen.pendientes)} />
          <ResumenCard label="Sin vincular" value={String(resumen.sinVincular)} />
        </div>
      </section>

      <section className="workers-toolbar">
        <div className="workers-toolbar__actions">
          <button type="button" className="button button--ghost">
            Importar trabajadores
          </button>
          <button type="button" className="button button--primary" onClick={() => abrirDrawer(null)}>
            Registrar trabajador
          </button>
        </div>
      </section>

      {cargando ? (
        <section className="empty-panel">
          <strong>Cargando trabajadores...</strong>
          <p>Obteniendo catalogos y padron desde la API.</p>
        </section>
      ) : null}

      {errorApi ? (
        <section className="empty-panel">
          <strong>Modo local activo</strong>
          <p>{errorApi}</p>
        </section>
      ) : null}

      <section className="filters-card">
        <div className="filters-grid">
          <label className="field field--search">
            <span>Buscar</span>
            <input
              type="text"
              value={filtros.busqueda}
              placeholder="DNI, nombre o codigo interno"
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
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Cargo</span>
            <select
              value={String(filtros.cargoId)}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  cargoId:
                    event.target.value === 'todos' ? 'todos' : Number(event.target.value),
                }))
              }
            >
              <option value="todos">Todos los cargos</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Jornada laboral</span>
            <select
              value={String(filtros.condicionLaboralId)}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  condicionLaboralId:
                    event.target.value === 'todos' ? 'todos' : Number(event.target.value),
                }))
              }
            >
              <option value="todos">Todas las jornadas</option>
              {condicionesLaborales.map((condicion) => (
                <option key={condicion.id} value={condicion.id}>
                  {condicion.nombre}
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
                  estado: event.target.value as FiltrosTrabajadores['estado'],
                }))
              }
            >
              <option value="todos">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>

          <label className="field">
            <span>Biometrico</span>
            <select
              value={filtros.estadoBiometrico}
              onChange={(event) =>
                setFiltros((previo) => ({
                  ...previo,
                  estadoBiometrico: event.target.value as FiltrosTrabajadores['estadoBiometrico'],
                }))
              }
            >
              <option value="todos">Todos</option>
              <option value="vinculado">Vinculado</option>
              <option value="pendiente">Pendiente</option>
              <option value="sin-vinculacion">Sin vinculacion</option>
            </select>
          </label>
        </div>

        <div className="filters-footer">
          <p>
            Mostrando <strong>{trabajadoresFiltrados.length}</strong> de{' '}
            <strong>{trabajadores.length}</strong> trabajadores.
          </p>
          <button type="button" className="button button--ghost" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>
      </section>

      {trabajadoresFiltrados.length > 0 ? (
        <TrabajadoresTable trabajadores={trabajadoresFiltrados} onEditar={abrirDrawer} />
      ) : (
        <section className="empty-panel">
          <strong>No se encontraron trabajadores</strong>
          <p>Ajusta la busqueda o revisa los filtros aplicados.</p>
        </section>
      )}

      <TrabajadorDrawer
        abierto={drawerAbierto}
        trabajador={trabajadorActivo}
        areas={areas}
        cargos={cargos}
        condicionesLaborales={condicionesLaborales}
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
