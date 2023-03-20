import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//Activity
const Screenshots = React.lazy(() => import('./views/activity/screenshots/Screenshots'))
const Apps = React.lazy(() => import('./views/activity/apps/Apps'))
const Urls = React.lazy(() => import('./views/activity/urls/Urls'))

//Timesheets
const Approvals = React.lazy(() => import('./views/timesheets/approvals/Approvals'))
const Viewedit = React.lazy(() => import('./views/timesheets/viewedit/Viewedit'))

//ProjectManagement
const Projects = React.lazy(() => import('./views/projectmanagement/projects/Projects'))
const Client = React.lazy(() => import('./views/projectmanagement/client/Client'))
const Todos = React.lazy(() => import('./views/projectmanagement/todos/Todos'))

//Companies
const Companies = React.lazy(() => import('./views/companies/Companies'))

//Departments
const Departments = React.lazy(() => import('./views/departments/Departments'))

//Insights
const Insights = React.lazy(() => import('./views/insights/Insights'))

//Map
const Map = React.lazy(() => import('./views/map/Map'))

//Users
const Users = React.lazy(() => import('./views/users/Users'))

//Roles
const Roles = React.lazy(() => import('./views/roles/Roles'))

//Calendar
const Schedules = React.lazy(() => import('./views/calendar/schedules/Schedules'))
const Timeoffrequests = React.lazy(() => import('./views/calendar/timeoffrequests/Timeoffrequests'))

//Reports
const Accountsowed = React.lazy(() => import('./views/reports/accountsowed/Accountsowed'))
const Allreports = React.lazy(() => import('./views/reports/allreports/Allreports'))
const Payments = React.lazy(() => import('./views/reports/payments/Payments'))
const Timenactivity = React.lazy(() => import('./views/reports/timenactivity/Timenactivity'))
const Weekly = React.lazy(() => import('./views/reports/weekly/Weekly'))

//Teams
const Teams = React.lazy(() => import('./views/teams/Teams'))

//Expenses
const Expenses = React.lazy(() => import('./views/expenses/Expenses'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/activity/screenshots', name: 'Screenshots', element: Screenshots },
  { path: '/activity/apps', name: 'Apps', element: Apps },
  { path: '/activity/urls', name: 'Urls', element: Urls },
  { path: '/projectmanagement/client', name: 'Client', element: Client },
  { path: '/projectmanagement/projects', name: 'Projects', element: Projects},
  { path: '/projectmanagement/todos', name: 'Todos', element: Todos},
  { path: '/companies/Companies', name: 'Companies', element: Companies},
  { path: '/departments/Departments', name: 'Departments', element: Departments},
  { path: '/timesheets/approvals', name: 'Approvals', element: Approvals},
  { path: '/timesheets/viewedit', name: 'View & Edit', element: Viewedit},
  { path: '/insights', name: 'Insights', element: Insights},
  { path: '/map', name: 'Map', element: Map},
  { path: '/users/Users', name: 'Users', element: Users},
  { path: '/roles/Roles', name: 'Roles', element: Roles},
  { path: '/calendar/schedules', name: 'Schedules', element: Schedules},
  { path: '/calendar/timeoffrequests', name: 'Time-Off-Requests', element: Timeoffrequests},
  { path: '/reports/accountsowed', name: 'Accounts Owed', element: Accountsowed },
  { path: '/reports/allreports', name: 'All Reports', element: Allreports },
  { path: '/reports/payments', name: 'Payments', element: Payments },
  { path: '/reports/timenactivity', name: 'Time & Activity', element: Timenactivity },
  { path: '/reports/weekly', name: 'Weekly', element:Weekly },
  { path: '/teams', name: 'Teams', element: Teams},
  { path: '/expenses', name: 'Expenses', element: Expenses},
]

export default routes
