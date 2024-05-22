import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react'
import { Button, Modal, Divider, Checkbox, Select, Form, } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import Alert from '@mui/material/Alert'
const BASE_URL = process.env.REACT_APP_BASE_URL

const Team = () => {
  //Variable Declarations
  const [team_name, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [department_id, setDepartmentId] = useState('');
  const [team_lead_id, setTeamLeadId] = useState('');
  const [teams, setTeams] = useState([])
  const [byteam, setTeamById] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [department, setDepartment] = useState([])
  const [byusers, setByUsers] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [user_id, setUserId] = useState('')
  const [hasusers, setHasUsers] = useState([])
  const [team_members, setAllTeamMembers] = useState([])
  const [user_role , setUserRole] = useState('')
  var filteredUsers = []

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const teamLeadId = local.Users.id;
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Team')
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_Team')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_Team')

  let [form] = Form.useForm()

  //CSS Styling
  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }

  const perStyle = {
    fontSize: 14,
  }

  const headStyle = {
    color: '#0070ff',
    fontWeight: 'bold',
  }

  const headStyle2 = {
    color: '#black',
    fontWeight: 'bold',
  }
  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  useEffect(() => {
    setUserId(local.Users.id)
    setUserRole(local.Users.role) 
  } , [])

  // Functions for Add Team Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    addTeam()
    setIsModalOpen(false)
    setTeamName('')
    setDescription('')
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setTeamName('')
    setDescription('')
  }

  // Functions for Delete Team Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    deleteTeam(isModalOpen2)
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Update Team Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getTeamById(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    updateTeam(isModalOpen3)
    setIsModalOpen3(false)
    setTeamName('')
    setDescription('')
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
    setTeamName('')
    setDescription('')
  }

  // Functions for Assign Users to Team
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    getHasUsers(id)
    setIsModalOpen4(id)
  }

  const handleOk4 = () => {
    assignUsersToTeam(isModalOpen4)
    setIsModalOpen4(false)
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
  }

  // Functions for Add Team Success
  const [showAlert1, setShowAlert1] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleCloseAlert1() {
    setShowAlert1(false)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  // Functions for Add Team Failure
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  function handleCloseAlert2() {
    setShowAlert2(false)
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert2])

  // Functions for Delete Team Success
  const [showAlert3, setShowAlert3] = useState(false)

  function handleButtonClick3() {
    setShowAlert3(true)
  }

  function handleCloseAlert3() {
    setShowAlert3(false)
  }

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert3])

  // Functions for Delete Team Failure
  const [showAlert4, setShowAlert4] = useState(false)

  function handleButtonClick4() {
    setShowAlert4(true)
  }

  function handleCloseAlert4() {
    setShowAlert4(false)
  }

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert4])

  // Functions for Update Team Success
  const [showAlert5, setShowAlert5] = useState(false)

  function handleButtonClick5() {
    setShowAlert5(true)
  }

  function handleCloseAlert5() {
    setShowAlert5(false)
  }

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert5])

  // Functions for Update Team Failure
  const [showAlert6, setShowAlert6] = useState(false)

  function handleButtonClick6() {
    setShowAlert6(true)
  }

  function handleCloseAlert6() {
    setShowAlert6(false)
  }

  useEffect(() => {
    if (showAlert6) {
      const timer = setTimeout(() => {
        setShowAlert6(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert6])

  // Functions for Assign Users Success
  const [showAlert7, setShowAlert7] = useState(false)

  function handleButtonClick7() {
    setShowAlert7(true)
  }

  function handleCloseAlert7() {
    setShowAlert7(false)
  }

  useEffect(() => {
    if (showAlert7) {
      const timer = setTimeout(() => {
        setShowAlert7(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert7])

  // Functions for Assign Users Failure
  const [showAlert8, setShowAlert8] = useState(false)

  function handleButtonClick8() {
    setShowAlert8(true)
  }

  function handleCloseAlert8() {
    setShowAlert8(false)
  }

  useEffect(() => {
    if (showAlert8) {
      const timer = setTimeout(() => {
        setShowAlert8(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert8])

  //Initial rendering through useEffect
  useEffect(() => {
    getTeams()
    getDepartment()
    getProjectManagers()
    getUsers()
    getTeamMembers()
  }, [])

  useEffect(() => {
    setSelectedUsers(hasusers)
  }, [hasusers])

  //Function for checkbox handling
  const handleSelectUser = (e, permId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, permId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== permId))
    }
  }

  const clearFilter = () => {
    form.resetFields()
    setSelectedUser('')
  }

  function getTeams() {
    fetch(`${BASE_URL}/api/get-teams`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Teams
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Teams.filter((tem) => tem.company_id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'ProjectManager_Data')) {
          filteredUsers = data.Teams.filter((tem) => tem.team_lead_id === local.Users.id)
        }
        setTeams(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getTeamById(id) {
    fetch(`${BASE_URL}/api/get-team/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamById(data.Team)
        setTeamName(data.Team[0].team_name)
        setDescription(data.Team[0].description)
        setDepartmentId(data.Team[0].department_id)
        setTeamLeadId(data.Team[0].team_lead_id)
      })
      .catch((error) => console.log(error))
  }

  function getDepartment() {
    fetch(`${BASE_URL}/api/getdepartment`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Departments
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Departments.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        }
        setDepartment(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getProjectManagers() {
    await fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && (user.role === 6 || user.role === 7))
        }
        setByUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getUsers() {
    fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Users
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && user.email !== local.Users.email)
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id)
        } else if (perm.some((item) => item.name === 'User_Data') && perm.some((item) => item.name === 'ProjectManager_Data')) {
          filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id)
        }
        setUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getTeamMembers() {
    let filteredUsers = []
    await fetch(`${BASE_URL}/api/get-user-by-team-lead-id/${teamLeadId}`)
      .then((response) => response.json())
      .then((data) => {
          filteredUsers = data.team
          console.log(data.team);
        setAllTeamMembers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }
  
  function getHasUsers(id) {
    fetch(`${BASE_URL}/api/get-user-by-team-id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const temp_array = data.users.map((element) => element.user_id)
        setHasUsers(temp_array)
      })
      .catch((error) => console.log(error))
  }
  // Add API call
  async function addTeam() {
    let addteam = { team_name, company_id: local.Users.company_id, description, department_id, team_lead_id }
    await fetch(`${BASE_URL}/api/add-team`, {
      method: 'POST',
      body: JSON.stringify(addteam),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick1()
          getTeams()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete API call
  async function deleteTeam(newid) {
    await fetch(`${BASE_URL}/api/delete-team/${newid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify({
      //   id: newid,
      // }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick3()
          getTeams()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update API call
  async function updateTeam(newid) {
    await fetch(`${BASE_URL}/api/update-team/${newid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team_name: team_name,
        description: description,
        company_id: local.Users.company_id,
        department_id: department_id,
        team_lead_id: team_lead_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick5()
          getTeams()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  //Assign Users to Team API call
  async function assignUsersToTeam(newid) {
    await fetch(`${BASE_URL}/api/team-has-users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        team_id: newid,
        user_ids: selectedUsers,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick7()
        } else {
          handleButtonClick8()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDepartmentChange = (value) => {
    setDepartmentId(value)
  }

  const handleTeamLeadChange = (value) => {
    setTeamLeadId(value)
  }

  const handleUserSelect = (value) => {
    setSelectedUser(value)
  }

  // const handleFocus = (e) => {
  //   const { name } = e.target

  //   setFormErrors((prevFormErrors) => ({
  //     ...prevFormErrors,
  //     [name]: '',
  //   }))
  // }


  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Teams</h3>
        </div>
        <div className="col-md 6">
          {/* Add Teams Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add Team
            </Button>
          ) : null}
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
      {perm.some((item) => item.name === 'Company_Data')
            ? 
        ( <CTableHead color="light">
          {/* Teams table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Team Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Assign Team
            </CTableHeaderCell>
            {isEditButtonEnabled || isDeleteButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Action
              </CTableHeaderCell>
            ) : null}
          </CTableRow>

          {/* Get API Users */}
          {teams.map((tem, index) => (
            <CTableRow key={tem.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {index + 1}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {tem.team_name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
              <IconButton aria-label="Assign Team" onClick={() => showModal4(tem.id)}>
                <AssignmentIndIcon htmlColor="#28B463" />
              </IconButton>
            </CTableHeaderCell>
            {isEditButtonEnabled || isDeleteButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {isEditButtonEnabled ? (
                  <IconButton aria-label="Update" onClick={() => showModal3(tem.id)}>
                    <EditIcon htmlColor="#28B463" />
                  </IconButton>
                ) : null
                }
                {isDeleteButtonEnabled ? (
                  <IconButton aria-label="Delete" onClick={() => showModal2(tem.id)}>
                    <DeleteIcon htmlColor="#FF0000" />
                  </IconButton>
                ) : null
                }
              </CTableHeaderCell>
            ) : null
            }
            </CTableRow>
          ))}
        </CTableHead> ) : 
        ( <CTableHead color="light">
        {/* Teams table heading */}
        <CTableRow>
          <CTableHeaderCell className="text-center" style={mystyle}>
            Sr/No
          </CTableHeaderCell>
          <CTableHeaderCell className="text-center" style={mystyle}>
            Member Name
          </CTableHeaderCell>
        </CTableRow>

        {/* Get API Users */}
        {team_members.map((tem, index) => (
          <CTableRow key={tem.id}>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              {index + 1}
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              {tem.name}
            </CTableHeaderCell>
          </CTableRow>
        ))}
      </CTableHead> )
      }
        <CTableBody>
          {/* Modal for Add Team */}
          <Modal
            title="Add a Team"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>

            <div className="form-outline mb-3">
              <label>Team Name</label>
              <input
                type="text"
                value={team_name}
                onChange={(e) => setTeamName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Team Name"
              />
            </div>

            <div className="form-outline mb-3">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Description"
              />
            </div>

            <div className="form-outline mt-3">
              <label>Department</label>
              <Form.Item
                name="departmentSelect"
                hasFeedback style={{ width: '100%' }}
              // validateStatus={formErrors.department_id ? 'error' : ''}
              // help={formErrors.department_id}
              >
                <Select
                  placeholder="Select Department"
                  onChange={handleDepartmentChange}
                  value={department_id}
                  showSearch
                  // onFocus={handleFocus}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {department.map((department) => (
                    <Select.Option value={department.id} key={department.id}>
                      {department.department_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-outline mt-3">
              <label>Team Lead</label>
              <Form.Item
                name="teamLeadSelect"
                hasFeedback style={{ width: '100%' }}
              // validateStatus={formErrors.project_manager ? 'error' : ''}
              // help={formErrors.project_manager}
              >
                <Select
                  placeholder="Select Team Lead"
                  onChange={handleTeamLeadChange}
                  value={team_lead_id}
                  showSearch
                  // onFocus={handleFocus}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {byusers.map((user) => (
                    <Select.Option value={user.id} key={user.id}>
                      {user.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Modal>

          {/* Modal for Update Team */}
          <Modal
            title="Update a Team"
            open={isModalOpen3}
            onOk={handleOk3}
            onCancel={handleCancel3}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br></br>
            {byteam.map((tem) => (
              <div key={tem.id}>
                <div className="form-outline mb-3">
                  <label>Team Name</label>
                  <input
                    type="text"
                    defaultValue={tem.team_name}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Team Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    defaultValue={tem.description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Description"
                  />
                </div>

                <div className="form-outline mt-3">
                  <label>Department Name</label>
                  <Form.Item
                  // validateStatus={formErrors.department_id ? 'error' : ''}
                  // help={formErrors.department_id}
                  >
                    <Select
                      name="departmentName"
                      placeholder="Select Department"
                      // onFocus={handleFocus}
                      onChange={handleDepartmentChange}
                      value={department_id}
                    >
                      {department.map((department) => (
                        <Select.Option value={department.id} key={department.id}>
                          {department.department_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mt-3">
                  <label>Team Lead</label>
                  <Form.Item
                  // validateStatus={formErrors.department_id ? 'error' : ''}
                  // help={formErrors.department_id}
                  >
                    <Select
                      name="teamLead"
                      placeholder="Select Team Lead"
                      // onFocus={handleFocus}
                      onChange={handleTeamLeadChange}
                      value={team_lead_id}
                    >
                      {byusers.map((user) => (
                        <Select.Option value={user.id} key={user.id}>
                          {user.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

              </div>
            ))}
          </Modal>

          {/* Modal for Assign User */}
          <Modal
            title=""
            open={isModalOpen4}
            onOk={handleOk4}
            onCancel={handleCancel4}
            okButtonProps={{ style: { background: 'blue' } }}
          >
            <h3 style={headStyle2}>Assign Users</h3>
            <br></br>
            <div className="col-md-3" style={{ width: '1500px' }}>
              <Form form={form} className="d-flex w-200">
                <div className="col-md-3">
                  <div className="d-flex align-items-center">
                    <Form.Item name="userSelect" hasFeedback style={{ width: '100%' }}>
                      <Select
                        showSearch
                        placeholder="Select User"
                        onChange={handleUserSelect}
                        value={user_id}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                      {
                          user_role === 6 || user_role === 7 ? 
                          team_members.map((user) => (
                            <Select.Option value={user.id} key={user.id}>
                              {user.name}
                            </Select.Option>
                          )) :
                          users.map((user) => (
                            <Select.Option value={user.id} key={user.id}>
                              {user.name}
                            </Select.Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <Button type="default" onClick={clearFilter} className="ml-2">
                      Clear Filter
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
            <br></br>
            <div className="row">
              <div className="col md-2 text-center">
                <h6>Sr/No</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6>Users</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={heading}>Select</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            {
              user_role === 6 || user_role === 7 ?
            team_members.filter((project) => {
              // Apply User filter
              if (selectedUser !== '') {
                return project.id === selectedUser
              }
              return true
            })
              .map((user, index) => (
                <div className="row" key={user.id}>
                  <div className="col md-2 text-center">
                    <h6 style={perStyle}>{index + 1}</h6>
                  </div>
                  <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <h6 style={perStyle}>{user.name}</h6>
                  </div>
                  <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleSelectUser(e, user.id)}
                    />
                  </div>
                  &nbsp;
                  <Divider></Divider>
                </div>
              )) : 
              users.filter((project) => {
                // Apply User filter
                if (selectedUser !== '') {
                  return project.id === selectedUser
                }
                return true
              })
                .map((user, index) => (
                  <div className="row" key={user.id}>
                    <div className="col md-2 text-center">
                      <h6 style={perStyle}>{index + 1}</h6>
                    </div>
                    <div className="col md-3"></div>
                    <div className="col md-2 text-center">
                      <h6 style={perStyle}>{user.name}</h6>
                    </div>
                    <div className="col md-3"></div>
                    <div className="col md-2 text-center">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleSelectUser(e, user.id)}
                      />
                    </div>
                    &nbsp;
                    <Divider></Divider>
                  </div>
                ))
            }
          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal
            title="Are you sure you want to delete?"
            open={isModalOpen2}
            onOk={handleOk2}
            onCancel={handleCancel2}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
          ></Modal>

          {/* Alert for Add Team Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Team Added Successfully
            </Alert>
          )}

          {/* Alert for Add Team Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Team
            </Alert>
          )}

          {/* Alert for Delete Team Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Team Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Team Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Team
            </Alert>
          )}

          {/* Alert for Update Team Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Team Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Team Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Team
            </Alert>
          )}

          {/* Alert for Permission User Assign Success*/}
          {showAlert7 && (
            <Alert onClose={handleCloseAlert7} severity="success" style={modalStyle2}>
              Users Assigned Successfully
            </Alert>
          )}

          {/* Alert for Permission User Assign Failure*/}
          {showAlert8 && (
            <Alert onClose={handleCloseAlert8} severity="error" style={modalStyle2}>
              Failed to Assign Users
            </Alert>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Team
