import React from 'react'
import { isAuthenticated, getUserRole } from './auth'

//Define routes for views
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Screenshots = React.lazy(() => import('./views/activity/screenshots/Screenshots'))
const Apps = React.lazy(() => import('./views/activity/apps/Apps'))
const Urls = React.lazy(() => import('./views/activity/urls/Urls'))
const Approvals = React.lazy(() => import('./views/timesheets/approvals/Approvals'))
const Viewedit = React.lazy(() => import('./views/timesheets/viewedit/Viewedit'))
const Projects = React.lazy(() => import('./views/projectmanagement/projects/Projects'))
const Client = React.lazy(() => import('./views/projectmanagement/client/Client'))
const Todos = React.lazy(() => import('./views/projectmanagement/todos/Todos'))
const AssignedProjects = React.lazy(() =>
  import('./views/projectmanagement/assigned/AssignedProjects'),
)
const Companies = React.lazy(() => import('./views/companies/Companies'))
const Departments = React.lazy(() => import('./views/departments/Departments'))
const Insights = React.lazy(() => import('./views/insights/Insights'))
const Map = React.lazy(() => import('./views/map/Map'))
const Users = React.lazy(() => import('./views/users/Users'))
const Roles = React.lazy(() => import('./views/roles/Roles'))
const Permissions = React.lazy(() => import('./views/permissions/Permission'))
const Schedules = React.lazy(() => import('./views/calendar/schedules/Schedules'))
const Timeoffrequests = React.lazy(() => import('./views/calendar/timeoffrequests/Timeoffrequests'))
const Accountsowed = React.lazy(() => import('./views/reports/accountsowed/Accountsowed'))
const Allreports = React.lazy(() => import('./views/reports/allreports/Allreports'))
const Payments = React.lazy(() => import('./views/reports/payments/Payments'))
const Timenactivity = React.lazy(() => import('./views/reports/timenactivity/Timenactivity'))
const Monthly = React.lazy(() => import('./views/reports/monthly/Monthly'))
const Weekly = React.lazy(() => import('./views/reports/weekly/Weekly'))
const Daily = React.lazy(() => import('./views/reports/daily/Daily'))
const Teams = React.lazy(() => import('./views/teams/Teams'))
const Subscriptions = React.lazy(() => import('./views/subscriptions/Subscriptions'))
const Expenses = React.lazy(() => import('./views/expenses/Expenses'))
const AllFSF = React.lazy(() => import('./views/fsf/AllFSF'))
const FSFform = React.lazy(() => import('./views/fsf/FSFform'))
const AllCRF = React.lazy(() => import('./views/crf/AllCRF'))
const TaskAssignment = React.lazy(() => import('./views/taskmanagement/TaskAssignment'))
const TaskAssignmentUserSide = React.lazy(() =>
  import('./views/taskmanagement/TaskAssignmentUserSide'),
)
const NotFound = React.lazy(() => import('./views/notFoundPage/NotFound'))

// Function to check if the user has access to a specific route based on their role
const hasAccess = (requiredRoles, userRole) => {
  return requiredRoles.includes(userRole)
}

//Path setting for routes
const routes = [
  { path: '/', exact: true, name: 'Home', requiredRoles: [1, 3, 5, 6, 7] },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, requiredRoles: [1, 3, 5, 6, 7] },
  {
    path: '/activity/screenshots',
    name: 'Screenshots',
    element: Screenshots,
    requiredRoles: [1, 3, 5, 6, 7],
  },
  { path: '/activity/apps', name: 'Apps', element: Apps, requiredRoles: [1] },
  { path: '/activity/urls', name: 'Urls', element: Urls, requiredRoles: [1] },
  {
    path: '/projectmanagement/client',
    name: 'Client',
    element: Client,
    requiredRoles: [1, 3],
  },
  {
    path: '/projectmanagement/projects',
    name: 'Projects',
    element: Projects,
    requiredRoles: [1, 3],
  },
  // {
  //   path: '/projectmanagement/todos',
  //   name: 'Todos',
  //   element: Todos,
  //   requiredRoles: [1, 3, 5, 6, 7],
  // },
  {
    path: '/projectmanagement/assigned',
    name: 'Assigned Projects',
    element: AssignedProjects,
    requiredRoles: [1, 3, 5, 6, 7],
  },
  {
    path: '/companies/Companies',
    name: 'Companies',
    element: Companies,
    requiredRoles: [1, 3, 5, 6, 7],
  },
  {
    path: '/departments/Departments',
    name: 'Departments',
    element: Departments,
    requiredRoles: [1, 3],
  },
  {
    path: '/timesheets/approvals',
    name: 'Approvals',
    element: Approvals,
    requiredRoles: [1],
  },
  {
    path: '/timesheets/viewedit',
    name: 'View & Edit',
    element: Viewedit,
    requiredRoles: [1],
  },
  // { path: '/insights', name: 'Insights', element: Insights, requiredRoles: [1, 3, 5, 6, 7] },
  // { path: '/map', name: 'Map', element: Map, requiredRoles: [1, 3, 5, 6, 7] },
  { path: '/users/Users', name: 'Users', element: Users, requiredRoles: [1, 3, 5, 6, 7] },
  { path: '/roles/Roles', name: 'Roles', element: Roles, requiredRoles: [1] },
  {
    path: '/permissions/Permission',
    name: 'Permissions',
    element: Permissions,
    requiredRoles: [1],
  },
  {
    path: '/calendar/schedules',
    name: 'Schedules',
    element: Schedules,
    requiredRoles: [1],
  },
  {
    path: '/calendar/timeoffrequests',
    name: 'Time-Off-Requests',
    element: Timeoffrequests,
    requiredRoles: [1],
  },
  {
    path: '/reports/accountsowed',
    name: 'Accounts Owed',
    element: Accountsowed,
    requiredRoles: [1],
  },
  {
    path: '/reports/allreports',
    name: 'All Reports',
    element: Allreports,
    requiredRoles: [1],
  },
  {
    path: '/reports/payments',
    name: 'Payments',
    element: Payments,
    requiredRoles: [1],
  },
  {
    path: '/reports/timenactivity',
    name: 'Time & Activity',
    element: Timenactivity,
    requiredRoles: [1, 3],
  },
  { path: '/reports/monthly', name: 'Weekly', element: Monthly, requiredRoles: [1, 3] },
  // { path: '/reports/weekly', name: 'Weekly', element: Weekly, requiredRoles: [1, 3, 5, 6, 7] },
  { path: '/teams', name: 'Teams', element: Teams, requiredRoles: [1, 3, 5, 6, 7] },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    element: Subscriptions,
    requiredRoles: [1, 3],
  },
  { path: '/expenses', name: 'Expenses', element: Expenses, requiredRoles: [1] },
  { path: '/allfsf', name: 'All FSF', element: AllFSF, requiredRoles: [1, 5, 6, 7] },
  { path: '/allcrf', name: 'All CRF', element: AllCRF, requiredRoles: [1] },
  { path: '/fsfform', name: 'FSF Form', element: FSFform, requiredRoles: [1, 3, 6] },
  {
    path: '/taskmanagement/createnewtask',
    name: 'Task Assignment',
    element: TaskAssignment,
    requiredRoles: [6, 7],
  },
  {
    path: '/taskmanagement/assignedtask',
    name: 'Task Assignment',
    element: TaskAssignmentUserSide,
    requiredRoles: [1, 3, 5],
  },
  { path: '*', name: '404 Page', element: NotFound, requiredRoles: [1, 3, 5, 6, 7] },
]

export const filteredRoutes = routes.filter((route) => {
  // If the route doesn't have any required roles specified, allow access to all authenticated users
  if (!route.requiredRoles || route.requiredRoles.length === 0) {
    return isAuthenticated()
  }

  // If the route has required roles, check if the user has access
  const userRole = getUserRole()
  return hasAccess(route.requiredRoles, userRole)
})
