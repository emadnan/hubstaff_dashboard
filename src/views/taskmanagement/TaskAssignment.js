import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Modal, Button, Form, Select, Radio } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import moment from 'moment'

const BASE_URL = process.env.REACT_APP_BASE_URL

function TaskAssignment() {
  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const local = JSON.parse(localStorage.getItem('user-info'))
  const session_token = session.token

  const [user_id, setUserId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [task_description, setTaskDescription] = useState('')
  const [task_managements_start_date, setTaskManagementStartDate] = useState('')
  const [task_managements_dead_line, setTaskManagementDeadLine] = useState('')

  const [users, setAllUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  var filteredUsers = []

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

  //Get calls handling
  const handleUserChange = (value) => {
    setUserId(value)
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
  }

  function getTasks() {
    fetch(`${BASE_URL}/api/getTasks`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          filteredUsers = data.task.filter((user) => user.team_lead_id === local.Users.id)
        }
        setTasks(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getUsers() {
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
    fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
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
        console.log('data: ', data)
        setUserId(data.task.user_id)
        setProjectId(data.task.project_id)
        setTaskDescription(data.task.task_description)
        setPriorities(data.task.priorites)
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
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Task Assignment table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr No.
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Name
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
            {/* <CTableHeaderCell className="text-center" style={mystyle}>
              Task Comments
            </CTableHeaderCell> */}
            <CTableHeaderCell className="text-center" style={mystyle}>
              Start Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Dead Line
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>

          {tasks.map((task, index) => (
            <CTableRow key={task.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {index + 1}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {task.name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {task.project_name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {task.task_description}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {task.priorites}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {task.status}
              </CTableHeaderCell>
              {/* <CTableHeaderCell className="text-center" style={mystyle2}>
                {task.comment == null ? '-' : task.comment}
              </CTableHeaderCell> */}
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {moment(task.task_managements_start_date).format('DD-MM-YYYY')}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {moment(task.task_managements_dead_line).format('DD-MM-YYYY')}
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
        </CTableHead>
        <CTableBody>
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
                <Select
                  placeholder="Select Departments"
                  onChange={handleUserChange}
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

            <div className="form-outline mb-3">
              <label>Project</label>
              <Form.Item>
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
              <label>Start Date</label>
              <input
                type="date"
                value={task_managements_start_date}
                onChange={(e) => setTaskManagementStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
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
                <Select
                  placeholder="Select Departments"
                  onChange={handleUserChange}
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

            <div className="form-outline mb-3">
              <label>Project</label>
              <Form.Item>
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
              <label>Start Date</label>
              <input
                type="date"
                value={task_managements_start_date}
                onChange={(e) => setTaskManagementStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
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
        </CTableBody>
      </CTable>
    </>
  )
}

export default TaskAssignment
