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
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import moment from 'moment'
import { Modal, Button, Form, Select, Radio, Space } from 'antd'
import Box from '@mui/material/Box'

const BASE_URL = process.env.REACT_APP_BASE_URL

const TaskAssignmentUserSide = () => {
  const ITEMS_PER_PAGE = 10
  //CSS Styling
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

  const local = JSON.parse(localStorage.getItem('user-info'))

  //States
  const [user_id, setUserId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [task_id, setTaskId] = useState()
  const [project_name, setProjectName] = useState('')
  const [user_name, setUserName] = useState('')
  const [task_description, setTaskDescription] = useState('')
  const [teamlead_name, setTeamleadName] = useState()
  const [start_date, setStartDate] = useState('')
  const [dead_line, setDeadLine] = useState('')
  const [taskPriority, setTaskPriority] = useState()
  const [taskStatus, setTaskStatus] = useState()
  const [taskComment, setTaskComment] = useState()

  const [isPendingTasksTab, setIsPendingTasksTab] = useState(true)
  const [isInProgressTasksTab, setIsInProgressTasksTab] = useState(false)
  const [isCompletedTaskTab, setIsCompletedTasksTab] = useState(false)

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

  const [projects, setProjects] = useState([])

  let [form] = Form.useForm()

  // Component is initially mounted
  useEffect(() => {
    getTasks()
    getProjects()
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

  const getProjects = async () => {
    let filteredProjects = []
    await fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 5) {
          filteredProjects = data.projects.filter(
            (project) => project.company_id === local.Users.company_id,
          )
          setProjects(filteredProjects)
        }
      })
      .catch((error) => console.log(error))
  }

  // Functions for Show Task Modal
  const [isModalOpenToTakeAction, setIsModalOpenToTakeAction] = useState(false)
  const openModalToTakeActionAgainstTask = (id) => {
    setIsModalOpenToTakeAction(true)
    setTaskId(id)
    getTasksById(id)
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
        setTaskComment('')
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  async function getTasks() {
    await fetch(`${BASE_URL}/api/getTasks`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 5) {
          const filteredUsersTask = data.task.filter((user) => user.user_id === local.Users.id)
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

  const getTasksById = async (taskId) => {
    await fetch(`${BASE_URL}/api/getTaskById/${taskId}`)
      .then((response) => response.json())
      .then((data) => {
        setProjectId(data.task.project_id)
        setProjectName(data.task.project_name)
        setUserId(data.task.user_id)
        setUserName(data.task.user_name)
        setTaskDescription(data.task.task_description)
        setTaskPriority(data.task.priorites)
        setTeamleadName(data.task.team_lead_details.name)
        setStartDate(data.task.task_managements_start_date)
        setDeadLine(data.task.task_managements_dead_line)
        setTaskStatus(data.task.status)
        setTaskComment(data.task.comment)
      })
  }

  const getTaskByProjectChange = async (projectId) => {
    await fetch(`${BASE_URL}/api/getTaskByProjectId/${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 5) {
          const filteredUsersTask = data.task.filter((user) => user.user_id === local.Users.id)
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

  const clearFilters = async () => {
    form.resetFields()
    getTasks()
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

  const handleOkToTakeActionAgainstTask = async () => {
    updateTaskStatus(task_id, taskStatus, taskComment)
    setIsModalOpenToTakeAction(false)
  }

  const handleCancelToTakeActionAgainstTask = async () => {
    setTaskComment('')
    setIsModalOpenToTakeAction(false)
  }

  const handleFilterTaskOnProjectChange = (projectId) => {
    getTaskByProjectChange(projectId)
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

  // Handle page change
  const handlePendingTaskPageChange = (pageNumber) => {
    setCurrentPagePending(pageNumber)
  }

  // Handle page change
  const handleInProgressTaskPageChange = (pageNumber) => {
    setCurrentPageInProgress(pageNumber)
  }

  // Handle page change
  const handleCompletedTaskPageChange = (pageNumber) => {
    setCurrentPageCompleted(pageNumber)
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Assigned Tasks: {totalItemsPending + totalItemsInProgress + totalItemsCompleted}</h3>
        </div>
      </div>
      <hr />
      <div className="row">
        <Box className="col-md-4">
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
        <Box className="col-md-4">
          <Form form={form}>
            <Form.Item name="select" hasFeedback>
              <Select placeholder="SELECT PROJECT" onChange={handleFilterTaskOnProjectChange}>
                {projects.map((project) => (
                  <Select.Option value={project.id} key={project.id}>
                    {project.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Box>
        <Box className="col-md-4">
          <Button type="default" onClick={clearFilters}>
            Clear Filter
          </Button>
        </Box>
      </div>
      <div>
        {isPendingTasksTab === true && currentItemsPending.length > 0 ? (
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
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
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
                {currentItemsPending.map((task, index) => (
                  <CTableRow key={task.task_managements_id}>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name} - {task.task_managements_id}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {task.team_lead_details.name}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name}
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
                        onClick={() => openModalToTakeActionAgainstTask(task.task_managements_id)}
                      >
                        <VisibilityIcon htmlColor="#0070ff" />
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

        {isInProgressTasksTab === true && currentItemsInProgress.length > 0 ? (
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
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
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
                {currentItemsInProgress.map((task, index) => (
                  <CTableRow key={task.task_managements_id}>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name} - {task.task_managements_id}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {task.team_lead_details.name}
                    </CTableHeaderCell>

                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name}
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
                        onClick={() => openModalToTakeActionAgainstTask(task.task_managements_id)}
                      >
                        <VisibilityIcon htmlColor="#0070ff" />
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

        {isCompletedTaskTab === true && currentItemsCompleted.length > 0 ? (
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
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
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
                {currentItemsCompleted.map((task, index) => (
                  <CTableRow key={task.task_managements_id}>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name} - {task.task_managements_id}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {task.team_lead_details.name}
                    </CTableHeaderCell>

                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name}
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
                        onClick={() => openModalToTakeActionAgainstTask(task.task_managements_id)}
                      >
                        <VisibilityIcon htmlColor="#0070ff" />
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
      <div>
        <Modal
          title="Task Details"
          open={isModalOpenToTakeAction}
          centered
          onOk={handleOkToTakeActionAgainstTask}
          okButtonProps={{ style: { background: 'blue' } }}
          onCancel={handleCancelToTakeActionAgainstTask}
          maskClosable={false}
        >
          <h3>
            Task : <b>{task_description}</b>
          </h3>
          <p>
            Task Belongs to the Projects: <b>{project_name}</b>
          </p>
          <p>
            Task Priority: <b>{taskPriority}</b>
          </p>
          <p>
            Task Assigned By: <b>{teamlead_name}</b>
          </p>
          <p>
            Task Assigned Date: <b>{moment(start_date).format('DD-MM-YYYY')}</b>
          </p>
          <p>
            Task Completion Dead Line: <b>{moment(dead_line).format('DD-MM-YYYY')}</b>
          </p>

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
            <label>Add Comments Releted to Task</label>
            <textarea
              rows="2"
              type="text"
              className="form-control"
              placeholder="Add Comments Releted to Task"
              onChange={(event) => setTaskComment(event.target.value)}
              value={taskComment != undefined ? taskComment : ''}
            />
          </div>
        </Modal>
      </div>
    </>
  )
}

export default TaskAssignmentUserSide
