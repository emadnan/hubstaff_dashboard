import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const BASE_URL = process.env.REACT_APP_BASE_URL

const TaskAssignmentUserSide = () => {
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

  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const local = JSON.parse(localStorage.getItem('user-info'))
  const session_token = session.token

  //States
  const [user_id, setUserId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [task_description, setTaskDescription] = useState('')
  const [start_date, setStartDate] = useState('')
  const [dead_line, setDeadLine] = useState('')

  const [users, setAllUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  var filteredUsers = []

  // Component is initially mounted
  useEffect(() => {
    getTasks()
  }, [])

  //Get calls handling
  const handleUserChange = (value) => {
    setUserId(value)
  }

  const handleProjectChange = (value) => {
    setProjectId(value)
  }

  function getTasks() {
    fetch(`${BASE_URL}/api/getTasks`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data in getTasks: ', data)
        if (local.Users.role === 5) {
          filteredUsers = data.task.filter((user) => user.user_id === local.Users.id)
        }
        setTasks(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Assigned Tasks</h3>
        </div>
      </div>
      <br />
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
              Assigned by
            </CTableHeaderCell>
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
        </CTableHead>
        <CTableBody>
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
                {task.team_lead_details.name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {new Date(task.start_date).toLocaleDateString()}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {new Date(task.dead_line).toLocaleDateString()}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                <IconButton aria-label="Update">
                  <EditIcon
                    htmlColor="#28B463"
                    //   onClick={() => showUpdateModal(task.id)}
                  />
                </IconButton>
                <IconButton aria-label="Delete">
                  <DeleteIcon
                    htmlColor="#FF0000"
                    //    onClick={() => deleteTask(task.id)}
                  />
                </IconButton>
              </CTableHeaderCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default TaskAssignmentUserSide
