import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilSpeedometer,
  cilClock,
  cilChartLine,
  cilSpreadsheet,
  cilCalendar,
  cilCash,
  cilUser,
  cilTask,
  cilUserFollow,
  cilStream,
  cilLineWeight,
  cilDollar,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

//Local Storage data
const local = JSON.parse(localStorage.getItem('user-info'))
const permissions = local.permissions
const permissionNames = permissions.map((permission) => permission.name)

const _navAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permission: 'Nav_Dashboard',
  },
  {
    component: CNavGroup,
    name: 'Timesheets',
    to: '/timesheets',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    permission: 'Nav_Timesheets',
    items: [
      {
        component: CNavItem,
        name: 'View & Edit',
        to: '/timesheets-viewedit',
        permission: 'Nav_ViewNedits',
      },
      {
        component: CNavItem,
        name: 'Approvals',
        to: '/timesheets-approvals',
        permission: 'Nav_Approvals',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Activity',
    to: '/activity',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    permission: 'Nav_Activity',
    items: [
      {
        component: CNavItem,
        name: 'Screenshots',
        to: '/activity-screenshots',
        permission: 'Nav_Screenshots',
      },
      {
        component: CNavItem,
        name: 'Apps',
        to: '/activity-apps',
        permission: 'Nav_Apps',
      },
      {
        component: CNavItem,
        name: 'URLs',
        to: '/activity-urls',
        permission: 'Nav_URLs',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Project Management',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    permission: 'Nav_ProjectManagement',
    items: [
      {
        component: CNavItem,
        name: 'Projects',
        to: '/projectmanagement-projects',
        permission: 'Nav_Projects',
      },
      {
        component: CNavItem,
        name: 'Assigned Projects',
        to: '/projectmanagement-assigned',
        permission: 'Nav_AssignedProjects',
      },
      {
        component: CNavItem,
        name: 'Streams',
        to: '/streams',
        // icon: <CIcon icon={cilStream} customClassName="nav-icon" />,
        permission: 'Nav_Streams',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Clients',
  //   to: '/projectmanagement-client',
  //   permission: 'Nav_Clients',
  // },
  {
    component: CNavGroup,
    name: 'Task Management',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
    permission: 'Nav_TaskManagement',
    items: [
      {
        component: CNavItem,
        name: 'Assigned Task',
        to: '/taskmanagement-assignedtask',
        permission: 'Nav_AssignedTask',
      },
      {
        component: CNavItem,
        name: 'Create New Task',
        to: '/taskmanagement-createnewtask',
        permission: 'Nav_CreateNewTask',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Companies',
    to: '/companies-Companies',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    permission: 'Nav_Companies',
  },
  {
    component: CNavItem,
    name: 'Departments',
    to: '/departments-Departments',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    permission: 'Nav_Departments',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users-Users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permission: 'Nav_Users',
  },
  {
    component: CNavItem,
    name: 'Roles',
    to: '/roles-Roles',
    icon: <CIcon icon={cilUserFollow} customClassName="nav-icon" />,
    permission: 'Nav_Roles',
  },
  {
    component: CNavItem,
    name: 'Permissions',
    to: '/permissions-Permission',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permission: 'Nav_Permissions',
  },
  {
    component: CNavGroup,
    name: 'Calendar',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    permission: 'Nav_Calendar',
    items: [
      {
        component: CNavItem,
        name: 'Schedules',
        to: '/calendar-schedules',
        permission: 'Nav_Schedules',
      },
      {
        component: CNavItem,
        name: 'Time off Requests',
        to: '/calendar-timeoffrequests',
        permission: 'Nav_TimeOffRequests',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Reports',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    permission: 'Nav_Reports',
    items: [
      {
        component: CNavItem,
        name: 'Time & Activity',
        to: '/reports-timenactivity',
        permission: 'Nav_TimeNactivity',
      },
      {
        component: CNavItem,
        name: 'Accounts Owed',
        to: '/reports-accountsowed',
        permission: 'Nav_AccountsOwed',
      },
      {
        component: CNavItem,
        name: 'Payments',
        to: '/reports-payments',
        permission: 'Nav_Payments',
      },
      {
        component: CNavItem,
        name: 'All Reports',
        to: '/reports-allreports',
        permission: 'Nav_AllReports',
      },
      {
        component: CNavItem,
        name: 'Monthly Reports',
        to: '/reports-monthly',
        permission: 'Nav_MonthlyReports',
      },
      {
        component: CNavItem,
        name: 'Day-End Reports',
        to: '/report-dayend',
        permission: 'Nav_DayendReports',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Teams',
    to: '/teams',
    icon: <CIcon icon={cilStream} customClassName="nav-icon" />,
    permission: 'Nav_Teams',
  },
  {
    component: CNavItem,
    name: 'Subscriptions',
    to: '/subscriptions',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    permission: 'Nav_Subscriptions',
  },
  {
    component: CNavItem,
    name: 'Expenses',
    to: '/expenses',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
    permission: 'Nav_Expenses',
  },
  {
    component: CNavItem,
    name: 'FSF',
    to: '/fsf',
    icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
    permission: 'Nav_FSF',
  },
  {
    component: CNavItem,
    name: 'CRF',
    to: '/allcrf',
    icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
    permission: 'Nav_CRF',
  },
]

const filterNavItems = (items) => {
  return items
    .map((item) => {
      if (item.component === CNavGroup) {
        const filteredSubItems = filterNavItems(item.items)
        if (filteredSubItems.length > 0) {
          return { ...item, items: filteredSubItems }
        }
      } else if (permissionNames.includes(item.permission)) {
        return item
      }
      return null
    })
    .filter((item) => item !== null)
}

const filteredBaseNavItems = filterNavItems(_navAdmin)

export const navigationConfig = [...filteredBaseNavItems]