import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react'
import { Button, Form, Select } from 'antd'
const BASE_URL = process.env.REACT_APP_BASE_URL

const AssignedProjects = () => {
  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))

  // CSS Stylings
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

  //Array declarations for API calls
  const [assigns, setAssigns] = useState([])
  const [users, setUsers] = useState([])
  const [getstreams, setStreams] = useState([])
  const [projects, setProjects] = useState([])

  var filteredUsers = []

  //Initial rendering through useEffect
  useEffect(() => {
    getAssigns()
    getUsersList()
    getStreams()
    getProjectList()
  }, [])

  // Get API call
  function getAssigns() {
    fetch(`${BASE_URL}/api/get_assign_projects`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.Project_Assigns
        } else if (local.Users.role === 3) {
          filteredUsers = data.Project_Assigns.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredUsers = data.Project_Assigns.filter(
            (user) => user.assign_projects_user_id === local.Users.user_id,
          )
        }
        setAssigns(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  const getUsersList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/get_users`)
      const data = await response.json()

      let filteredUsers = []

      if (local.Users.role === 1) {
        filteredUsers = data.Users
      } else if (local.Users.role === 3) {
        filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
      } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
        filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id)
      }

      setUsers(filteredUsers)
    } catch (error) {
      console.log(error)
    }
  }

  // Get API call
  function getStreams() {
    fetch(`${BASE_URL}/api/get-streams`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.Streams
        } else if (local.Users.role === 3) {
          filteredUsers = data.Streams.filter((user) => user.company_id === local.Users.company_id)
        }
        setStreams(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getProjectList() {
    fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.projects
        } else if (local.Users.role === 3) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  let [form] = Form.useForm()

  const [searchedUser, setSearchedUser] = useState('')
  const [searchedStream, setSearchedStream] = useState('')
  const [searchedProject, setSearchedProject] = useState('')

  const handleUserSearch = (value) => {
    setSearchedUser(value)
  }

  const handleStreamSearch = (value) => {
    setSearchedStream(value)
  }

  const handleProjectSearch = (value) => {
    setSearchedProject(value)
  }

  const clearFilter = () => {
    form.resetFields()
    setSearchedUser('')
    setSearchedStream('')
    setSearchedProject('')
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Assigned Project</h3>
        </div>
      </div>

      <div className="row mt-2 mb-2 justify-content-between">
        <Form form={form} className="d-flex w-100">
          <div className="col-md-3">
            {local.Users.role === 1 ||
              (local.Users.role === 3 && (
                <div className="d-flex align-items-center">
                  <Form.Item name="projectSelect" hasFeedback style={{ width: '100%' }}>
                    <Select
                      showSearch
                      placeholder="Select Project Name"
                      name="project_name"
                      onChange={handleProjectSearch}
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
              ))}
          </div>

          <div className="col-md-3">
            {local.Users.role === 1 ||
              (local.Users.role === 3 && (
                <div className="ml-2 d-flex align-items-center">
                  <Form.Item name="streamSelect" hasFeedback style={{ width: '100%' }}>
                    <Select
                      showSearch
                      placeholder="Select Stream Name"
                      name="stream_name"
                      onChange={handleStreamSearch}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {getstreams.map((getstream) => (
                        <Select.Option value={getstream.id} key={getstream.id}>
                          {getstream.stream_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              ))}
          </div>

          <div className="col-md-3">
            {local.Users.role === 1 ||
              (local.Users.role === 3 && (
                <div className="ml-2 d-flex align-items-center">
                  <Form.Item name="userSelect" hasFeedback style={{ width: '100%' }}>
                    <Select
                      showSearch
                      name="user_name"
                      placeholder="Select User Name"
                      onChange={handleUserSearch}
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
                </div>
              ))}
          </div>

          <div className="col-md-3">
            {local.Users.role === 1 ||
              (local.Users.role === 3 && (
                <div className="d-flex align-items-center">
                  <Button type="default" onClick={clearFilter} className="ml-2">
                    Clear Filter
                  </Button>
                </div>
              ))}
          </div>
        </Form>
      </div>

      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Users table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Project Name
            </CTableHeaderCell>
            {local.Users.role === 1 || local.Users.role === 3 ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Users
              </CTableHeaderCell>
            ) : null}
            <CTableHeaderCell className="text-center" style={mystyle}>
              Stream Name
            </CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}
          {assigns
            .filter((assign) => {
              if (searchedUser !== '') {
                return assign.user_id === searchedUser
              }
              return true
            })
            .filter((assign) => {
              if (searchedProject !== '') {
                return assign.project_id === searchedProject
              }
              return true
            })
            .filter((assign) => {
              if (searchedStream !== '') {
                return assign.stream_id === searchedStream
              }
              return true
            })
            .map((assign, index) => (
              <CTableRow key={assign.id}>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {index + 1}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {assign.project_name}
                </CTableHeaderCell>
                {(local.Users.role === 1) | (local.Users.role === 3) ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {assign.name}
                  </CTableHeaderCell>
                ) : null}
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {assign.stream_name}
                </CTableHeaderCell>
              </CTableRow>
            ))}
        </CTableHead>
        <CTableBody></CTableBody>
      </CTable>
    </>
  )
}

export default AssignedProjects
