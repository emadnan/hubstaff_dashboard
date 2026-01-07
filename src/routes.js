import React from 'react'
import { isAuthenticated, getUserNavPermision } from './auth'

//Define routes for views
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Screenshots = React.lazy(() => import('./views/activity/screenshots/Screenshots'))
const TeamScreenshots = React.lazy(() => import('./views/activity/screenshots/TeamScreenshots'))
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
const CustomReports = React.lazy(() => import('./views/reports/customReports/CustomReports'))
const Payments = React.lazy(() => import('./views/reports/payments/Payments'))
const Timenactivity = React.lazy(() => import('./views/reports/timenactivity/Timenactivity'))
const Monthly = React.lazy(() => import('./views/reports/monthly/Monthly'))
const Weekly = React.lazy(() => import('./views/reports/weekly/Weekly'))
const Daily = React.lazy(() => import('./views/reports/daily/Daily'))
const Team_Reports = React.lazy(() => import('./views/reports/team/TeamReports'))
const Team_Report_For_Company = React.lazy(() => import('./views/reports/team/TeamReportForCompany'))
const Dayend = React.lazy(() => import('./views/reports/dayend/Dayend'))
const Teams = React.lazy(() => import('./views/teams/Teams'))
const Subscriptions = React.lazy(() => import('./views/subscriptions/Subscriptions'))
const SubscribedPlan = React.lazy(() => import('./views/subscriptions/SubscribedPlan'))
const Streams = React.lazy(() => import('./views/streams/Streams'))
const Expenses = React.lazy(() => import('./views/expenses/Expenses'))
const AllFSF = React.lazy(() => import('./views/fsf/AllFSF'))
const FSFform = React.lazy(() => import('./views/fsf/FSFform'))
const AllCRF = React.lazy(() => import('./views/crf/AllCRF'))
const CRFform = React.lazy(() => import('./views/crf/CRFform'))
const TaskAssignment = React.lazy(() => import('./views/taskmanagement/TaskAssignment'))
const LinkagePlanForm = React.lazy(() => import('./external-linkages/LinkagePlanForm'))
const LinkageCalendar = React.lazy(() => import('./external-linkages/LinkageCalendar'))
const LinkageFormsManagement = React.lazy(() => import('./external-linkages/LinkageFormsManagement'))
const WorkflowManagement = React.lazy(() => import('./external-linkages/WorkflowManagement'))
const LinkageApprovals = React.lazy(() => import('./external-linkages/LinkageApprovals'))
const FormList = React.lazy(() => import('./views/form-builder/FormList'))
const FormEditor = React.lazy(() => import('./views/form-builder/FormEditor'))
const TaskAssignmentUserSide = React.lazy(() =>
  import('./views/taskmanagement/TaskAssignmentUserSide'),
)
const NotFound = React.lazy(() => import('./views/notFoundPage/NotFound'))

// Function to check if the user has access to a specific route based on their role
const hasAccess = (requiredNavPermision, userNavPermision) => {
  return requiredNavPermision.includes(userNavPermision)
}

//Path setting for routes
const routes = [
  { path: '/', exact: true, name: 'Home', requiredRoles: [1, 3, 5, 6, 7] },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
    requiredNavPermision: 'Nav_Dashboard',
  },
  {
    path: '/activity-screenshots',
    name: 'Screenshots',
    element: Screenshots,
    requiredNavPermision: 'Nav_Screenshots',
  },
  {
    path: '/activity-team-screenshots',
    name: 'Team Screenshots',
    element: TeamScreenshots,
    requiredNavPermision: 'Nav_TeamScreenshots',
  },
  { path: '/activity-apps', name: 'Apps', element: Apps, requiredNavPermision: 'Nav_Apps', },
  { path: '/activity-urls', name: 'Urls', element: Urls, requiredNavPermision: 'Nav_URLs', },
  {
    path: '/projectmanagement-client',
    name: 'Client',
    element: Client,
    requiredNavPermision: 'Nav_Clients',
  },
  {
    path: '/projectmanagement-projects',
    name: 'Projects',
    element: Projects,
    requiredNavPermision: 'Nav_Projects',
  },
  {
    path: '/projectmanagement-assigned',
    name: 'Assigned Projects',
    element: AssignedProjects,
    requiredNavPermision: 'Nav_AssignedProjects',
  },
  {
    path: '/companies-Companies',
    name: 'Companies',
    element: Companies,
    requiredNavPermision: 'Nav_Companies',
  },
  {
    path: '/departments-Departments',
    name: 'Departments',
    element: Departments,
    requiredNavPermision: 'Nav_Departments',
  },
  {
    path: '/timesheets-approvals',
    name: 'Approvals',
    element: Approvals,
    requiredNavPermision: 'Nav_Approvals',
  },
  {
    path: '/timesheets-viewedit',
    name: 'View & Edit',
    element: Viewedit,
    requiredNavPermision: 'Nav_ViewNedits',
  },
  { path: '/users-Users', name: 'Users', element: Users, requiredNavPermision: 'Nav_Users', },
  { path: '/roles-Roles', name: 'Roles', element: Roles, requiredNavPermision: 'Nav_Roles', },
  {
    path: '/permissions-Permission',
    name: 'Permissions',
    element: Permissions,
    requiredNavPermision: 'Nav_Permissions',
  },
  {
    path: '/calendar-schedules',
    name: 'Schedules',
    element: Schedules,
    requiredNavPermision: 'Nav_Schedules',
  },
  {
    path: '/calendar-timeoffrequests',
    name: 'Time-Off-Requests',
    element: Timeoffrequests,
    requiredNavPermision: 'Nav_TimeOffRequests',
  },
  {
    path: '/reports-accountsowed',
    name: 'Accounts Owed',
    element: Accountsowed,
    requiredNavPermision: 'Nav_AccountsOwed',
  },
  {
    path: '/reports-allreports',
    name: 'All Reports',
    element: Allreports,
    requiredNavPermision: 'Nav_AllReports',
  },
  {
    path: '/reports-customReports',
    name: 'Custom Reports',
    element: CustomReports,
    requiredNavPermision: 'Nav_CustomReports',
  },
  {
    path: '/reports-payments',
    name: 'Payments',
    element: Payments,
    requiredNavPermision: 'Nav_Payments',
  },
  {
    path: '/reports-timenactivity',
    name: 'Time & Activity',
    element: Timenactivity,
    requiredNavPermision: 'Nav_TimeNactivity',
  },
  { path: '/reports-monthly', name: 'Monthly', element: Monthly, requiredNavPermision: 'Nav_MonthlyReports', },
  { path: '/team-report', name: 'TeamReports', element: Team_Reports, requiredNavPermision: 'Nav_TeamReports', },
  { path: '/team-report-for-company', name: 'TeamReportForCompany', element: Team_Report_For_Company, requiredNavPermision: 'Nav_MonthlyReports', },
  { path: '/report-dayend', name: 'Dayend', element: Dayend, requiredNavPermision: 'Nav_DayendReports', },
  { path: '/teams', name: 'Teams', element: Teams, requiredNavPermision: 'Nav_Teams', },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    element: Subscriptions,
    requiredNavPermision: 'Nav_Subscriptions',
  },
  {
    path: '/subscribed-Plan',
    name: 'Subscribed Plan',
    element: SubscribedPlan,
    requiredNavPermision: 'Nav_SubscribedPlan',
  },
  {
    path: '/streams',
    name: 'Streams',
    element: Streams,
    requiredNavPermision: 'Nav_Streams',
  },
  { path: '/expenses', name: 'Expenses', element: Expenses, requiredNavPermision: 'Nav_Expenses', },
  { path: '/fsf', name: 'All FSF', element: AllFSF, requiredNavPermision: 'Nav_FSF', },
  { path: '/allcrf', name: 'All CRF', element: AllCRF, requiredNavPermision: 'Nav_CRF', },
  { path: '/fsfform', name: 'FSF Form', element: FSFform, requiredNavPermision: 'Nav_FSFform', },
  { path: '/crfform', name: 'CRF Form', element: CRFform, requiredNavPermision: 'Nav_CRFform', },
  {
    path: '/taskmanagement-createnewtask',
    name: 'Task Assignment',
    element: TaskAssignment,
    requiredNavPermision: 'Nav_CreateNewTask',
  },
  {
    path: '/taskmanagement-assignedtask',
    name: 'Task Assignment',
    element: TaskAssignmentUserSide,
    requiredNavPermision: 'Nav_AssignedTask',
  },
  {
    path: '/external-linkages/plan-form',
    name: 'Semester Plan Form',
    element: LinkagePlanForm,
    requiredNavPermision: 'Nav_LinkagePlanForm'
  },
  {
    path: '/external-linkages/manage-forms',
    name: 'Manage Linkage Forms',
    element: LinkageFormsManagement,
    requiredNavPermision: 'Nav_ManageForms'
  },
  {
    path: '/external-linkages/calendar',
    name: 'Linkage Calendar',
    element: LinkageCalendar,
    requiredNavPermision: 'Nav_ExternalLinkages'
  },
  {
    path: '/external-linkages/workflow',
    name: 'Linkage Workflow Management',
    element: WorkflowManagement,
    requiredNavPermision: 'Nav_Roles'
  },
  {
    path: '/external-linkages/approvals',
    name: 'Pending Approvals',
    element: LinkageApprovals,
    requiredNavPermision: 'Nav_LinkageApprovals'
  },
  {
    path: '/form-builder',
    name: 'Form Builder',
    element: FormList,
    requiredNavPermision: 'Nav_FSF',
  },
  {
    path: '/form-builder/edit/:id',
    name: 'Edit Form',
    element: FormEditor,
    requiredNavPermision: 'Nav_FSF',
  },
  {
    path: '/form-builder/create',
    name: 'Create Form',
    element: FormEditor,
    requiredNavPermision: 'Nav_FSF',
  },
  { path: '/404', name: '404 Page', element: NotFound, requiredNavPermision: 'Nav_NotFound', },
]

export const filteredRoutes = routes.filter((route) => {
  if (!route.requiredNavPermision || route.requiredNavPermision.length === 0) {
    return isAuthenticated()
  }

  const permissionNames = getUserNavPermision()
  return hasAccess(permissionNames, route.requiredNavPermision)
})