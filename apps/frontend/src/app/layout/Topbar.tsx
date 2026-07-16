type TopbarProps = {
  onOpenSidebar: () => void
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar__group">
        <button
          type="button"
          className="topbar__menu-button"
          onClick={onOpenSidebar}
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </button>

        <div>
          <h2 className="topbar__title">Panel principal</h2>
        </div>
      </div>

      <div className="topbar__group topbar__group--meta">
        <div className="topbar__period">Periodo activo: Julio 2026</div>
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}
