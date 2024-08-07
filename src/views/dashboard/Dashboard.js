import { React, useEffect, useState } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Card, Divider, Button, Modal, Form, Select } from 'antd'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
const BASE_URL = process.env.REACT_APP_BASE_URL
const Dashboard = () => {
  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))
  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const session_token = session.token
  useEffect(() => {
    getTotalTimeUser(session_token)
    setRoleId(local.Users.role)
    setUserId(local.Users.id)
    setCompanyId(local.Users.company_id)
  }, [])

  //CSS Stylings
  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
    padding: '15px',
    fontFamily: 'Arial',
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const cardStyle = {
    width: '100%',
  }

  const cardStyle2 = {
    width: '100%',
    backgroundColor: '#FFFFFF ',
  }

  const head = {
    color: '#6E6E6E',
    fontSize: 14,
    cursor: 'pointer'
  }

  const subhead = {
    color: '#28B463',
  }

  const userStyle = {
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0070FF ',
  }

  const timingStyle = {
    display: 'flex',
    flexDirection: 'row',
  }

  const modalStyle = {
   
  }


  //Declarations for API calls
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [all_employees, setAllEmployees] = useState('')
  const [online_employees, setOnlineEmployees] = useState([])
  const [offline_employees, setOfflineEmployees] = useState([])
  const [online_employee_count, setOnlineEmployeeCount] = useState('')
  const [offline_employee_count, setOfflineEmployeeCount] = useState('')
  const [departments, setDepartments] = useState([])
  const [clients, setClients] = useState([])
  const [screenshot, setScreenshot] = useState([])
  const [assigned, setAssigned] = useState([])
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [totalhours, setTotalHours] = useState('')
  const [totalminutes, setTotalMinutes] = useState('')
  const [totalseconds, setTotalSeconds] = useState('')
  const [totalUserProjects, setTotalUserProjects] = useState('')
  const [totalProjects, setTotalProjects] = useState('')
  const [totalweeklyhours, setTotalWeeklyHours] = useState('')
  const [totalweeklyminutes, setTotalWeeklyMinutes] = useState('')
  const [totalweeklyseconds, setTotalWeeklySeconds] = useState('')
  const [team_leads, setTeamLeads] = useState([])
  const [teams, setTeams] = useState([])
  const [team_leads_count, setTeamLeadsCount] = useState('')
  const [team_count, setTeamsCount] = useState('')
  const [company_id, setCompanyId] = useState('')
  const [role_id, setRoleId] = useState('')
  const [user_id, setUserId] = useState('')
  const [today_date , setTodayDate] = useState('')
  const [online_members , setOnlineMembers] = useState([])
  const [offline_members , setOfflineMembers] = useState([])
  const [onlineMembersCount , setOnlineMembersCount] = useState('')
  const [offlineMembersCount , setOfflineMembersCount] = useState('')
  const [selectedOnlineUser , setSelectedOnlineUser] = useState('')
  const [selectedOfflineUser , setSelectedOfflineUser] = useState('')
  const [selectedTeamLead , setSelectedTeamLead] = useState('')
  const [selectedTeam , setSelectedTeam] = useState('')
  var screenfilter = []
  var filteredUsers = []
  let [form] = Form.useForm()

  const navigate = useNavigate()

  //Initial rendering through useEffect
  useEffect(() => {
    getCompanies()
    getProjects()
    getDepartment()
    getClients()
    getTotalTime()
    getProjectScreenshots()
    getAssigns()
    getWeeklyWorked()
    getEmployees()
    getTeamLeadsCount()
    getTodayDate()
    getTeamMembers()
    getTeamsCount()
    getTeamLeads()
    getTeams()
  }, [company_id])

  function getTodayDate () {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const todayDate = `${year}-${month}-${day}`
    setTodayDate(todayDate)
  }

    // Functions for Team Lead Modal
    const [teamLeadsModal, setIsTeamLeadModalOpen] = useState(false)
    const showTeamLeadsModal = () => {
      setIsTeamLeadModalOpen(true)
    }
    const handleTeamLeadsOk = () => {
      setIsTeamLeadModalOpen(false)
    }
    const handleTeamLeadsCancel = () => {
      setIsTeamLeadModalOpen(false)
    }

    const handleTeamLeadSearch = (value) => {
      setSelectedTeamLead(value)
    }
  
    const clearTeamLeadFilter = () => {
      form.resetFields()
      setSelectedTeamLead('')
    }

     // Functions for Team Modal
     const [teamsModal, setIsTeamsModalOpen] = useState(false)
     const showTeamsModal = () => {
       setIsTeamsModalOpen(true)
     }
     const handleTeamsOk = () => {
      setIsTeamsModalOpen(false)
     }
     const handleTeamsCancel = () => {
      setIsTeamsModalOpen(false)
     }

     const handleTeamSearch = (value) => {
      setSelectedTeam(value)
    }
  
    const clearTeamFilter = () => {
      form.resetFields()
      setSelectedTeam('')
    }

     // Functions for Online Employees Modal
     const [OnlineEmployeeModal, setIsOnlineEmployeeModalOpen] = useState(false)
     const showOnlineEmployeeModal = () => { 
       getAllUsersReport()
       setIsOnlineEmployeeModalOpen(true)
     }
     const handleOnlineEmployeeOk = () => {
      setIsOnlineEmployeeModalOpen(false)
      clearOnlineFilter()
     }
     const handleOnlineEmployeeCancel = () => {
      setIsOnlineEmployeeModalOpen(false)
      clearOnlineFilter()
     }

     const handleOnlineUserSearch = (value) => {
      setSelectedOnlineUser(value)
    }
  
    const clearOnlineFilter = () => {
      form.resetFields()
      setSelectedOnlineUser('')
    }

     // Functions for Offline Employees Modal
     const [OfflineEmployeeModal, setIsOfflineEmployeeModalOpen] = useState(false)
     const showOfflineEmployeeModal = () => {
       getAllUsersReport()
       setIsOfflineEmployeeModalOpen(true)
     }
     const handleOfflineEmployeeOk = () => {
      setIsOfflineEmployeeModalOpen(false)
      clearOfflineFilter()
     }
     const handleOfflineEmployeeCancel = () => {
      setIsOfflineEmployeeModalOpen(false)
      clearOfflineFilter()
     }

     const handleOfflineUserSearch = (value) => {
      setSelectedOfflineUser(value)
    }

    const clearOfflineFilter = () => {
      form.resetFields()
      setSelectedOfflineUser('')
    }
  
     // Functions for Online Members Modal
     const [OnlineMembersModal, setIsOnlineMembersModalOpen] = useState(false)
     const showOnlineMembersModal = () => { 
       setIsOnlineMembersModalOpen(true)
     }
     const handleOnlineMembersOk = () => {
      setIsOnlineMembersModalOpen(false)
     }
     const handleOnlineMembersCancel = () => {
      setIsOnlineMembersModalOpen(false)
     }

     // Functions for Offline Members Modal
     const [OfflineMembersModal, setIsOfflineMembersModalOpen] = useState(false)
     const showOfflineMembersModal = () => { 
      setIsOfflineMembersModalOpen(true)
     }
     const handleOfflineMembersOk = () => {
      setIsOfflineMembersModalOpen(false)
     }
     const handleOfflineMembersCancel = () => {
      setIsOfflineMembersModalOpen(false)
     }

  //GET API calls
  async function getCompanies() {
    await fetch(`${BASE_URL}/api/getcompany`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.companies
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        }
        setUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getEmployees() {
    await fetch(`${BASE_URL}/api/get-users-by-company/${company_id}`)
      .then((response) => response.json())
      .then((data) => {
        // if (perm.some((item) => item.name === 'All_Data')) {
        //   filteredUsers = data.projects
        // } else if (perm.some((item) => item.name === 'Company_Data')) {
        //   filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        // }
        setAllEmployees(data.total_users)
        setOnlineEmployeeCount(data.online_users)
        setOfflineEmployeeCount(data.offline_users)
       
      })
      .catch((error) => console.log(error))
  }

  async function getTeamLeadsCount() {
    await fetch(`${BASE_URL}/api/get-team-leads-by-company/${company_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamLeadsCount(data.teamLeads)
        console.log(data.teamLeads);
      })
      .catch((error) => console.log(error))
  }

  async function getTeamLeads() {
    await fetch(`${BASE_URL}/api/get-team-leads-by-company-id/${company_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamLeads(data.team_leads)
        console.log(data.team_leads);
      })
      .catch((error) => console.log(error))
  }
  async function getTeamsCount() {
    await fetch(`${BASE_URL}/api/get-team-by-company-id/${company_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamsCount(data.teams)
      })
      .catch((error) => console.log(error))
  }
  async function getTeams() {
    let filtered_teams = []
    await fetch(`${BASE_URL}/api/get-teams`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filtered_teams = data.Teams
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filtered_teams = data.Teams.filter((team) => team.company_id === local.Users.company_id)
        }
        setTeams(filtered_teams)
      })
      .catch((error) => console.log(error))
  }
 
  async function getTeamMembers() {
    try {
        const response = await fetch(`${BASE_URL}/api/get-daily-report-of-both-offline-or-online/${user_id}/${today_date}`);

        const data = await response.json();

        setOnlineMembersCount(data.data.length)
        setOfflineMembersCount(data.offlineUsers.length)
        setOnlineMembers(data.data)
        setOfflineMembers(data.offlineUsers)
      } catch (error) {
        console.log(error);
    }
}

async function getAllUsersReport() {
  let filtered_online_users = []
  let filtered_offline_users = []
  await fetch(`${BASE_URL}/api/get-all-users-report-by-company-id/${company_id}/${today_date}`)
    .then((response) => response.json())
    .then((data) => {
        filtered_online_users = data.data.filter((user) => user.status === 'online')
        filtered_offline_users = data.data.filter((user) => user.status === 'offline')

        setOfflineEmployees(filtered_offline_users)
        setOnlineEmployees(filtered_online_users)
    })
    .catch((error) => console.log(error))
}

  async function getProjects() {
    await fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.projects
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
        setTotalProjects(filteredUsers.length)
      })
      .catch((error) => console.log(error))
  }

  async function getDepartment() {
    await fetch(`${BASE_URL}/api/getdepartment`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Departments
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Departments.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        }
        setDepartments(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getAssigns() {
    await fetch(`${BASE_URL}/api/get_assign_projects`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Project_Assigns
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Project_Assigns.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.Project_Assigns.filter(
            (user) => user.assign_projects_user_id === local.Users.user_id,
          )
        }
        setAssigned(filteredUsers)
        setTotalUserProjects(filteredUsers.length)
      })
      .catch((error) => console.log(error))
  }

  async function getClients() {
    await fetch(`${BASE_URL}/api/get_client`)
      .then((response) => response.json())
      .then((data) => setClients(data.Departments))
      .catch((error) => console.log(error))
  }

  async function getWeeklyWorked() {
    await fetch(`${BASE_URL}/api/calculateWeeklyWork`, {
      headers: {
        Authorization: `Bearer ${session_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalWeeklyHours(data.hours)
        setTotalWeeklyMinutes(data.minutes)
        setTotalWeeklySeconds(data.seconds)
      })
      .catch((error) => console.log(error))
  }

  async function getTotalTimeUser(token) {
    await fetch(`${BASE_URL}/api/getSum`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalHours(data.hours)
        setTotalMinutes(data.minutes)
        setTotalSeconds(data.seconds)
      })
      .catch((error) => console.log(error))
  }

  async function getTotalTime() {
    await fetch(`${BASE_URL}/api/get_Project_Screenshots`)
      .then((response) => response.json())
      .then((data) => {
        setHours(data.TotalHours)
        setMinutes(data.TotalMinutes)
        setSeconds(data.TotalSeconds)
      })
      .catch((error) => console.log(error))
  }

  async function getProjectScreenshots() {
    await fetch(`${BASE_URL}/api/get_Project_Screenshots`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          screenfilter = data.projectscreenshot
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          screenfilter = data.projectscreenshot.filter(
            (screenshot) => screenshot.company_id === local.Users.company_id,
          )
        } else if (perm.some((item) => item.name === 'User_Data')) {
          screenfilter = data.projectscreenshot.filter(
            (screenshot) => screenshot.user_id === local.Users.user_id,
          )
        }
        setScreenshot(screenfilter)
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          {local.Users.role === 3 ? (
            <h4 style={userStyle}>Dashboard</h4>
          ) : (
            <h4 style={userStyle}>{local.Users.name}</h4>
          )}
        </div>
      </div>

      {/* Statistics Data Modal Starts */}
      <Card style={cardStyle}>
        <div className="row">
          
          {
            role_id === 3 ? (
             <>
            <div className="col-md-2">
              <h6 style={head} onClick={()=> {navigate(`/projectmanagement-projects`)}}>TOTAL PROJECTS</h6>
              <h3 style={subhead}>{perm.some((item) => item.name === 'Company_Data' || perm.some((item) => item.name === 'All_Data')) ? totalProjects : totalUserProjects}</h3>
            </div>
            <div className="col-md-2">
              <h6 style={head} onClick={()=> {navigate(`/users-Users`)}}>EMPLOYEES</h6>
              <h3 style={subhead}>{all_employees}</h3>
            </div>
            <div className="col-md-2">
                <h6 style={head} onClick={showTeamLeadsModal}>TEAM LEADS</h6>
                <h3 style={subhead}>
                  {team_leads_count}
                </h3>
            </div>
            <div className="col-md-2">
              <h6 style={head} onClick={showOnlineEmployeeModal}>ONLINE EMPLOYEES</h6>
              <h3 style={subhead}>{online_employee_count}</h3>
            </div>
            <div className="col-md-2">
              <h6 style={head} onClick={showOfflineEmployeeModal}>OFFLINE EMPLOYEES</h6>
              <h3 style={subhead}>
                 {offline_employee_count}
              </h3>
            </div>
            <div className="col-md-2">
              <h6 style={head} onClick={showTeamsModal}>TEAMS</h6>
              <h3 style={subhead}>{team_count}</h3>
            </div>
             </> 
            ) : role_id === 6 || role_id === 7 ? (
              <>
                <div className="col-md-2">
                  <h6 style={head} onClick={()=> {navigate(`/projectmanagement-projects`)}}>ASSIGNED PROJECTS</h6>
                  <h3 style={subhead}>{perm.some((item) => item.name === 'Company_Data' || perm.some((item) => item.name === 'All_Data')) ? totalProjects : totalUserProjects}</h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>TODAY WORKED</h6>
                  <h3 style={subhead}>
                    {totalhours}:{totalminutes}:{totalseconds}
                  </h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>WORKED THIS WEEK</h6>
                  <h3 style={subhead}>
                    {totalweeklyhours}:{totalweeklyminutes}:{totalweeklyseconds}
                  </h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head} onClick={showOnlineMembersModal}>ONLINE TEAM MEMBERS</h6>
                  <h3 style={subhead}>{onlineMembersCount}</h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head} onClick={showOfflineMembersModal}>OFFLINE TEAM MEMBERS</h6>
                  <h3 style={subhead}>{offlineMembersCount}</h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>EARNED AMOUNT</h6>
                  <h3 style={subhead}>-</h3>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-2">
                  <h6 style={head} onClick={()=> {navigate(`/projectmanagement-assigned`)}}>ASSIGNED PROJECTS</h6>
                  <h3 style={subhead}>{perm.some((item) => item.name === 'Company_Data' || perm.some((item) => item.name === 'All_Data')) ? totalProjects : totalUserProjects}</h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>TODAY WORKED</h6>
                  <h3 style={subhead}>
                    {totalhours}:{totalminutes}:{totalseconds}
                  </h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>WORKED THIS WEEK</h6>
                  <h3 style={subhead}>
                    {totalweeklyhours}:{totalweeklyminutes}:{totalweeklyseconds}
                  </h3>
                </div>
                {/* <div className="col-md-2">
                  <h6 style={head}>TEAM</h6>
                  <h3 style={subhead}>TEAM NAME</h3>
                </div> */}
                <div className="col-md-2">
                  <h6 style={head}>EARNED AMOUNT</h6>
                  <h3 style={subhead}>-</h3>
                </div>
              </>
            )
          }
        </div>
      </Card>
      {/* Statistics Data Modal Ends */}

      <br></br>

      <div className="row">
        <div className="col-md-6">

          {/* Card for Companies Modal Starts */}
          <Card style={cardStyle2}>
            <h5 style={head}>COMPANIES</h5>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Company Name
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Company Email
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    City
                  </CTableHeaderCell>
                </CTableRow>

                {users.slice(0, 3).map((company) => (
                  <CTableRow key={company.id}>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {company.company_name}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {company.company_email}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {company.city}
                    </CTableHeaderCell>
                  </CTableRow>
                ))}
              </CTableHead>

              <CTableBody></CTableBody>
            </CTable>

            <Divider></Divider>
            <div className="text-center">
              <Button type="link" href="/companies-Companies">
                View companies &gt;
              </Button>
            </div>
          </Card>
          {/* Card for Companies Modal Ends */}

          <br></br>

          {/* Card for Departments Modal Starts  */}
          {perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data') ? (
            <Card style={cardStyle2}>
              <h5 style={head}>DEPARTMENTS</h5>
              <CTable
                align="middle"
                className="mb-0 border"
                hover
                responsive
                style={{ marginTop: '20px' }}
              >
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center" style={mystyle}>
                      Department Name
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle}>
                      Company
                    </CTableHeaderCell>
                  </CTableRow>

                  {departments.slice(0, 3).map((dept) => (
                    <CTableRow key={dept.id}>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {dept.department_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {dept.company_name}
                      </CTableHeaderCell>
                    </CTableRow>
                  ))}
                </CTableHead>

                <CTableBody></CTableBody>
              </CTable>

              <Divider></Divider>
              <div className="text-center">
                <Button type="link" href="/departments-Departments">
                  View departments &gt;
                </Button>
              </div>
            </Card>
          ) : null}

          {/* Card for Departments Modal Ends */}
        </div>

        <div className="col-md-6">
          {/* Card for Projects Modal Starts */}
          {perm.some((item) => item.name === 'All_Data') ||
            (perm.some((item) => item.name === 'Company_Data') && (
              <Card style={cardStyle2}>
                <h5 style={head}>PROJECTS</h5>
                <CTable
                  align="middle"
                  className="mb-0 border"
                  hover
                  responsive
                  style={{ marginTop: '20px' }}
                >
                  <CTableHead color="light">
                    <CTableRow>
                      <CTableHeaderCell className="text-center" style={mystyle}>
                        Project
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle}>
                        Start Date
                      </CTableHeaderCell>
                    </CTableRow>

                    {projects.slice(0, 4).map((proj) => {
                      const start = moment(proj.start_date).format('DD-MM-YYYY')

                      return (
                        <CTableRow key={proj.id}>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {proj.project_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {start}
                          </CTableHeaderCell>
                        </CTableRow>
                      )
                    })}
                  </CTableHead>

                  <CTableBody></CTableBody>
                </CTable>

                <Divider></Divider>
                <div className="text-center">
                  <Button type="link" href="/projectmanagement-projects">
                    View projects &gt;
                  </Button>
                </div>
              </Card>
            ))}
          {/* Card for Projects Modal Ends */}

          {/* Card for Assigned Project Modal Starts */}

          <Card style={cardStyle2}>
            <h5 style={head}>ASSIGNED PROJECTS</h5>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project Name
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Stream Name
                  </CTableHeaderCell>
                </CTableRow>

                {assigned.slice(0, 4).map((assign) => {
                  return (
                    <CTableRow key={assign.id}>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {assign.project_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {assign.stream_name}
                      </CTableHeaderCell>
                    </CTableRow>
                  )
                })}
              </CTableHead>

              <CTableBody></CTableBody>
            </CTable>

            <Divider></Divider>
            <div className="text-center">
              <Button type="link" href="/projectmanagement-assigned">
                View assigned projects &gt;
              </Button>
            </div>
          </Card>
          {/* Card for Assigned Project Modal Ends */}
          {/* Modal for Team Leads*/}
          <Modal
            title="Team Leads"
            open={teamLeadsModal}
            onOk={handleTeamLeadsOk}
            onCancel={handleTeamLeadsCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            <div className='container my-2'>
            <div className='d-flex'>
                <Form form={form} style={{ width: '100%' }}>
                    <Form.Item name="selectTeamLead" hasFeedback>
                      <Select
                        placeholder="Enter Team Lead"
                        onChange={handleTeamLeadSearch}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                      >
                        {team_leads.map((user) => (
                          <Select.Option value={user.id} key={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                  <Button type="default" onClick={clearTeamLeadFilter} className="ml-2">
                  Clear Filter
                </Button>
              </div>
              <div className='row border'>
                <div className='col-4 text-center border'>Name</div>
                <div className='col-8 text-center border'>Email</div>
              </div>
            </div>
            {
              team_leads.filter((team) => {
                // Apply Stream filter
                if (selectedTeamLead !== '') {
                  return team.id === selectedTeamLead
                }
                return true
              })
              .map((teamLead , index) => (
                <div key={index}>
                  <div className='container'>
                    <div className='row mb-1'>
                      <div className='col-4 text-start border'>{teamLead.name}</div>
                      <div className='col-8 text-start border'>{teamLead.email}</div>
                    </div>
                  </div>
                </div>
              ))
            }

          </Modal>

           {/* Modal for Teams*/}
           <Modal
            title="Teams"
            open={teamsModal}
            onOk={handleTeamsOk}
            onCancel={handleTeamsCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            <div className='container '>
            <div className='d-flex'>
                <Form form={form} style={{ width: '100%' }}>
                    <Form.Item name="selectTeam" hasFeedback>
                      <Select
                        placeholder="Enter Team"
                        onChange={handleTeamSearch}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                      >
                        {teams.map((user) => (
                          <Select.Option value={user.id} key={user.id}>
                            {user.team_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                  <Button type="default" onClick={clearTeamFilter} className="ml-2">
                  Clear Filter
                </Button>
              </div>
              <div className='row border my-2'>
                <div className='col-6 text-center border'>Name</div>
                <div className='col-6 text-center border'>Team Lead</div>
              </div>
            {
              teams.filter((team) => {
                // Apply Stream filter
                if (selectedTeam !== '') {
                  return team.id === selectedTeam
                }
                return true
              })
              .map((team , index) => (
                <div key={index}>
                    <div className='row mb-1 border'>
                      <div className='col-6 '>{team.team_name}</div>
                      {
                        team_leads.map((lead , lead_index) => (
                          <div key={lead_index} className='col-6'>
                            {
                              lead.id === team.team_lead_id ? 
                              <>
                                <div>{lead.name}</div>
                              </> : null
                            }
                          </div>
                        ))
                      }
                    </div>
                  </div>
              ))
            }
          </div>
          </Modal>

          {/* Modal for online Employees*/}
          <Modal
            title="Online Employees"
            open={OnlineEmployeeModal}
            onOk={handleOnlineEmployeeOk}
            onCancel={handleOnlineEmployeeCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            <div className='container my-2'>
              <div className='d-flex'>
                <Form form={form} style={{ width: '100%' }}>
                    <Form.Item name="selectUser" hasFeedback>
                      <Select
                        placeholder="Enter Employee Name"
                        onChange={handleOnlineUserSearch}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                      >
                        {online_employees.map((user) => (
                          <Select.Option value={user.id} key={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                  <Button type="default" onClick={clearOnlineFilter} className="ml-2">
                  Clear Filter
                </Button>
              </div>
              <div className='row border'>
                <div className='col-4 text-center border'>Name</div>
                <div className='col-8 text-center border'>Email</div>
              </div>
            </div>
            {
              
              online_employees.filter((user) => {
                // Apply Stream filter
                if (selectedOnlineUser !== '') {
                  return user.id === selectedOnlineUser
                }
                return true
              })
              .map((user , index) => (
                <div key={index}>
                  <div className='container'>
                    <div className='row mb-1'>
                      <div className='col-4 text-start border'>{user.name}</div>
                      <div className='col-8 text-start border'>{user.email}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </Modal>

          {/* Modal for offline Employees*/}
          <Modal
            title="Offline Employees"
            open={OfflineEmployeeModal}
            onOk={handleOfflineEmployeeOk}
            onCancel={handleOfflineEmployeeCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            <div className='container my-2'>
            <div className='d-flex'>
                <Form form={form} style={{ width: '100%' }}>
                    <Form.Item name="selectOfflineUser" hasFeedback>
                      <Select
                        placeholder="Enter Employee Name"
                        onChange={handleOfflineUserSearch}
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: '100%' }}
                      >
                        {offline_employees.map((user) => (
                          <Select.Option value={user.id} key={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                  <Button type="default" onClick={clearOfflineFilter} className="ml-2">
                  Clear Filter
                </Button>
              </div>
              <div className='row border'>
                <div className='col-4 text-center border'>Name</div>
                <div className='col-8 text-center border'>Email</div>
              </div>
            </div>
            {
               offline_employees.filter((user) => {
                // Apply Stream filter
                if (selectedOfflineUser !== '') {
                  return user.id === selectedOfflineUser
                }
                return true
              })
              .map((user , index) => (
                <div key={index}>
                  <div className='container'>
                    <div className='row mb-1'>
                      <div className='col-4 text-start border'>{user.name}</div>
                      <div className='col-8 text-start border'>{user.email}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </Modal>

          {/* Modal for online Members*/}
          <Modal
            title="Online Team Members"
            open={OnlineMembersModal}
            onOk={handleOnlineMembersOk}
            onCancel={handleOnlineMembersCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            <div className='container my-2'>
              <div className='row border'>
                <div className='col-4 text-center border'>Name</div>
                <div className='col-8 text-center border'>Email</div>
              </div>
            </div>
            {
              online_members.map((user , index) => (
                <div key={index}>
                  <div className='container'>
                    <div className='row mb-1'>
                      <div className='col-4 text-start border'>{user.name}</div>
                      <div className='col-8 text-start border'>{user.email}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </Modal>

          {/* Modal for offline Members*/}
          <Modal
            title="Offline Team Members"
            open={OfflineMembersModal}
            onOk={handleOfflineMembersOk}
            onCancel={handleOfflineMembersCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            <div className='container my-2'>
              <div className='row border'>
                <div className='col-4 text-center border'>Name</div>
                <div className='col-8 text-center border'>Email</div>
              </div>
            </div>
            {
              offline_members.map((user , index) => (
                <div key={index}>
                  <div className='container'>
                    <div className='row mb-1'>
                      <div className='col-4 text-start border'>{user.name}</div>
                      <div className='col-8 text-start border'>{user.email}</div>
                    </div>
                  </div>
                </div>
              ))
            }
          </Modal>
          <br></br>
        </div>
      </div>
    </>
  )
}

export default Dashboard
