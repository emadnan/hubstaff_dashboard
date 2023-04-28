import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilSpeedometer, cilClock, cilChartLine, cilSpreadsheet, cilCalendar, cilCash, cilUser, cilLocationPin, cilUserFollow, cilStream } from '@coreui/icons'
import { CNavGroup, CNavItem, } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Timesheets',
    to: '/timesheets',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View & Edit',
        to: '/timesheets/viewedit',
      },
      {
        component: CNavItem,
        name: 'Approvals',
        to: '/timesheets/approvals',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Activity',
    to: '/activity',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Screenshots',
        to: '/activity/screenshots',
      },
      {
        component: CNavItem,
        name: 'Apps',
        to: '/activity/apps',
      },
      {
        component: CNavItem,
        name: 'URLs',
        to: '/activity/urls',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Map',
    to: '/map',
    icon: <CIcon icon={cilLocationPin} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Project Management',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Projects',
        to: '/projectmanagement/projects',
      },
      {
        component: CNavItem,
        name: 'Assigned Projects',
        to: '/projectmanagement/assigned',
      },
      {
        component: CNavItem,
        name: 'Clients',
        to: '/projectmanagement/client',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Companies',
    to: '/companies/Companies',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Departments',
    to: '/departments/Departments',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users/Users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Roles',
    to: '/roles/Roles',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Permissions',
    to: '/permissions/Permission',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Calendar',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Schedules',
        to: '/calendar/schedules',
      },
      {
        component: CNavItem,
        name: 'Time off Requests',
        to: '/calendar/timeoffrequests',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Time & Activity',
        to: '/reports/timenactivity',
      },
      {
        component: CNavItem,
        name: 'Weekly',
        to: '/reports/weekly',
      },
      {
        component: CNavItem,
        name: 'Accounts Owed',
        to: '/reports/accountsowed',
      },
      {
        component: CNavItem,
        name: 'Payments',
        to: '/reports/payments',
      },
      {
        component: CNavItem,
        name: 'All Reports',
        to: '/reports/allreports',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Teams',
    to: '/teams',
    icon: <CIcon icon={cilStream} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Expenses',
    to: '/expenses',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  },
]

export default _nav
