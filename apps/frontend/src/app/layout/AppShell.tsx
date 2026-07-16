import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

const STORAGE_KEY = 'asistencia-sidebar-collapsed'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const value = window.localStorage.getItem(STORAGE_KEY)
    setSidebarCollapsed(value === '1')
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, sidebarCollapsed ? '1' : '0')
  }, [sidebarCollapsed])

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((value) => !value)}
      />

      <div className="app-shell__main">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="page-canvas">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
