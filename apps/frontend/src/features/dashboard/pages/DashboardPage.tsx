import { PageHeader } from '../../../components/shared/PageHeader'
import { TarjetaAccesoRapido } from '../../../components/shared/TarjetaAccesoRapido'

const quickAccess = [
  {
    title: 'Trabajadores',
    description: 'Gestiona el padron base y revisa fichas del personal.',
    to: '/trabajadores',
    badge: 'TR',
  },
  {
    title: 'Horarios',
    description: 'Consulta turnos, tolerancias y configuraciones de jornada.',
    to: '/horarios',
    badge: 'HO',
  },
  {
    title: 'Asignacion de horarios',
    description: 'Relaciona horarios con trabajadores y grupos operativos.',
    to: '/asignacion-horarios',
    badge: 'AH',
  },
  {
    title: 'Sincronizacion ZKTeco',
    description: 'Supervisa la integracion y las importaciones pendientes.',
    to: '/sincronizacion-zkteco',
    badge: 'ZK',
  },
  {
    title: 'Control diario',
    description: 'Revisa incidencias del dia y abre el detalle por trabajador.',
    to: '/control-diario',
    badge: 'CD',
  },
]

export function DashboardPage() {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="Inicio"
        title="Accesos rapidos"
        description=""
      />

      <section className="hero-panel">
        <div>
          <h2 className="hero-panel__title">Accesos principales</h2>
        </div>
      </section>

      <section className="quick-grid" aria-label="Accesos rapidos del sistema">
        {quickAccess.map((item) => (
          <TarjetaAccesoRapido key={item.to} {...item} />
        ))}
      </section>
    </div>
  )
}
