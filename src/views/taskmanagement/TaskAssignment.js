import { React, useState, useEffect } from 'react'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { Modal, Button, Form, Select, Radio, Space } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import moment from 'moment'

const BASE_URL = process.env.REACT_APP_BASE_URL

function TaskAssignment() {
  const ITEMS_PER_PAGE = 10
  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const local = JSON.parse(localStorage.getItem('user-info'))
  const session_token = session.token

  const [user_id, setUserId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [task_description, setTaskDescription] = useState('')
  const [task_managements_start_date, setTaskManagementStartDate] = useState('')
  const [task_managements_dead_line, setTaskManagementDeadLine] = useState('')
  const [taskStatus, setTaskStatus] = useState()

  const [users, setAllUsers] = useState([])
  const [projects, setProjects] = useState([])

  const [pendingTasks, setPendingTasks] = useState([])
  const [inProgressTasks, setInProgressTasks] = useState([])
  const [completedTask, setCompletedTasks] = useState([])

  const [currentPagePending, setCurrentPagePending] = useState(1)
  const [totalItemsPending, setTotalItemsPending] = useState(0)
  const [currentItemsPending, setCurrentItemsPending] = useState([])

  const [currentPageInProgress, setCurrentPageInProgress] = useState(1)
  const [totalItemsInProgress, setTotalItemsInProgress] = useState(0)
  const [currentItemsInProgress, setCurrentItemsInProgress] = useState([])

  const [currentPageCompleted, setCurrentPageCompleted] = useState(1)
  const [totalItemsCompleted, setTotalItemsCompleted] = useState(0)
  const [currentItemsCompleted, setCurrentItemsCompleted] = useState([])

  const [selectedUser, setSelectedUser] = useState()
  const [selectedProject, setSelectedProject] = useState()

  const [isPendingTasksTab, setIsPendingTasksTab] = useState(true)
  const [isInProgressTasksTab, setIsInProgressTasksTab] = useState(false)
  const [isCompletedTaskTab, setIsCompletedTasksTab] = useState(false)

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

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '140px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  //Initial rendering through useEffect
  useEffect(() => {
    getUsers()
    getProjects()
    getTasks()
  }, [])

  useEffect(() => {
    setCurrentItemsPending(slicedItemsPending)
  }, [currentPagePending, pendingTasks])

  useEffect(() => {
    setCurrentItemsInProgress(slicedItemsInProgress)
  }, [currentPageInProgress, inProgressTasks])

  useEffect(() => {
    setCurrentItemsCompleted(slicedItemsCompleted)
  }, [currentPageCompleted, completedTask])

  //Get calls handling
  const handleUserChange = (value) => {
    setUserId(value)
  }

  const applyFilters = () => {
    if (selectedUser && selectedProject) {
      getTaskByProjectAndUserId()
    } else if (selectedProject && !selectedUser) {
      getTaskByProjectId()
    } else if (!selectedProject && selectedUser) {
      getTasksByUserId()
    } else {
      return
    }
  }

  const clearFilters = () => {
    form.resetFields()
    setSelectedUser(null)
    setSelectedProject(null)
    getTasks()
  }

  const handleProjectChange = (value) => {
    setProjectId(value)
  }

  // Functions for Assign Tasks Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    addTask()
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setUserId('')
    setProjectId('')
    setTaskDescription('')
    setPriorities('')
    setTaskManagementStartDate('')
    setTaskManagementDeadLine('')
    setTaskStatus('')
  }

  // For Radio Buttons
  const radioOptions = [
    { value: 'LOW', color: 'blue' },
    { value: 'MEDIUM', color: 'green' },
    { value: 'HIGH', color: 'red' },
  ]
  const [priorities, setPriorities] = useState('LOW')

  // Get & Set Selected Task ID :
  const [editedTaskId, setEditedTaskId] = useState()
  // Functions for Assign Tasks Modal
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
  const showUpdateModal = (task_managements_id) => {
    setEditedTaskId(task_managements_id)
    getTaskById(task_managements_id)
    setIsModalOpenUpdate(true)
  }
  const handleUpdate = () => {
    updateTask(editedTaskId)
    setIsModalOpenUpdate(false)
  }
  const updateCancel = () => {
    setIsModalOpenUpdate(false)
    setUserId('')
    setProjectId('')
    setTaskDescription('')
    setPriorities('')
    setTaskManagementStartDate('')
    setTaskManagementDeadLine('')
    setTaskStatus('')
  }

  function getTasks() {
    fetch(`${BASE_URL}/api/getTasks`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          const filteredUsersTask = data.task.filter((user) => user.team_lead_id === local.Users.id)
          const todoTasks = filteredUsersTask.filter((task) => task.status === 'Pending')
          const in_progressTasks = filteredUsersTask.filter((task) => task.status === 'InProgress')
          const doneTasks = filteredUsersTask.filter((task) => task.status === 'Completed')
          setPendingTasks(todoTasks)
          setInProgressTasks(in_progressTasks)
          setCompletedTasks(doneTasks)
          setTotalItemsPending(todoTasks.length)
          setTotalItemsInProgress(in_progressTasks.length)
          setTotalItemsCompleted(doneTasks.length)
        }
      })
      .catch((error) => console.log(error))
  }

  function getTasksByUserId() {
    console.log('selectedUser : ', selectedUser)
    fetch(`${BASE_URL}/api/getTaskByUserId/${selectedUser}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ', data)
        if (local.Users.role === 7) {
          const filteredUsersTask = data.task.filter((user) => user.team_lead_id === local.Users.id)
          console.log('filteredUsersTask: ', filteredUsersTask)
          const todoTasks = filteredUsersTask.filter((task) => task.status === 'Pending')
          const in_progressTasks = filteredUsersTask.filter((task) => task.status === 'InProgress')
          const doneTasks = filteredUsersTask.filter((task) => task.status === 'Completed')
          setPendingTasks(todoTasks)
          setInProgressTasks(in_progressTasks)
          setCompletedTasks(doneTasks)
          setTotalItemsPending(todoTasks.length)
          setTotalItemsInProgress(in_progressTasks.length)
          setTotalItemsCompleted(doneTasks.length)
        }
      })
      .catch((error) => console.log(error))
  }

  const getTaskByProjectId = () => {
    console.log('selectedProject: ', selectedProject)
    fetch(`${BASE_URL}/api/getTaskByProjectId/${selectedProject}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ', data)
        if (local.Users.role === 7) {
          const filteredUsersTask = data.task.filter((task) => task.team_lead_id === local.Users.id)
          console.log('filteredUsersTask: ', filteredUsersTask)
          const todoTasks = filteredUsersTask.filter((task) => task.status === 'Pending')
          const in_progressTasks = filteredUsersTask.filter((task) => task.status === 'InProgress')
          const doneTasks = filteredUsersTask.filter((task) => task.status === 'Completed')
          setPendingTasks(todoTasks)
          setInProgressTasks(in_progressTasks)
          setCompletedTasks(doneTasks)
          setTotalItemsPending(todoTasks.length)
          setTotalItemsInProgress(in_progressTasks.length)
          setTotalItemsCompleted(doneTasks.length)
        }
      })
      .catch((error) => console.log(error))
  }

  const getTaskByProjectAndUserId = () => {
    console.log('${selectedUser}/${selectedProject} : ', selectedUser, selectedProject)
    fetch(`${BASE_URL}/api/getTaskByUserIdAndProjectId/${selectedUser}/${selectedProject}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ', data)
        if (local.Users.role === 7) {
          console.log('Condition True in getTaskByProjectAndUserId ')
          const filteredUsersTask = data.task.filter((task) => task.team_lead_id === local.Users.id)
          console.log('filteredUsersTask: ', filteredUsersTask)
          const todoTasks = filteredUsersTask.filter((task) => task.status === 'Pending')
          const in_progressTasks = filteredUsersTask.filter((task) => task.status === 'InProgress')
          const doneTasks = filteredUsersTask.filter((task) => task.status === 'Completed')
          setPendingTasks(todoTasks)
          setInProgressTasks(in_progressTasks)
          setCompletedTasks(doneTasks)
          setTotalItemsPending(todoTasks.length)
          setTotalItemsInProgress(in_progressTasks.length)
          setTotalItemsCompleted(doneTasks.length)
        }
      })
      .catch((error) => console.log(error))
  }

  function getUsers() {
    let filteredUsers = []
    fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          filteredUsers = data.Users.filter(
            (user) => user.company_id === local.Users.company_id && user.role === 5,
          )
        }
        setAllUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getProjects() {
    let filteredProjects = []
    fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          filteredProjects = data.projects.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        }
        setProjects(filteredProjects)
      })
      .catch((error) => console.log(error))
  }

  async function addTask() {
    const taskData = {
      user_id,
      team_lead_id: local.Users.id,
      project_id,
      priorities,
      task_description,
      start_date: task_managements_start_date,
      dead_line: task_managements_dead_line,
    }
    await fetch(`${BASE_URL}/api/addTasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session_token}`,
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (response.ok) {
          getTasks()
          setUserId('')
          setProjectId('')
          setTaskDescription('')
          setPriorities('')
          setTaskManagementStartDate('')
          setTaskManagementDeadLine('')
          setTaskStatus('')
          // handleButtonClick3();
          // getMembers()
        } else {
          // handleButtonClick4();
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const getTaskById = async (id) => {
    fetch(`${BASE_URL}/api/getTaskById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.task.user_id)
        setProjectId(data.task.project_id)
        setTaskDescription(data.task.task_description)
        setPriorities(data.task.priorites)
        setTaskStatus(data.task.status)
        const formattedStartDate = moment(data.task.task_managements_start_date).format(
          'YYYY-MM-DD',
        )
        setTaskManagementStartDate(formattedStartDate)
        const formattedDeadLine = moment(data.task.task_managements_dead_line).format('YYYY-MM-DD')
        setTaskManagementDeadLine(formattedDeadLine)
      })
      .catch((error) => console.log(error))
  }

  const updateTask = async (newid) => {
    const taskData = {
      id: newid,
      user_id: user_id,
      team_lead_id: local.Users.id,
      project_id: project_id,
      priorities: priorities,
      status: taskStatus,
      task_description: task_description,
      start_date: task_managements_start_date,
      dead_line: task_managements_dead_line,
    }

    await fetch(`${BASE_URL}/api/updateTasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session_token}`,
      },
      body: JSON.stringify(taskData),
    })
      .then((response) => {
        if (response.ok) {
          getTasks()
          setUserId('')
          setProjectId('')
          setTaskDescription('')
          setPriorities('')
          setTaskManagementStartDate('')
          setTaskManagementDeadLine('')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const deleteTask = async (id) => {
    await fetch(`${BASE_URL}/api/deleteTaskById`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getTasks()
          console.log('Task DELETED Successfully')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const changeTab = (e) => {
    if (e.target.value === 'Completed') {
      setIsPendingTasksTab(false)
      setIsInProgressTasksTab(false)
      setIsCompletedTasksTab(true)
    } else if (e.target.value === 'InProgress') {
      setIsPendingTasksTab(false)
      setIsInProgressTasksTab(true)
      setIsCompletedTasksTab(false)
    } else {
      setIsPendingTasksTab(true)
      setIsInProgressTasksTab(false)
      setIsCompletedTasksTab(false)
    }
  }

  //------------------
  // Pagination logic
  //------------------
  // Pagination for Pending task table
  const indexOfLastItemPending = currentPagePending * ITEMS_PER_PAGE
  const indexOfFirstItemPending = indexOfLastItemPending - ITEMS_PER_PAGE
  const slicedItemsPending = pendingTasks.slice(indexOfFirstItemPending, indexOfLastItemPending)

  // Pagination for In-progress task table
  const indexOfLastItemInProgress = currentPageInProgress * ITEMS_PER_PAGE
  const indexOfFirstItemInProgress = indexOfLastItemInProgress - ITEMS_PER_PAGE
  const slicedItemsInProgress = inProgressTasks.slice(
    indexOfFirstItemInProgress,
    indexOfLastItemInProgress,
  )

  // Pagination for Completed task table
  const indexOfLastItemCompleted = currentPageCompleted * ITEMS_PER_PAGE
  const indexOfFirstItemCompleted = indexOfLastItemCompleted - ITEMS_PER_PAGE
  const slicedItemsCompleted = completedTask.slice(
    indexOfFirstItemCompleted,
    indexOfLastItemCompleted,
  )

  // Handle Pending page change
  const handlePendingTaskPageChange = (pageNumber) => {
    setCurrentPagePending(pageNumber)
  }

  // Handle In-progress page change
  const handleInProgressTaskPageChange = (pageNumber) => {
    setCurrentPageInProgress(pageNumber)
  }

  // Handle Completed page change
  const handleCompletedTaskPageChange = (pageNumber) => {
    setCurrentPageCompleted(pageNumber)
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Task Management</h3>
        </div>
        <div className="col-md 6">
          {/* Assign a Task Button */}
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
            Assign Task
          </Button>
        </div>
      </div>
      <div className="row">
        <Box className="col-md-3">
          <Space
            style={{
              marginBottom: 24,
            }}
          >
            <Radio.Group onChange={changeTab}>
              <Radio.Button value="Pending">To Do</Radio.Button>
              <Radio.Button value="InProgress">In-Progress</Radio.Button>
              <Radio.Button value="Completed">Completed</Radio.Button>
            </Radio.Group>
          </Space>
        </Box>
        <Form form={form} className="row col-md-6">
          <Box className="col-md-6">
            <Form.Item name="selectUser" hasFeedback>
              <Select placeholder="SELECT EMPLOYEE" onChange={(value) => setSelectedUser(value)}>
                {users.map((user) => (
                  <Select.Option value={user.id} key={user.id}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Box>
          <Box className="col-md-6">
            <Form.Item name="selectProject" hasFeedback>
              <Select placeholder="SELECT PROJECT" onChange={(value) => setSelectedProject(value)}>
                {projects.map((project) => (
                  <Select.Option value={project.id} key={project.id}>
                    {project.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Box>
        </Form>
        <Box
          className="col-md-3"
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}
        >
          <Button type="default" onClick={applyFilters}>
            Apply Filter
          </Button>

          <Button type="default" onClick={clearFilters} danger>
            Clear Filter
          </Button>
        </Box>
      </div>

      <br></br>

      <div>
        {isPendingTasksTab === true && pendingTasks.length > 0 && currentItemsPending.length > 0 ? (
          <div>
            <div className="row">
              <div className="col-md 6">
                <h4>
                  <b>To-Do</b>
                </h4>
              </div>
              <div className="col-md 6">
                <h3>
                  Total <b>To-Do</b> Tasks: <b>{totalItemsPending}</b>
                </h3>
              </div>
            </div>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                {/* Task Assignment table heading */}
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task No.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned To
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Details
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Dead Line
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {pendingTasks.length > 0 &&
                  currentItemsPending.map((task, index) => (
                    <CTableRow key={task.task_managements_id}>
                      <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                      >
                        {task.project_name} - {task.task_managements_id}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.project_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, width: '200px' }}
                      >
                        {task.task_description}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.priorites}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.status}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {new Date(task.task_managements_start_date).toLocaleDateString()}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {new Date(task.task_managements_dead_line).toLocaleDateString()}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        <IconButton aria-label="Update">
                          <EditIcon
                            htmlColor="#28B463"
                            onClick={() => showUpdateModal(task.task_managements_id)}
                          />
                        </IconButton>
                        <IconButton aria-label="Delete">
                          <DeleteIcon
                            htmlColor="#FF0000"
                            onClick={() => deleteTask(task.task_managements_id)}
                          />
                        </IconButton>
                      </CTableHeaderCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>

            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPagePending === 1}
                onClick={() => handlePendingTaskPageChange(currentPagePending - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from({ length: Math.ceil(totalItemsPending / ITEMS_PER_PAGE) }, (_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={index + 1 === currentPagePending}
                  onClick={() => handlePendingTaskPageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPagePending === Math.ceil(totalItemsPending / ITEMS_PER_PAGE)}
                onClick={() => handlePendingTaskPageChange(currentPagePending + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </CPaginationItem>
            </CPagination>
          </div>
        ) : (
          ''
        )}

        {isInProgressTasksTab === true &&
        inProgressTasks.length > 0 &&
        currentItemsInProgress.length > 0 ? (
          <div>
            <div className="row">
              <div className="col-md 6">
                <h4>
                  <b>In-Progress</b>
                </h4>
              </div>
              <div className="col-md 6">
                <h3>
                  Total <b>In-Progress</b> Tasks: <b>{totalItemsInProgress}</b>
                </h3>
              </div>
            </div>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                {/* Task Assignment table heading */}
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task No.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Details
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Dead Line
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {inProgressTasks.length > 0 &&
                  currentItemsInProgress.map((task, index) => (
                    <CTableRow key={task.task_managements_id}>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.project_name} - {task.task_managements_id}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.name}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.project_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, width: '200px' }}
                      >
                        {task.task_description}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.priorites}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.status}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {new Date(task.task_managements_start_date).toLocaleDateString()}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {new Date(task.task_managements_dead_line).toLocaleDateString()}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        <IconButton aria-label="Update">
                          <EditIcon
                            htmlColor="#28B463"
                            onClick={() => showUpdateModal(task.task_managements_id)}
                          />
                        </IconButton>
                        <IconButton aria-label="Delete">
                          <DeleteIcon
                            htmlColor="#FF0000"
                            onClick={() => deleteTask(task.task_managements_id)}
                          />
                        </IconButton>
                      </CTableHeaderCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>

            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPageInProgress === 1}
                onClick={() => handleInProgressTaskPageChange(currentPageInProgress - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from(
                { length: Math.ceil(totalItemsInProgress / ITEMS_PER_PAGE) },
                (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={index + 1 === currentPageInProgress}
                    onClick={() => handleInProgressTaskPageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ),
              )}
              <CPaginationItem
                disabled={
                  currentPageInProgress === Math.ceil(totalItemsInProgress / ITEMS_PER_PAGE)
                }
                onClick={() => handleInProgressTaskPageChange(currentPageInProgress + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </CPaginationItem>
            </CPagination>
          </div>
        ) : (
          ''
        )}

        {isCompletedTaskTab === true &&
        completedTask.length > 0 &&
        currentItemsCompleted.length > 0 ? (
          <div>
            <div className="row">
              <div className="col-md 6">
                <h4>
                  <b>Completed</b>
                </h4>
              </div>
              <div className="col-md 6">
                <h3>
                  Total <b>Completed</b> Tasks: <b>{totalItemsCompleted}</b>
                </h3>
              </div>
            </div>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                {/* Task Assignment table heading */}
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task No.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Details
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Status
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Dead Line
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {completedTask.length > 0 &&
                  currentItemsCompleted.map((task, index) => (
                    <CTableRow key={task.task_managements_id}>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.project_name} - {task.task_managements_id}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.name}
                      </CTableHeaderCell>

                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.project_name}
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, width: '200px' }}
                      >
                        {task.task_description}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.priorites}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.status}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {new Date(task.task_managements_start_date).toLocaleDateString()}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {new Date(task.task_managements_dead_line).toLocaleDateString()}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        <IconButton aria-label="Update">
                          <EditIcon
                            htmlColor="#28B463"
                            onClick={() => showUpdateModal(task.task_managements_id)}
                          />
                        </IconButton>
                        <IconButton aria-label="Delete">
                          <DeleteIcon
                            htmlColor="#FF0000"
                            onClick={() => deleteTask(task.task_managements_id)}
                          />
                        </IconButton>
                      </CTableHeaderCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>

            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPageCompleted === 1}
                onClick={() => handleCompletedTaskPageChange(currentPageCompleted - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from(
                { length: Math.ceil(totalItemsCompleted / ITEMS_PER_PAGE) },
                (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={index + 1 === currentPageCompleted}
                    onClick={() => handleCompletedTaskPageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ),
              )}
              <CPaginationItem
                disabled={currentPageCompleted === Math.ceil(totalItemsCompleted / ITEMS_PER_PAGE)}
                onClick={() => handleCompletedTaskPageChange(currentPageCompleted + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </CPaginationItem>
            </CPagination>
          </div>
        ) : (
          ''
        )}
      </div>
      {/* Modal for Assign Task */}
      <Modal
        title="Add a Project"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <br></br>

        <div className="form-outline mb-3">
          <label>User</label>
          <Form.Item>
            <Select placeholder="Select Departments" onChange={handleUserChange} value={user_id}>
              {users.map((user) => (
                <Select.Option value={user.id} key={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-outline mb-3">
          <label>Project</label>
          <Form.Item>
            <Select placeholder="Select Project" onChange={handleProjectChange} value={project_id}>
              {projects.map((pro) => (
                <Select.Option value={pro.id} key={pro.id}>
                  {pro.project_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-outline mb-3">
          <label>Task Description</label>
          <input
            type="text"
            value={task_description}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Description"
          />
        </div>

        <div className="form-outline mb-3">
          <label>Assigned Date</label>
          <input
            type="date"
            value={task_managements_start_date}
            onChange={(e) => setTaskManagementStartDate(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Assigned Date"
          />
        </div>

        <div className="form-outline mb-3">
          <label>End Date</label>
          <input
            type="date"
            value={task_managements_dead_line}
            onChange={(e) => setTaskManagementDeadLine(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Dead Line"
          />
        </div>

        <div className="form-outline mb-3">
          <label>Task Status</label>
          <Form.Item>
            <Select
              placeholder="Select Task Status"
              onChange={(value) => setTaskStatus(value)}
              value={taskStatus}
            >
              <Select.Option value="Pending" key="Pending">
                Pending
              </Select.Option>
              <Select.Option value="InProgress" key="InProgress">
                In-Progress
              </Select.Option>
              <Select.Option value="Completed" key="Completed">
                Completed
              </Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="form-outline mb-3">
          <div>
            <b>Select Priority of Task</b>
          </div>
          <Radio.Group value={priorities} onChange={(e) => setPriorities(e.target.value)}>
            {radioOptions.map((option) => (
              <Radio key={option.value} value={option.value} style={{ color: option.color }}>
                {option.value}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </Modal>

      {/* Modal for Update Task */}
      <Modal
        title="Update a Task"
        open={isModalOpenUpdate}
        onOk={handleUpdate}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={updateCancel}
        maskClosable={false}
      >
        <br />

        <div className="form-outline mb-3">
          <label>User</label>
          <Form.Item>
            <Select placeholder="Select Departments" onChange={handleUserChange} value={user_id}>
              {users.map((user) => (
                <Select.Option value={user.id} key={user.id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-outline mb-3">
          <label>Project</label>
          <Form.Item>
            <Select placeholder="Select Project" onChange={handleProjectChange} value={project_id}>
              {projects.map((pro) => (
                <Select.Option value={pro.id} key={pro.id}>
                  {pro.project_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="form-outline mb-3">
          <label>Task Description</label>
          <input
            type="text"
            value={task_description}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Description"
          />
        </div>

        <div className="form-outline mb-3">
          <label>Assigned Date</label>
          <input
            type="date"
            value={task_managements_start_date}
            onChange={(e) => setTaskManagementStartDate(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Assigned Date"
          />
        </div>

        <div className="form-outline mb-3">
          <label>End Date</label>
          <input
            type="date"
            value={task_managements_dead_line}
            onChange={(e) => setTaskManagementDeadLine(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Dead Line"
          />
        </div>

        <div className="form-outline mb-3">
          <label>Task Status</label>
          <Form.Item>
            <Select
              placeholder="Select Task Status"
              onChange={(value) => setTaskStatus(value)}
              value={taskStatus}
            >
              <Select.Option value="Pending" key="Pending">
                Pending
              </Select.Option>
              <Select.Option value="InProgress" key="InProgress">
                In-Progress
              </Select.Option>
              <Select.Option value="Completed" key="Completed">
                Completed
              </Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="form-outline mb-3">
          <div>
            <b>Select Priority of Task</b>
          </div>
          <Radio.Group
            onChange={(e) => setPriorities(e.target.value)}
            value={priorities}
            placeholder="Select Priority of Task"
          >
            {radioOptions.map((option) => (
              <Radio key={option.value} value={option.value} style={{ color: option.color }}>
                {option.value}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </Modal>
    </>
  )
}

export default TaskAssignment
