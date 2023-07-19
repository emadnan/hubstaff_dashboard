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
import VisibilityIcon from '@mui/icons-material/Visibility'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import moment from 'moment'
import LoadingSpinner from 'src/components/Loader/Loader'

const BASE_URL = process.env.REACT_APP_BASE_URL

function TaskAssignment() {
  const ITEMS_PER_PAGE = 10
  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const local = JSON.parse(localStorage.getItem('user-info'))
  const session_token = session.token

  const [user_id, setUserId] = useState('')
  const [user_name, setUserName] = useState('')
  const [project_id, setProjectId] = useState('')
  const [project_name, setProjectName] = useState('')
  const [task_description, setTaskDescription] = useState('')
  const [task_managements_start_date, setTaskManagementStartDate] = useState('')
  const [task_managements_dead_line, setTaskManagementDeadLine] = useState('')
  const [taskStatus, setTaskStatus] = useState()
  const [priorities, setPriorities] = useState('LOW')
  const [task_id, setTaskId] = useState()
  const [taskComment, setTaskComment] = useState()

  const [isLoading, setIsLoading] = useState(false)

  // For Radio Buttons
  const radioOptions = [
    { value: 'LOW', color: 'blue' },
    { value: 'MEDIUM', color: 'green' },
    { value: 'HIGH', color: 'red' },
  ]

  // Get & Set Selected Task ID :
  const [editedTaskId, setEditedTaskId] = useState()
  const [deleteTaskId, setDeleteTaskId] = useState()

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

  const [isFilterApplied, setIsFilterApplied] = useState(false)

  let [form] = Form.useForm()

  // CSS Styling
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

  const alertStyle = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
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

  //----------------------------------
  // Functions for Applying Filters
  //----------------------------------

  const handleUserChange = (value) => {
    setUserId(value)
  }

  const handleProjectChange = (value) => {
    setProjectId(value)
  }

  const applyFilters = () => {
    setIsFilterApplied(true)
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
    setIsFilterApplied(false)
    getTasks()
    form.resetFields()
    setSelectedUser(null)
    setSelectedProject(null)
  }

  const changeTab = (e) => {
    if (isFilterApplied === false) {
      clearFilters()
    }

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

  //----------------------------------
  // Functions for Fields Validation
  //----------------------------------

  const [formErrors, setFormErrors] = useState({
    user_id,
    project_id,
    priorities,
    task_description,
    task_managements_start_date,
    task_managements_dead_line,
  })

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  const callErrors = (
    user_id,
    project_id,
    task_description,
    task_managements_start_date,
    task_managements_dead_line,
  ) => {
    const errors = {}
    if (!user_id) {
      errors.user_id = 'Please Select the User'
    }
    if (!project_id) {
      errors.project_id = 'Please Select the Project'
    }
    if (!task_description) {
      errors.task_description = 'Task Description is required'
    }
    if (!task_managements_start_date) {
      errors.task_managements_start_date = 'Start Date is required'
    }
    if (!task_managements_dead_line) {
      errors.task_managements_dead_line = 'End Date is required'
    }

    setFormErrors(errors)
  }

  //---------------------------
  // Functions for Crud Tasks
  //---------------------------

  // Functions for Assign Tasks Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (
      user_id &&
      project_id &&
      priorities &&
      task_description &&
      task_managements_start_date &&
      task_managements_dead_line
    ) {
      addTask()
      setIsModalOpen(false)
      setFormErrors({
        user_id: '',
        project_id: '',
        priorities: '',
        taskStatus: '',
        task_description: '',
        task_managements_start_date: '',
        task_managements_dead_line: '',
      })
    } else {
      callErrors(
        user_id,
        project_id,
        task_description,
        task_managements_start_date,
        task_managements_dead_line,
      )
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setUserId('')
    setProjectId('')
    setTaskDescription('')
    setPriorities('LOW')
    setTaskManagementStartDate('')
    setTaskManagementDeadLine('')
    setTaskStatus('')
    setFormErrors({
      user_id: '',
      project_id: '',
      priorities: '',
      taskStatus: '',
      task_description: '',
      task_managements_start_date: '',
      task_managements_dead_line: '',
    })
  }

  // Functions for Update Tasks Modal
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
  const showUpdateModal = (task_managements_id) => {
    setEditedTaskId(task_managements_id)
    getTaskById(task_managements_id)
    setIsModalOpenUpdate(true)
  }

  const handleUpdate = () => {
    if (
      user_id &&
      project_id &&
      priorities &&
      taskStatus &&
      task_description &&
      task_managements_start_date &&
      task_managements_dead_line
    ) {
      updateTask(editedTaskId)
      setIsModalOpenUpdate(false)
      setFormErrors({
        user_id: '',
        project_id: '',
        priorities: '',
        taskStatus: '',
        task_description: '',
        task_managements_start_date: '',
        task_managements_dead_line: '',
      })
    } else {
      callErrors(
        user_id,
        project_id,
        task_description,
        task_managements_start_date,
        task_managements_dead_line,
      )
    }
  }

  const updateCancel = () => {
    setIsModalOpenUpdate(false)
    form.resetFields()
    setUserId('')
    setProjectId('')
    setTaskDescription('')
    setPriorities('LOW')
    setTaskManagementStartDate('')
    setTaskManagementDeadLine('')
    setTaskStatus('')
    setFormErrors({
      user_id: '',
      project_id: '',
      priorities: '',
      taskStatus: '',
      task_description: '',
      task_managements_start_date: '',
      task_managements_dead_line: '',
    })
  }

  // Functions for Delete Tasks Modal
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const showDeleteModal = (task_managements_id) => {
    setDeleteTaskId(task_managements_id)
    setIsModalOpenDelete(true)
  }

  const handleDelete = () => {
    deleteTask(deleteTaskId)
    setIsModalOpenDelete(false)
  }

  const deleteCancel = () => {
    setIsModalOpenDelete(false)
  }

  // Functions for Show Task Modal
  const [isModalOpenToTakeAction, setIsModalOpenToTakeAction] = useState(false)
  const openModalToTakeActionAgainstTask = (id) => {
    setIsModalOpenToTakeAction(true)
    getTaskById(id)
  }

  const handleOkToTakeActionAgainstTask = async () => {
    updateTaskStatus(task_id, taskStatus, taskComment)
    setIsModalOpenToTakeAction(false)
    form.resetFields()
    setUserId('')
    setProjectId('')
    setTaskDescription('')
    setPriorities('LOW')
    setTaskManagementStartDate('')
    setTaskManagementDeadLine('')
  }

  const handleCancelToTakeActionAgainstTask = async () => {
    setTaskComment('')
    setIsModalOpenToTakeAction(false)
    form.resetFields()
    setUserId('')
    setProjectId('')
    setTaskDescription('')
    setPriorities('LOW')
    setTaskManagementStartDate('')
    setTaskManagementDeadLine('')
  }

  //------------------
  // APIs
  //------------------

  async function getTasks() {
    try {
      const response = await fetch(`${BASE_URL}/api/getTasks`)
      const data = await response.json()

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
    } catch (error) {
      console.log(error)
    }
  }

  async function getTasksByUserId() {
    await fetch(`${BASE_URL}/api/getTaskByUserId/${selectedUser}`)
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

  const getTaskByProjectId = async () => {
    await fetch(`${BASE_URL}/api/getTaskByProjectId/${selectedProject}`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          const filteredUsersTask = data.task.filter((task) => task.team_lead_id === local.Users.id)
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

  const getTaskByProjectAndUserId = async () => {
    await fetch(`${BASE_URL}/api/getTaskByUserIdAndProjectId/${selectedUser}/${selectedProject}`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          const filteredUsersTask = data.task.filter((task) => task.team_lead_id === local.Users.id)
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

  async function getUsers() {
    let filteredUsers = []
    await fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          filteredUsers = data.Users.filter(
            (user) =>
              user.company_id === local.Users.company_id && (user.role === 5 || user.role === 7),
          )
        }
        setAllUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getProjects() {
    let filteredProjects = []
    await fetch(`${BASE_URL}/api/getproject`)
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
    setIsLoading(true)
    const taskData = {
      user_id,
      team_lead_id: local.Users.id,
      project_id,
      priorites: priorities,
      task_description,
      start_date: task_managements_start_date,
      dead_line: task_managements_dead_line,
    }

    try {
      const response = await fetch(`${BASE_URL}/api/addTasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session_token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        handleButtonAddedClick()
        await getTasks()
        form.resetFields()
        setUserId('')
        setProjectId('')
        setTaskDescription('')
        setPriorities('LOW')
        setTaskManagementStartDate('')
        setTaskManagementDeadLine('')
        setTaskStatus('')
      }
    } catch (error) {
      console.error(error)
      handleButtonAddedFailureClick()
    } finally {
      setIsLoading(false)
    }
  }

  const getTaskById = async (id) => {
    await fetch(`${BASE_URL}/api/getTaskById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.task.user_id)
        setUserName(data.task.name)
        setProjectId(data.task.project_id)
        setProjectName(data.task.project_name)
        setTaskDescription(data.task.task_description)
        setPriorities(data.task.priorites)
        setTaskId(data.task.task_managements_id)
        setTaskStatus(data.task.status)
        setTaskComment(data.task.comment)
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
    setIsLoading(true)
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

    try {
      const response = await fetch(`${BASE_URL}/api/updateTasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session_token}`,
        },
        body: JSON.stringify(taskData),
      })

      if (response.ok) {
        handleButtonUpdateClick()
        await getTasks()
        form.resetFields()
        setUserId('')
        setProjectId('')
        setTaskDescription('')
        setPriorities('LOW')
        setTaskManagementStartDate('')
        setTaskManagementDeadLine('')
      }
    } catch (error) {
      console.error(error)
      handleButtonUpdateFailureClick()
    } finally {
      setIsLoading(false)
    }
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
          handleButtonDeleteClick()
          form.resetFields()
        }
      })
      .catch((error) => {
        console.error(error)
        handleButtonDeleteFailureClick()
      })
  }

  const updateTaskStatus = async (taskId, task_status, task_comment) => {
    let formData = new FormData()
    formData.append('id', taskId)
    formData.append('status', task_status)
    formData.append('comment', task_comment)

    await fetch(`${BASE_URL}/api/updateStatusByUserTask`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        getTasks()
        form.resetFields()
        setTaskComment('')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
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

  //---------
  // Alerts
  //---------

  const [showAlertAdded, setShowAlertAdded] = useState(false)
  const [showAlertAddedFailure, setShowAlertAddedFailure] = useState(false)
  const [showAlertDelete, setShowAlertDelete] = useState(false)
  const [showAlertDeleteFailure, setShowAlertDeleteFailure] = useState(false)
  const [showAlertUpdate, setShowAlertUpdate] = useState(false)
  const [showAlertUpdateFailure, setShowAlertUpdateFailure] = useState(false)

  const handleButtonAddedClick = () => {
    setShowAlertAdded(true)
  }
  const handleButtonAddedFailureClick = () => {
    setShowAlertAddedFailure(true)
  }
  const handleButtonDeleteClick = () => {
    setShowAlertDelete(true)
  }
  const handleButtonDeleteFailureClick = () => {
    setShowAlertDeleteFailure(true)
  }
  const handleButtonUpdateClick = () => {
    setShowAlertUpdate(true)
  }
  const handleButtonUpdateFailureClick = () => {
    setShowAlertUpdateFailure(true)
  }

  const handleCloseAddedAlert = () => {
    setShowAlertAdded(false)
  }
  const handleCloseAddedFailureAlert = () => {
    setShowAlertAddedFailure(false)
  }
  const handleCloseDeleteAlert = () => {
    setShowAlertDelete(false)
  }
  const handleCloseDeleteFailureAlert = () => {
    setShowAlertDeleteFailure(false)
  }
  const handleCloseUpdateAlert = () => {
    setShowAlertUpdate(false)
  }
  const handleCloseUpdateFailureAlert = () => {
    setShowAlertUpdateFailure(false)
  }

  useEffect(() => {
    if (showAlertAdded) {
      const timer = setTimeout(() => {
        setShowAlertAdded(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlertAdded])

  useEffect(() => {
    if (showAlertAddedFailure) {
      const timer = setTimeout(() => {
        setShowAlertAddedFailure(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlertAddedFailure])

  useEffect(() => {
    if (showAlertUpdate) {
      const timer = setTimeout(() => {
        setShowAlertUpdate(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlertUpdate])

  useEffect(() => {
    if (showAlertUpdateFailure) {
      const timer = setTimeout(() => {
        setShowAlertUpdateFailure(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlertUpdateFailure])

  useEffect(() => {
    if (showAlertDelete) {
      const timer = setTimeout(() => {
        setShowAlertDelete(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlertDelete])

  useEffect(() => {
    if (showAlertDeleteFailure) {
      const timer = setTimeout(() => {
        setShowAlertDeleteFailure(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlertDeleteFailure])

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Task Management</h3>
        </div>
        {isLoading ? (
          ''
        ) : (
          <div className="col-md 6">
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Create Task
            </Button>
          </div>
        )}
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
              <Radio.Button value="Completed">Done</Radio.Button>
            </Radio.Group>
          </Space>
        </Box>
        <Form form={form} className="row col-md-6">
          <Box className="col-md-6">
            <Form.Item name="selectUser" hasFeedback>
              <Select
                placeholder="SELECT EMPLOYEE"
                onChange={(value) => setSelectedUser(value)}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
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
              <Select
                placeholder="SELECT PROJECT"
                onChange={(value) => setSelectedProject(value)}
                showSearch
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
          </Box>
        </Form>
        <Box
          className="col-md-3 d-flex justify-content-end"
          sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}
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

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {isPendingTasksTab === true &&
          pendingTasks.length > 0 &&
          currentItemsPending.length > 0 ? (
            <div>
              <div className="row">
                <div className="col-md 6">
                  <h4>To-Do Tasks: {totalItemsPending}</h4>
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
                    {/* <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Details
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell> */}
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
                        <CTableHeaderCell
                          className="text-center"
                          style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                        >
                          {task.project_name}
                        </CTableHeaderCell>
                        {/* <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, width: '200px' }}
                      >
                        {task.task_description}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.priorites}
                      </CTableHeaderCell> */}
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {task.status}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {new Date(task.task_managements_start_date)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .replace(/\//g, '-')}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {new Date(task.task_managements_dead_line)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .replace(/\//g, '-')}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          <IconButton
                            aria-label="View"
                            onClick={() =>
                              openModalToTakeActionAgainstTask(task.task_managements_id)
                            }
                          >
                            <VisibilityIcon htmlColor="#0070ff" />
                          </IconButton>
                          <IconButton aria-label="Update">
                            <EditIcon
                              htmlColor="#28B463"
                              onClick={() => showUpdateModal(task.task_managements_id)}
                            />
                          </IconButton>
                          <IconButton aria-label="Delete">
                            <DeleteIcon
                              htmlColor="#FF0000"
                              onClick={() => showDeleteModal(task.task_managements_id)}
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
                {Array.from(
                  { length: Math.ceil(totalItemsPending / ITEMS_PER_PAGE) },
                  (_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={index + 1 === currentPagePending}
                      onClick={() => handlePendingTaskPageChange(index + 1)}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ),
                )}
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
                  <h4>In-Progress Tasks: {totalItemsInProgress}</h4>
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
                    {/* <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Details
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell> */}
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
                        <CTableHeaderCell
                          className="text-center"
                          style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                        >
                          {task.project_name} - {task.task_managements_id}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {task.name}
                        </CTableHeaderCell>
                        <CTableHeaderCell
                          className="text-center"
                          style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                        >
                          {task.project_name}
                        </CTableHeaderCell>
                        {/* <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, width: '200px' }}
                      >
                        {task.task_description}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.priorites}
                      </CTableHeaderCell> */}
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {task.status}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {new Date(task.task_managements_start_date)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .replace(/\//g, '-')}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {new Date(task.task_managements_dead_line)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .replace(/\//g, '-')}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          <IconButton
                            aria-label="View"
                            onClick={() =>
                              openModalToTakeActionAgainstTask(task.task_managements_id)
                            }
                          >
                            <VisibilityIcon htmlColor="#0070ff" />
                          </IconButton>
                          <IconButton aria-label="Update">
                            <EditIcon
                              htmlColor="#28B463"
                              onClick={() => showUpdateModal(task.task_managements_id)}
                            />
                          </IconButton>
                          <IconButton aria-label="Delete">
                            <DeleteIcon
                              htmlColor="#FF0000"
                              onClick={() => showDeleteModal(task.task_managements_id)}
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
                  <h4>Done Tasks: {totalItemsCompleted}</h4>
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
                    {/* <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Details
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell> */}
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
                        <CTableHeaderCell
                          className="text-center"
                          style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                        >
                          {task.project_name} - {task.task_managements_id}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {task.name}
                        </CTableHeaderCell>

                        <CTableHeaderCell
                          className="text-center"
                          style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                        >
                          {task.project_name}
                        </CTableHeaderCell>
                        {/* <CTableHeaderCell
                        className="text-center"
                        style={{ ...mystyle2, width: '200px' }}
                      >
                        {task.task_description}
                      </CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {task.priorites}
                      </CTableHeaderCell> */}
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {task.status}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {new Date(task.task_managements_start_date)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .replace(/\//g, '-')}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          {new Date(task.task_managements_dead_line)
                            .toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            .replace(/\//g, '-')}
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle2}>
                          <IconButton
                            aria-label="View"
                            onClick={() =>
                              openModalToTakeActionAgainstTask(task.task_managements_id)
                            }
                          >
                            <VisibilityIcon htmlColor="#0070ff" />
                          </IconButton>
                          <IconButton aria-label="Update">
                            <EditIcon
                              htmlColor="#28B463"
                              onClick={() => showUpdateModal(task.task_managements_id)}
                            />
                          </IconButton>
                          <IconButton aria-label="Delete">
                            <DeleteIcon
                              htmlColor="#FF0000"
                              onClick={() => showDeleteModal(task.task_managements_id)}
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
                  disabled={
                    currentPageCompleted === Math.ceil(totalItemsCompleted / ITEMS_PER_PAGE)
                  }
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
      )}
      {/* Modal for Assign Task */}
      <Modal
        title="Assign a New Task for Your Team Member"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <br></br>

        <Form form={form}>
          <div className="form-outline mt-3">
            <label>User</label>
            <Form.Item
              name="user_id"
              validateStatus={formErrors.user_id ? 'error' : ''}
              help={formErrors.user_id}
            >
              <Select
                placeholder="Select Employee"
                onChange={handleUserChange}
                onFocus={handleFocus}
                name="user_id"
                value={user_id}
              >
                {users.map((user) => (
                  <Select.Option value={user.id} key={user.id}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="form-outline mt-3">
            <label>Project</label>
            <Form.Item
              name="project_id"
              validateStatus={formErrors.project_id ? 'error' : ''}
              help={formErrors.project_id}
            >
              <Select
                placeholder="Select Project"
                onChange={handleProjectChange}
                onFocus={handleFocus}
                value={project_id}
              >
                {projects.map((pro) => (
                  <Select.Option value={pro.id} key={pro.id}>
                    {pro.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>

        <div className="form-outline mt-3">
          <label>Task Description</label>
          <input
            type="text"
            name="task_description"
            value={task_description}
            onChange={(e) => setTaskDescription(e.target.value)}
            onFocus={handleFocus}
            className="form-control form-control-lg"
            placeholder="Enter Description"
          />
        </div>
        {formErrors.task_description && (
          <div className="text-danger">{formErrors.task_description}</div>
        )}

        <div className="form-outline mt-3">
          <label>Assigned Date</label>
          <input
            type="date"
            name="task_managements_start_date"
            value={task_managements_start_date}
            onChange={(e) => setTaskManagementStartDate(e.target.value)}
            onFocus={handleFocus}
            className="form-control form-control-lg"
            placeholder="Enter Assigned Date"
          />
        </div>
        {formErrors.task_managements_start_date && (
          <div className="text-danger">{formErrors.task_managements_start_date}</div>
        )}

        <div className="form-outline mt-3">
          <label>End Date</label>
          <input
            type="date"
            name="task_managements_dead_line"
            value={task_managements_dead_line}
            onChange={(e) => setTaskManagementDeadLine(e.target.value)}
            onFocus={handleFocus}
            className="form-control form-control-lg"
            placeholder="Enter Dead Line"
          />
        </div>
        {formErrors.task_managements_dead_line && (
          <div className="text-danger">{formErrors.task_managements_dead_line}</div>
        )}

        <div className="form-outline mt-3">
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
        title="Update an Already Assigned Task for Your Team Member"
        open={isModalOpenUpdate}
        onOk={handleUpdate}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={updateCancel}
        maskClosable={false}
      >
        <br />

        <Form form={form}>
          <div className="form-outline mt-3">
            <label>User</label>
            <Form.Item validateStatus={formErrors.user_id ? 'error' : ''} help={formErrors.user_id}>
              <Select
                placeholder="Select Employee"
                onChange={handleUserChange}
                onFocus={handleFocus}
                value={user_id}
              >
                {users.map((user) => (
                  <Select.Option value={user.id} key={user.id}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="form-outline mt-3">
            <label>Project</label>
            <Form.Item
              validateStatus={formErrors.project_id ? 'error' : ''}
              help={formErrors.project_id}
            >
              <Select
                placeholder="Select Project"
                onChange={handleProjectChange}
                value={project_id}
              >
                {projects.map((pro) => (
                  <Select.Option value={pro.id} key={pro.id}>
                    {pro.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>

        <div className="form-outline mt-3">
          <label>Task Description</label>
          <input
            type="text"
            name="task_description"
            value={task_description}
            onChange={(e) => setTaskDescription(e.target.value)}
            onFocus={handleFocus}
            className="form-control form-control-lg"
            placeholder="Enter Description"
          />
        </div>
        {formErrors.task_description && (
          <div className="text-danger">{formErrors.task_description}</div>
        )}

        <div className="form-outline mt-3">
          <label>Assigned Date</label>
          <input
            type="date"
            name="task_managements_start_date"
            value={task_managements_start_date}
            onChange={(e) => setTaskManagementStartDate(e.target.value)}
            onFocus={handleFocus}
            className="form-control form-control-lg"
            placeholder="Enter Assigned Date"
          />
        </div>
        {formErrors.task_managements_start_date && (
          <div className="text-danger">{formErrors.task_managements_start_date}</div>
        )}

        <div className="form-outline mt-3">
          <label>End Date</label>
          <input
            type="date"
            name="task_managements_dead_line"
            value={task_managements_dead_line}
            onChange={(e) => setTaskManagementDeadLine(e.target.value)}
            onFocus={handleFocus}
            className="form-control form-control-lg"
            placeholder="Enter Dead Line"
          />
        </div>
        {formErrors.task_managements_dead_line && (
          <div className="text-danger">{formErrors.task_managements_dead_line}</div>
        )}

        <div className="form-outline mt-3">
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

      <Modal
        title={<div style={{ textAlign: 'center' }}>Task Details</div>}
        open={isModalOpenToTakeAction}
        centered
        onOk={handleOkToTakeActionAgainstTask}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancelToTakeActionAgainstTask}
        maskClosable={false}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '5px 20px' }}>
              <div>
                <b>Details:</b>
                <p>{task_description}</p>
              </div>
              <div>
                <b>Projects:</b>
                <p>{project_name}</p>
              </div>
              <div>
                <b>Priority:</b>
                <p>{priorities}</p>
              </div>
              <div>
                <b>Assigned To:</b>
                <p>{user_name}</p>
              </div>
              <div>
                <b>Assigned Date:</b>
                <p>{moment(task_managements_start_date).format('DD-MM-YYYY')}</p>
              </div>
              <div>
                <b>Completion Dead Line:</b>
                <p>{moment(task_managements_dead_line).format('DD-MM-YYYY')}</p>
              </div>
            </div>

            <hr />
            <div style={{ width: '100%' }}>
              <div style={{ marginBottom: '10px' }}>
                <label>Status:</label>
                <Form.Item>
                  <Select
                    style={{ width: '100%' }}
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
              <div>
                <label>Add Comments Related to Task:</label>
                <textarea
                  rows="2"
                  style={{ width: '100%' }}
                  type="text"
                  className="form-control"
                  placeholder="Add Comments Related to Task"
                  onChange={(event) => setTaskComment(event.target.value)}
                  value={
                    taskComment === (undefined || null || 'null' || 'undefined') ? '' : taskComment
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Are you sure you want to delete?"
        open={isModalOpenDelete}
        onOk={handleDelete}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={deleteCancel}
      ></Modal>

      {showAlertAdded && (
        <Alert onClose={handleCloseAddedAlert} severity="success" style={alertStyle}>
          Task Added Successfully
        </Alert>
      )}

      {showAlertAddedFailure && (
        <Alert onClose={handleCloseAddedFailureAlert} severity="error" style={alertStyle}>
          Failed to Add Task
        </Alert>
      )}

      {showAlertDelete && (
        <Alert onClose={handleCloseDeleteAlert} severity="success" style={alertStyle}>
          Task Deleted Successfully
        </Alert>
      )}

      {showAlertDeleteFailure && (
        <Alert onClose={handleCloseDeleteFailureAlert} severity="error" style={alertStyle}>
          Failed to Delete Task
        </Alert>
      )}

      {showAlertUpdate && (
        <Alert onClose={handleCloseUpdateAlert} severity="success" style={alertStyle}>
          Task Updated Successfully
        </Alert>
      )}

      {showAlertUpdateFailure && (
        <Alert onClose={handleCloseUpdateFailureAlert} severity="error" style={alertStyle}>
          Failed to Update Task
        </Alert>
      )}
    </>
  )
}

export default TaskAssignment
