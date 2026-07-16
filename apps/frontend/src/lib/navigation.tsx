import type { ReactNode } from 'react'
import {
  AssignIcon,
  ChecklistIcon,
  ClockIcon,
  HomeIcon,
  SyncIcon,
  WorkersIcon,
} from '../components/shared/NavigationIcons'

type NavigationItem = {
  to: string
  label: string
  hint: string
  icon: ReactNode
}

export const navigationItems: NavigationItem[] = [
  {
    to: '/',
    label: 'Inicio',
    hint: 'Accesos rapidos',
    icon: <HomeIcon />,
  },
  {
    to: '/trabajadores',
    label: 'Trabajadores',
    hint: 'Padron y fichas',
    icon: <WorkersIcon />,
  },
  {
    to: '/horarios',
    label: 'Horarios',
    hint: 'Turnos y tolerancias',
    icon: <ClockIcon />,
  },
  {
    to: '/asignacion-horarios',
    label: 'Asignacion',
    hint: 'Relacion de horarios',
    icon: <AssignIcon />,
  },
  {
    to: '/sincronizacion-zkteco',
    label: 'Sincronizacion',
    hint: 'ZKTeco y registros',
    icon: <SyncIcon />,
  },
  {
    to: '/control-diario',
    label: 'Control diario',
    hint: 'Revision por jornada',
    icon: <ChecklistIcon />,
  },
]
