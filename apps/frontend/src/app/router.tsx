import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { TrabajadoresPage } from '../features/trabajadores/pages/TrabajadoresPage'
import { HorariosPage } from '../features/horarios/pages/HorariosPage'
import { AsignacionHorariosPage } from '../features/asignacion-horarios/pages/AsignacionHorariosPage'
import { SincronizacionZktecoPage } from '../features/sincronizacion-zkteco/pages/SincronizacionZktecoPage'
import { ControlDiarioPage } from '../features/control-diario/pages/ControlDiarioPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'trabajadores', element: <TrabajadoresPage /> },
      { path: 'horarios', element: <HorariosPage /> },
      { path: 'asignacion-horarios', element: <AsignacionHorariosPage /> },
      { path: 'sincronizacion-zkteco', element: <SincronizacionZktecoPage /> },
      { path: 'control-diario', element: <ControlDiarioPage /> },
    ],
  },
])
