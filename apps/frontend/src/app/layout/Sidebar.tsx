import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../lib/navigation'

type SidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
  onToggleCollapsed: () => void
}

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) {
  return (
    <>
      <div
        className={`sidebar-backdrop${mobileOpen ? ' sidebar-backdrop--visible' : ''}`}
        onClick={onCloseMobile}
      />
      <aside
        className={[
          'sidebar',
          collapsed ? 'sidebar--collapsed' : '',
          mobileOpen ? 'sidebar--mobile-open' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="sidebar__brand-row">
          <div className="sidebar__brand-copy">
            <h1 className="sidebar__brand">Control de Asistencia</h1>
          </div>

          <button
            type="button"
            className="sidebar__collapse-button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            <ChevronIcon direction={collapsed ? 'right' : 'left'} />
          </button>
        </div>

        <div className="sidebar__section-label">Nucleo operativo</div>

        <nav className="sidebar__nav" aria-label="Navegacion principal">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item${isActive ? ' nav-item--active' : ''}`
              }
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
            >
              <span className="nav-item__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-item__copy">
                <span className="nav-item__label">{item.label}</span>
                <span className="nav-item__hint">{item.hint}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user-avatar">AD</div>
          <div className="sidebar__user-copy">
            <span className="sidebar__user-name">Admin</span>
            <span className="sidebar__user-role">Equipo RR. HH.</span>
          </div>
        </div>
      </aside>
    </>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}
