import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react'
import { Modal, Button, Select, Form, Divider, Checkbox } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import moment from 'moment'
const BASE_URL = process.env.REACT_APP_BASE_URL
const Projects = () => {
  // Variable declarations
  const [department_id, setDepartmentId] = useState('')
  const [company_id, setCompanyId] = useState('')
  const [project_name, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [project_manager, setProjectManager] = useState('')
  const [start_date, setStartDate] = useState('')
  const [dead_line, setDeadLine] = useState('')
  const [stream_id, setStreamId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [proj_id, setProjId] = useState('')

  // Filter Projects
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [selectedProjectManager, setSelectedProjectManager] = useState('')

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Project')
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_Project')
  const isViewButtonEnabled = perm.some((item) => item.name === 'View_Project')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_Project')
  const isAssignProjectEnabled = perm.some((item) => item.name === 'Assign_Project')

  // Separate initial state values for formErrors
  const [formErrors, setFormErrors] = useState({
    company_id: '',
    department_id: '',
    project_name: '',
    description: '',
    project_manager: '',
    start_date: '',
    dead_line: '',
  })

  let [form] = Form.useForm()

  // CSS Styling
  const modalStyle = {
    position: 'fixed',
    top: '15%',
    left: '40%',
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

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

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
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  // Functions for Add Project Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    if (company_id && department_id && project_name && description && project_manager && start_date && dead_line) {
      addProject()
      setIsModalOpen(false)
      form.resetFields()
      setDepartmentId('')
      setCompanyId('')
      setProjectName('')
      setDescription('')
      setProjectManager('')
      setStartDate('')
      setDeadLine('')
      setFormErrors({
        company_id: '',
        department_id: '',
        project_name: '',
        description: '',
        project_manager: '',
        start_date: '',
        dead_line: '',
      })
    } else {
      callErrors(company_id, department_id, project_name, description, project_manager, start_date, dead_line)
    }
  }

  const callErrors = (
    company_id,
    department_id,
    project_name,
    description,
    project_manager,
    start_date,
    dead_line,
  ) => {
    const errors = {}
    if (!company_id) {
      errors.company_id = 'Select a Company'
    }
    if (!department_id) {
      errors.department_id = 'Select a department'
    }
    if (!project_name) {
      errors.project_name = 'Enter the Project name'
    }
    if (!description) {
      errors.description = 'Enter the Description'
    }
    if (!project_manager) {
      errors.project_manager = 'Select a Project Manager'
    }
    if (!start_date) {
      errors.start_date = 'Select Start Date'
    }
    if (!dead_line) {
      errors.dead_line = 'Select End Date'
    }
    setFormErrors(errors)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setDepartmentId('')
    setCompanyId('')
    setProjectName('')
    setDescription('')
    setProjectManager('')
    setStartDate('')
    setDeadLine('')
    setFormErrors({
      company_id: '',
      department_id: '',
      project_name: '',
      description: '',
      project_manager: '',
      start_date: '',
      dead_line: '',
    })
  }

  // Functions for Delete Project Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    deleteProject(isModalOpen2)
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Update Project Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getProjectById2(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    if (department_id && company_id && project_name && description && project_manager && start_date && dead_line) {
      updateProject(isModalOpen3)
      setIsModalOpen3(false)
      form.resetFields()
      setDepartmentId('')
      setCompanyId('')
      setProjectName('')
      setDescription('')
      setProjectManager('')
      setStartDate('')
      setDeadLine('')
      setFormErrors({
        company_id: '',
        department_id: '',
        project_name: '',
        description: '',
        project_manager: '',
        start_date: '',
        dead_line: '',
      })
    } else {
      callErrors(company_id, department_id, project_name, description, project_manager, start_date, dead_line)
    }
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
    form.resetFields()
    setDepartmentId('')
    setCompanyId('')
    setProjectName('')
    setDescription('')
    setProjectManager('')
    setStartDate('')
    setDeadLine('')
    setFormErrors({
      company_id: '',
      department_id: '',
      project_name: '',
      description: '',
      project_manager: '',
      start_date: '',
      dead_line: '',
    })
  }

  // Functions for Assign Users Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    setStreamId(id)
    getHasRole(proj_id, id)
    setIsModalOpen4(id)
  }

  const handleOk4 = () => {
    addAssignProject(isModalOpen4)
    setIsModalOpen4(false)
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
  }

  // Functions for Show Description Modal
  const [isModalOpen5, setIsModalOpen5] = useState(false)
  const showModal5 = (id) => {
    getProjectById(id)
    setIsModalOpen5(id)
  }

  const handleOk5 = () => {
    setIsModalOpen5(false)
  }

  const handleCancel5 = () => {
    setIsModalOpen5(false)
  }

  // Functions for Streams Modal
  const [isModalOpen6, setIsModalOpen6] = useState(false)
  const showModal6 = (id) => {
    setProjectId(id)
    getProjectById(id)
    setIsModalOpen6(true)
    setProjId(id)
  }

  const handleOk6 = () => {
    setIsModalOpen6(false)
  }

  const handleCancel6 = () => {
    setIsModalOpen6(false)
  }

  // Functions for Add Project Success
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

  // Functions for Add Project Failure
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

  // Functions for Delete Project Success
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

  // Functions for Delete Project Failure
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

  // Functions for Update Project Success
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

  // Functions for Update Project Failure
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

  // Functions for Assign User Success
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

  // Functions for Assign User Failure
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

  //Get calls handling
  const handleCompanyChange = (value) => {
    setCompanyId(value)
  }

  const handleDepartmentChange = (value) => {
    setDepartmentId(value)
  }

  const handleProjectManagerChange = (value) => {
    setProjectManager(value)
  }

  // Array declaration for API calls
  const [projects, setProjects] = useState([])
  const [company, setCompanies] = useState([])
  const [users, setUsers] = useState([])
  const [byusers, setByUsers] = useState([])
  const [department, setDepartment] = useState([])
  const [byproject, setByProject] = useState([])
  const [byproject2, setByProject2] = useState([])
  const [stream, setStream] = useState([])
  const [hasrole, setHasRole] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  var filteredUsers = []

  //Initial rendering through useEffect
  useEffect(() => {
    getList()
    getCompany()
    getUsers()
    getDepartment()
    getStreams()
    getProjectManagers()
  }, [])

  useEffect(() => {
    setSelectedUsers(hasrole)
  }, [hasrole])

  //Checkbox control function
  const handleSelectUser = (e, userId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  // Get API calls
  function getList() {
    fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.projects
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getProjectById(id) {
    fetch(`${BASE_URL}/api/get-project-by-project-id/${id}`)
      .then((response) => response.json())
      .then((data) => setByProject(data.projects))
      .catch((error) => console.log(error))
  }

  function getProjectById2(id) {
    fetch(`${BASE_URL}/api/get-project-by-project-id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setByProject2(data.projects)
        setCompanyId(data.projects[0].company_id)
        setDepartmentId(data.projects[0].department_id)
        setProjectName(data.projects[0].project_name)
        setDescription(data.projects[0].project_description)
        setProjectManager(data.projects[0].project_manager)
        const formattedStartDate = moment(data.projects[0].start_date).format('YYYY-MM-DD')
        setStartDate(formattedStartDate)
        const formattedDeadLine = moment(data.projects[0].dead_line).format('YYYY-MM-DD')
        setDeadLine(formattedDeadLine)
      })
      .catch((error) => console.log(error))
  }

  function getCompany() {
    fetch(`${BASE_URL}/api/getcompany`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.companies
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        }
        setCompanies(filteredUsers)
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
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id)
        }
        setUsers(filteredUsers.slice(1))
      })
      .catch((error) => console.log(error))
  }

  async function getProjectManagers() {
    await fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data') ) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && (user.role === 6 || user.role === 7))
        }
        setByUsers(filteredUsers)
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

  function getStreams() {
    fetch(`${BASE_URL}/api/get-streams`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Streams.filter(
            (stream) => stream.company_id === local.Users.company_id,
          )
        }
        setStream(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getHasRole(proj_id, stream_id) {
    fetch(`${BASE_URL}/api/get_assign_project_by_project_id/${proj_id}/${stream_id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const temp_array = data.Assigns.map((element) => element.user_id)
        setHasRole(temp_array)
        console.log(temp_array)
      })
      .catch((error) => console.log(error))
  }

  // Add API call
  async function addProject() {
    let user = { department_id, company_id, project_name, description, project_manager, start_date, dead_line }
    console.log(user)

    await fetch(`${BASE_URL}/api/add_project`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick1()
          getList()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  //Assign users API call
  async function addAssignProject(newid) {
    await fetch(`${BASE_URL}/api/assign_projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        project_id: project_id,
        user_ids: selectedUsers,
        stream_id: stream_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick7()
          getList()
        } else {
          handleButtonClick8()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete API call
  async function deleteProject(newid) {
    await fetch(`${BASE_URL}/api/delete-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick3()
          getList()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update API call
  async function updateProject(newid) {
    await fetch(`${BASE_URL}/api/update-project`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        department_id: department_id,
        company_id: company_id,
        project_name: project_name,
        description: description,
        project_manager: project_manager,
        start_date: start_date,
        dead_line: dead_line,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick5()
          getList()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  //------------
  // Filter
  //------------

  // Filter on the basis of Department
  const handleDepartmentSelect = (value) => {
    setSelectedDepartment(value)
  }

  // Filter on the basis of Project
  const handleProjectSelectAndSearch = (value) => {
    setSelectedProject(value)
  }

  const handleProjectManagerSelect = (value) => {
    setSelectedProjectManager(value)
  }

  const clearFilter = () => {
    form.resetFields()
    setSelectedDepartment('')
    setSelectedProject('')
    setSelectedProjectManager('')
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Projects</h3>
        </div>
        <div className="col-md 6">
          {/* Add Project Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add Project
            </Button>
          ) : null}
        </div>
      </div>

      {isCreateButtonEnabled && (perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data')) && (
        <div className="row mt-2 mb-2 justify-content-between">
          <Form form={form} className="d-flex w-100">
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <Form.Item name="projectSelect" hasFeedback style={{ width: '100%' }}>
                  <Select
                    showSearch
                    placeholder="Select Project"
                    onChange={handleProjectSelectAndSearch}
                    value={project_id}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {projects.map((project) => (
                      <Select.Option value={project.id} key={project.id}>
                        {project.project_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="col-md-3">
              <div className="ml-2 d-flex align-items-center">
                <Form.Item name="departmentSelect" hasFeedback style={{ width: '100%' }}>
                  <Select
                    placeholder="Select Department"
                    onChange={handleDepartmentSelect}
                    value={department_id}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {department.map((dept) => (
                      <Select.Option value={dept.id} key={dept.id}>
                        {dept.department_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>

            <div className="col-md-3">
              <div className="ml-2 d-flex align-items-center">
                <Form.Item name="projectManagerSelect" hasFeedback style={{ width: '100%' }}>
                  <Select
                    placeholder="Select Project Manager"
                    onChange={handleProjectManagerSelect}
                    value={project_manager}
                    showSearch
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
      )}

      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Projects table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Project Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Department Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Project Manager
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Start Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              End Date
            </CTableHeaderCell>
            {isEditButtonEnabled || isDeleteButtonEnabled || isViewButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Action
              </CTableHeaderCell>
            ) : null}
            {isAssignProjectEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Streams
              </CTableHeaderCell>
            ) : null}
          </CTableRow>

          {/* Get API Projects */}
          {perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data')
            ? projects
                .filter((project) => {
                  // Apply Department filter
                  if (selectedDepartment !== '') {
                    return project.department_id === selectedDepartment
                  }
                  return true
                })
                .filter((project) => {
                  // Apply Project filter
                  if (selectedProject !== '') {
                    return project.id === selectedProject
                  }
                  return true
                })
                .filter((project) => {
                  // Apply Project Manager filter
                  if (selectedProjectManager !== '') {
                    return project.project_manager === selectedProjectManager
                  }
                  return true
                })
                .map((project, index) => {
                  const startDate = moment(project.start_date).format('DD-MM-YYYY')
                  const deadline = moment(project.dead_line).format('DD-MM-YYYY')

                  return (
                    <CTableRow key={project.id}>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {index + 1}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {project.project_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {project.department_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {project.project_manager_details[0]?.name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {startDate}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {deadline}
                      </CTableHeaderCell>
                      {isEditButtonEnabled || isViewButtonEnabled || isDeleteButtonEnabled ? (
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {isViewButtonEnabled ? (
                            <IconButton
                              aria-label="view"
                              onClick={() => showModal5(project.project_id)}
                            >
                              <VisibilityIcon htmlColor="#0070ff" />
                            </IconButton>
                          ) : null}
                          {isEditButtonEnabled ? (
                            <IconButton
                              aria-label="update"
                              onClick={() => showModal3(project.project_id)}
                            >
                              <EditIcon htmlColor="#28B463" />
                            </IconButton>
                          ) : null}
                          {isDeleteButtonEnabled ? (
                            <IconButton
                              aria-label="delete"
                              onClick={() => showModal2(project.project_id)}
                            >
                              <DeleteIcon htmlColor="#FF0000" />
                            </IconButton>
                          ) : null}
                        </CTableHeaderCell>
                      ) : null}
                      {isAssignProjectEnabled ? (
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          <IconButton
                            aria-label="assign"
                            title="Assign Project"
                            onClick={() => showModal6(project.project_id)}
                          >
                            <PermContactCalendarIcon htmlColor="#0070ff" />
                          </IconButton>
                        </CTableHeaderCell>
                      ) : null}
                    </CTableRow>
                  )
                })
            : null}
        </CTableHead>
        <CTableBody>
          {/* Modal for Add Projects */}
          <Modal
            title="Add a Project"
            open={isModalOpen}
            onOk={handleOk}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel}
            maskClosable={false}
          >
            <br></br>

            <Form form={form}>
              <div className="form-outline mt-3">
                <label>Company</label>
                <Form.Item
                  validateStatus={formErrors.company_id ? 'error' : ''}
                  help={formErrors.company_id}
                >
                  <Select
                    name="company_id"
                    placeholder="Select Company"
                    onChange={handleCompanyChange}
                    onFocus={handleFocus}
                    value={company_id}
                  >
                    {company.map((company) => (
                      <Select.Option value={company.id} key={company.id}>
                        {company.company_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="form-outline mt-3">
                <label>Department</label>
                <Form.Item
                  validateStatus={formErrors.department_id ? 'error' : ''}
                  help={formErrors.department_id}
                >
                  <Select
                    name="department_id"
                    placeholder="Select Department"
                    onChange={handleDepartmentChange}
                    onFocus={handleFocus}
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
                <label>Project Manager</label>
                <Form.Item
                  validateStatus={formErrors.project_manager ? 'error' : ''}
                  help={formErrors.project_manager}
                >
                  <Select
                    name="project_manager"
                    placeholder="Select Project Manager"
                    onChange={handleProjectManagerChange}
                    onFocus={handleFocus}
                    value={project_manager}
                  >
                    {byusers.map((user) => (
                      <Select.Option value={user.id} key={user.id}>
                        {user.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form>

            <div className="form-outline mt-3">
              <label>Project Name</label>
              <input
                name="project_name"
                type="text"
                value={project_name}
                onChange={(e) => setProjectName(e.target.value)}
                onFocus={handleFocus}
                className="form-control form-control-lg"
                placeholder="Enter Project Name"
              />
            </div>
            {formErrors.project_name && (
              <div className="text-danger">{formErrors.project_name}</div>
            )}

            <div className="form-outline mt-3">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={description}
                onFocus={handleFocus}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Description"
              />
            </div>
            {formErrors.description && <div className="text-danger">{formErrors.description}</div>}

            <div className="form-outline mt-3">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={start_date}
                onFocus={handleFocus}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
              />
            </div>
            {formErrors.start_date && <div className="text-danger">{formErrors.start_date}</div>}

            <div className="form-outline mt-3">
              <label>End Date</label>
              <input
                type="date"
                value={dead_line}
                name="dead_line"
                onFocus={handleFocus}
                onChange={(e) => setDeadLine(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Dead Line"
              />
            </div>
            {formErrors.dead_line && <div className="text-danger">{formErrors.dead_line}</div>}
          </Modal>

          {/* Modal for Update Projects */}
          <Modal
            title="Update a Project"
            open={isModalOpen3}
            onOk={handleOk3}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel3}
            maskClosable={false}
          >
            <br></br>

            {byproject2.map((proj) => (
              <div key={proj.id}>
                <Form form={form}>
                  <div className="form-outline mt-3">
                    <label>Company</label>
                    <Form.Item
                      validateStatus={formErrors.company_id ? 'error' : ''}
                      help={formErrors.company_id}
                    >
                      <Select
                        placeholder="Select Company"
                        name="company_id"
                        onChange={handleCompanyChange}
                        onFocus={handleFocus}
                        value={company_id}
                      >
                        {company.map((company) => (
                          <Select.Option value={company.id} key={company.id}>
                            {company.company_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="form-outline mt-3">
                    <label>Department</label>
                    <Form.Item
                      validateStatus={formErrors.department_id ? 'error' : ''}
                      help={formErrors.department_id}
                    >
                      <Select
                        name="department_name"
                        placeholder="Select Departments"
                        onFocus={handleFocus}
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
                    <label>Project Manager</label>
                    <Form.Item
                      validateStatus={formErrors.project_manager ? 'error' : ''}
                      help={formErrors.project_manager}
                    >
                      <Select
                        name="project_manager"
                        placeholder="Select Project Manager"
                        onFocus={handleFocus}
                        onChange={handleProjectManagerChange}
                        value={project_manager}
                      >
                        {byusers.map((user) => (
                          <Select.Option value={user.id} key={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>

                <div className="form-outline mt-3">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={project_name}
                    name="project_name"
                    onFocus={handleFocus}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Project Name"
                  />
                </div>
                {formErrors.project_name && (
                  <div className="text-danger">{formErrors.project_name}</div>
                )}

                <div className="form-outline mt-3">
                  <label>Description</label>
                  <input
                    type="text"
                    value={description}
                    name="description"
                    onFocus={handleFocus}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Description"
                  />
                </div>
                {formErrors.description && (
                  <div className="text-danger">{formErrors.description}</div>
                )}

                <div className="form-outline mt-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={start_date}
                    name="start_date"
                    onFocus={handleFocus}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Start Date"
                  />
                </div>
                {formErrors.start_date && (
                  <div className="text-danger">{formErrors.start_date}</div>
                )}

                <div className="form-outline mt-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={dead_line}
                    name="dead_line"
                    onFocus={handleFocus}
                    onChange={(e) => setDeadLine(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Dead Line"
                  />
                </div>
                {formErrors.dead_line && <div className="text-danger">{formErrors.dead_line}</div>}
              </div>
            ))}
          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal
            title="Are you sure you want to delete?"
            open={isModalOpen2}
            onOk={handleOk2}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel2}
            style={modalStyle}
          ></Modal>

          {/* Modal for View Details */}
          <Modal
            title=""
            open={isModalOpen5}
            onOk={handleOk5}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel5}
            style={modalStyle}
          >
            {byproject.map((proj) => {
              const start = moment(proj.start_date).format('DD-MM-YYYY')
              const dead = moment(proj.dead_line).format('DD-MM-YYYY')

              return (
                <div key={proj.id}>
                  <h3 style={headStyle}>{proj.project_name}</h3>
                  <br></br>
                  <h6 style={perStyle}>Company Name</h6>
                  <p>{proj.company_name}</p>
                  <h6 style={perStyle}>Department Name</h6>
                  <p>{proj.department_name}</p>
                  <h6 style={perStyle}>Description</h6>
                  <p>{proj.project_description}</p>
                  <h6 style={perStyle}>Start Date</h6>
                  <p>{start}</p>
                  <h6 style={perStyle}>End Date</h6>
                  <p>{dead}</p>
                </div>
              )
            })}
          </Modal>

          {/* Modal for Streams */}
          <Modal
            title=""
            open={isModalOpen6}
            onOk={handleOk6}
            onCancel={handleCancel6}
            okButtonProps={{ style: { background: 'blue' } }}
          >
            <h3 style={headStyle2}>Streams</h3>

            <br></br>
            <div className="row">
              <div className="col md-2 text-center">
                <h6>Sr/No</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={perStyle}>Name</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={perStyle}>Assign</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            {stream.map((str, index) => (
              <div className="row" key={str.id}>
                <div className="col md-2 text-center">
                  <h6 style={perStyle}>{index + 1}</h6>
                </div>
                <div className="col md-3"></div>
                <div className="col md-2 text-center">
                  <h6 style={perStyle}>{str.stream_name}</h6>
                </div>
                <div className="col md-3"></div>
                <div className="col md-2 text-center">
                  <IconButton aria-label="user" onClick={() => showModal4(str.id)}>
                    <AssignmentIndIcon htmlColor="#0070ff" />
                  </IconButton>
                </div>
                &nbsp;
                <Divider></Divider>
              </div>
            ))}

            <br></br>
          </Modal>

          {/* Modal for Assign User */}
          <Modal
            title="Assign Users"
            open={isModalOpen4}
            onOk={handleOk4}
            onCancel={handleCancel4}
            okButtonProps={{ style: { background: 'blue' } }}
          >
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

            {users.map((user, index) => (
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
            ))}
          </Modal>

          {/* Alert for Add Project Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Project Added Successfully
            </Alert>
          )}

          {/* Alert for Add Project Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Project
            </Alert>
          )}

          {/* Alert for Delete Project Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Project Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Project Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Project
            </Alert>
          )}

          {/* Alert for Update Project Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Project Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Project Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Project
            </Alert>
          )}

          {/* Alert for User Assign Success*/}
          {showAlert7 && (
            <Alert onClose={handleCloseAlert7} severity="success" style={modalStyle2}>
              Users Assigned Successfully
            </Alert>
          )}

          {/* Alert for User Assign Failure*/}
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

export default Projects
