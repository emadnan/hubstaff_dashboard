import { React, useEffect, useState } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Card, Divider, Button, Modal } from 'antd'
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
    position: 'fixed',
    top: '25%',
    left: '40%',
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
  const [online_members , setOnlineMembers] = useState('')
  const [offline_members , setOfflineMembers] = useState('')
  var screenfilter = []
  var filteredUsers = []

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

     // Functions for Online Employees Modal
     const [OnlineEmployeeModal, setIsOnlineEmployeeModalOpen] = useState(false)
     const showOnlineEmployeeModal = () => {
       setIsOnlineEmployeeModalOpen(true)
     }
     const handleOnlineEmployeeOk = () => {
      setIsOnlineEmployeeModalOpen(false)
     }
     const handleOnlineEmployeeCancel = () => {
      setIsOnlineEmployeeModalOpen(false)
     }

     // Functions for Offline Employees Modal
     const [OfflineEmployeeModal, setIsOfflineEmployeeModalOpen] = useState(false)
     const showOfflineEmployeeModal = () => {
       setIsOfflineEmployeeModalOpen(true)
     }
     const handleOfflineEmployeeOk = () => {
      setIsOfflineEmployeeModalOpen(false)
     }
     const handleOfflineEmployeeCancel = () => {
      setIsOfflineEmployeeModalOpen(false)
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

        setOnlineMembers(data.data.length)
        setOfflineMembers(data.offlineUsers.length)

        // if (data.data.length === 0) {

        // } else {
        //     setExportDisable(false)
        //     setNotFoundMessage(false);
        //     console.log('Data', data)
        //     setReport(data);
        //     console.log('Report', report);
        // }
    } catch (error) {
        console.log(error);
    }
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
              <h6 style={head}>ONLINE EMPLOYEES</h6>
              <h3 style={subhead}>{online_employee_count}</h3>
            </div>
            <div className="col-md-2">
              <h6 style={head}>OFFLINE EMPLOYEES</h6>
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
                  <h6 style={head}>ASSIGNED PROJECTS</h6>
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
                  <h6 style={head}>ONLINE TEAM MEMBERS</h6>
                  <h3 style={subhead}>{online_members}</h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>OFFLINE TEAM MEMBERS</h6>
                  <h3 style={subhead}>{offline_members}</h3>
                </div>
                <div className="col-md-2">
                  <h6 style={head}>EARNED AMOUNT</h6>
                  <h3 style={subhead}>-</h3>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-2">
                  <h6 style={head}>ASSIGNED PROJECTS</h6>
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
              <div className='row border'>
                <div className='col-4 text-center border'>Name</div>
                <div className='col-8 text-center border'>Email</div>
              </div>
            </div>
            {
              team_leads.map((teamLead , index) => (
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
              <div className='row border my-2'>
                <div className='col-6 text-center border'>Name</div>
                <div className='col-6 text-center border'>Team Lead</div>
              </div>
            {
              teams.map((team , index) => (
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
          <br></br>
        </div>
      </div>
    </>
  )
}

export default Dashboard
