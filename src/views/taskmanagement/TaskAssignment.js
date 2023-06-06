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
  const [start_date, setStartDate] = useState('')
  const [dead_line, setDeadLine] = useState('')

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
    setStartDate(null)
    setDeadLine(null)
  }

  // For Radio Buttons
  const radioOptions = [
    { value: 'LOW', color: 'blue' },
    { value: 'MEDIUM', color: 'green' },
    { value: 'HIGH', color: 'red' },
  ]
  const [radioValue, setRadioValue] = useState('LOW')
  const onChangeRadio = (e) => {
    console.log('Selected Radio Button:', e.target.value)
    setRadioValue(e.target.value)
  }

  // Get & Set Selected Task ID :
  const [editedTaskId, setEditedTaskId] = useState()
  // Functions for Assign Tasks Modal
  const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false)
  const showUpdateModal = (id) => {
    console.log('id: ', id)
    setEditedTaskId(id)
    getTaskById(id)
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
    setStartDate(null)
    setDeadLine(null)
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
    var formData = new FormData()
    formData.append('user_id', user_id)
    formData.append('team_lead_id', local.Users.id)
    formData.append('project_id', project_id)
    formData.append('task_description', task_description)
    formData.append('start_date', start_date)
    formData.append('dead_line', dead_line)
    await fetch(`${BASE_URL}/api/addTasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session_token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          getTasks()
          // handleButtonClick3();
          // getMembers()
        } else {
          // handleButtonClick4();
        }
        setUserId('')
        setProjectId('')
        setTaskDescription('')
        setStartDate('')
        setDeadLine('')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const getTaskById = async (id) => {
    fetch(`${BASE_URL}/api/getTaskById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserId(data.task[0].user_id)
        setProjectId(data.task[0].project_id)
        setTaskDescription(data.task[0].task_description)
        const formattedStartDate = moment(data.task[0].start_date).format('YYYY-MM-DD')
        setStartDate(formattedStartDate)
        const formattedDeadLine = moment(data.task[0].dead_line).format('YYYY-MM-DD')
        setDeadLine(formattedDeadLine)
      })
      .catch((error) => console.log(error))
  }

  const updateTask = async (newid) => {
    let formData = new FormData()
    formData.append('id', newid)
    formData.append('user_id', user_id)
    formData.append('team_lead_id', local.Users.id)
    formData.append('project_id', project_id)
    formData.append('task_description', task_description)
    formData.append('start_date', start_date)
    formData.append('dead_line', dead_line)
    await fetch(`${BASE_URL}/api/updateTasks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session_token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log('Task Updated Successfully')
          getTasks()
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
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Project
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Start Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Dead Line
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Task Details
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>

          {tasks.map(
            (task, index) => (
              console.log('tasks: ', task),
              (
                <CTableRow key={task.id}>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {index + 1}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {task.user_id}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {task.project_id}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {new Date(task.start_date).toLocaleDateString()}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {new Date(task.dead_line).toLocaleDateString()}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {task.task_description}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton aria-label="Update">
                      <EditIcon htmlColor="#28B463" onClick={() => showUpdateModal(task.id)} />
                    </IconButton>
                    <IconButton aria-label="Delete">
                      <DeleteIcon htmlColor="#FF0000" onClick={() => deleteTask(task.id)} />
                    </IconButton>
                  </CTableHeaderCell>
                </CTableRow>
              )
            ),
          )}
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
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
              />
            </div>

            <div className="form-outline mb-3">
              <label>End Date</label>
              <input
                type="date"
                value={dead_line}
                onChange={(e) => setDeadLine(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Dead Line"
              />
            </div>

            <div className="form-outline mb-3">
              <div>
                <b>Select Priority of Task</b>
              </div>
              <Radio.Group onChange={onChangeRadio} value={radioValue}>
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
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
              />
            </div>

            <div className="form-outline mb-3">
              <label>End Date</label>
              <input
                type="date"
                value={dead_line}
                onChange={(e) => setDeadLine(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Dead Line"
              />
            </div>
          </Modal>
        </CTableBody>
      </CTable>
    </>
  )
}

export default TaskAssignment
