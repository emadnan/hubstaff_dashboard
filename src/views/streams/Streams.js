import { React, useState, useEffect } from 'react'
import { Modal, Button, Form, Select, Divider, Checkbox } from 'antd'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CreateIcon from '@mui/icons-material/Create'
import Alert from '@mui/material/Alert'
import ChecklistIcon from '@mui/icons-material/Checklist'
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import moment from 'moment'
const BASE_URL = process.env.REACT_APP_BASE_URL

function Streams() {
  // Variable declarations
  const [stream_name, setStreamName] = useState('')
  const [project_id, setProjectId] = useState('')
  const [start_time, setStartTime] = useState('')
  const [end_time, setEndTime] = useState('')
  const [formErrors, setFormErrors] = useState({
    stream_name,
  })
  const [assignType, setAssignType] = useState('')
  const [assignUserId, setAssignUserId] = useState('')
  const [assignStreamId, setAssignStreamId] = useState('')
  const [successmessage, setSuccessMessage] = useState('')
  const [failuremessage, setFailureMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [user_id, setUserId] = useState('')

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Stream')
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_Stream')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_Stream')
  const isAssignStreamEnabled = perm.some((item) => item.name === 'Assign_Stream')

  // CSS Stylings
  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
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
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const [getstreams, setStreams] = useState([])
  const [bystream, setStreamById] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [typeassigningdata, setTypeAssigningData] = useState([])
  const [useravailability, setUserAvailability] = useState([])
  var filteredUsers = []
  let [form] = Form.useForm()

  //Initial rendering through useEffect
  useEffect(() => {
    getStreams()
    getProjects()
    getUsers()
    getStreamHasUsers()
  }, [])

  // Get API call
  function getStreams() {
    fetch(`${BASE_URL}/api/get-streams`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Streams
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Streams.filter((user) => user.company_id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'ProjectManager_Data')) {
          filteredUsers = data.Streams.filter((user) => user.user_id === local.Users.user_id)
        }
        setStreams(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getStreamById(id) {
    fetch(`${BASE_URL}/api/getStreamById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setStreamById(data.streams)
        setStreamName(data.streams[0].stream_name)
        setProjectId(data.streams[0].project_id)
        const formattedStartTime = moment(data.streams[0].start_time).format('YYYY-MM-DD')
        setStartTime(formattedStartTime)
        const formattedEndTime = moment(data.streams[0].end_time).format('YYYY-MM-DD')
        setEndTime(formattedEndTime)
      })
      .catch((error) => console.log(error))
  }

  function getProjects() {
    fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.projects
        } else if (perm.some((item) => item.name === 'Company_Data') || perm.some((item) => item.name === 'ProjectManager_Data')) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        } else if (perm.some((item) => item.name === 'User_Data')) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
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
        }
        setUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getUsersAvailability(id) {
    fetch(`${BASE_URL}/api/getUserAvailability/${id}`)
      .then((response) => response.json())
      .then((data) => {
          filteredUsers = data.Users_With_Assigning_Type
          setUserAvailability(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getHasUsers(id) {
    fetch(`${BASE_URL}/api/getUsersByStreamsId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const temp_array = data.Streams.map((element) => element.user_id)
        setHasUsers(temp_array)
      })
      .catch((error) => console.log(error))
  }

  async function getStreamHasUsers(id) {
    await fetch(`${BASE_URL}/api/getUsersByStreamsId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const temp_array = data.Streams
        setStreamHasUsers(temp_array)
      })
      .catch((error) => console.log(error))
  }

  async function getAssignedType(id) {
    await fetch(`${BASE_URL}/api/getAssignedTypeId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTypeAssigningData(data.Assigned_Type_Id)
        setAssignStreamId(data.Assigned_Type_Id.stream_id)
        setAssignType(data.Assigned_Type_Id.assigning_type_id)
        setAssignUserId(data.Assigned_Type_Id.user_id)
      })
      .catch((error) => console.log(error))
  }

  // Functions for Add Stream Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (stream_name !== '') {
      addStream()
      setIsModalOpen(false)
      setStreamName('')
      form.resetFields()
      setStreamName('')
      setFormErrors({
        stream_name: '',
      })
    } else {
      callErrors(stream_name)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setStreamName('')
    setFormErrors({
      stream_name: '',
    })
  }

  const callErrors = (stream_name) => {
    const errors = {}
    if (!stream_name) {
      errors.stream_name = 'Enter the Stream Name'
    }

    setFormErrors(errors)
  }

  // Functions for Update Stream Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    getStreamById(id)
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    if (stream_name !== '') {
      updateStream(isModalOpen2)
      setIsModalOpen2(false)
      setStreamName('')
      form.resetFields()
      setStreamName('')
      setFormErrors({
        stream_name: '',
      })
    } else {
      callErrors(stream_name)
    }
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
    form.resetFields()
    setStreamName('')
    setFormErrors({
      stream_name: '',
    })
  }

  const handleProjectChange = (value) => {
    setProjectId(value)
  }

  // Functions for Delete Stream Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    deleteStream(isModalOpen3)
    setIsModalOpen3(false)
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
  }

  // Functions for Assign Stream Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    getHasUsers(id)
    getUsersAvailability(local.Users.company_id)
    setIsModalOpen4(id)
  }

  const handleOk4 = () => {
    assignUsers(isModalOpen4)
    setIsModalOpen4(false)
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
  }

  // Functions for Assigned Users Modal
  const [isModalOpen5, setIsModalOpen5] = useState(false)
  const showModal5 = (id) => {
    getStreamHasUsers(id)
    setIsModalOpen5(id)
  }

  const handleOk5 = () => {
    setIsModalOpen5(false)
  }

  const handleCancel5 = () => {
    setIsModalOpen5(false)
  }

  // Functions for Change Assign Type Modal
  const [isModalOpen6, setIsModalOpen6] = useState(false)
  const showModal6 = (id) => {
    getAssignedType(id)
    setIsModalOpen6(id)
  }

  const handleOk6 = () => {
    assigningtype(isModalOpen6)
    setIsModalOpen6(false)
    setAssignType('');
  }

  const handleCancel6 = () => {
    setIsModalOpen6(false);
    setAssignType('');
  }

  // Functions for Add Stream Success
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

  // Functions for Add Stream Failure
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

  // Functions for Delete Stream Success
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

  // Functions for Delete Stream Failure
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

  // Functions for Update Stream Success
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

  // Functions for Update Stream Failure
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

  // Functions for Assigning Success Message 
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

  // Functions for Assigning Failure Message 
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

  // Add API call
  async function addStream() {
    // let addstream = { stream_name, company_id: local.Users.company_id, project_id, start_time, end_time }
    let addstream = { stream_name, company_id: local.Users.company_id, user_id: local.Users.user_id }

    await fetch(`${BASE_URL}/api/addStreams`, {
      method: 'POST',
      body: JSON.stringify(addstream),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getStreams()
          handleButtonClick1()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete API call
  async function deleteStream(newid) {
    await fetch(`${BASE_URL}/api/deleteStream`, {
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
          getStreams()
          handleButtonClick3()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update API call
  async function updateStream(newid) {
    await fetch(`${BASE_URL}/api/updateStream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        company_id: local.Users.company_id,
        stream_name: stream_name,
        user_id: local.Users.user_id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getStreams()
          handleButtonClick5()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  //Assign Users API call
  async function assignUsers(newid) {
    const response = await fetch(`${BASE_URL}/api/assignStreamsToUsers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream_id: newid,
        user_ids: selectedUsers,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const msg = data.message;
      setSuccessMessage(msg);
      handleButtonClick7();
    } else {
      const data = await response.json();
      const msg = data.message;
      setFailureMessage(msg);
      handleButtonClick8();
    }
  }

  async function assigningtype(newid) {
    const response = await fetch(`${BASE_URL}/api/updateAssignedStreamType`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream_id: assignStreamId,
        user_id: assignUserId,
        assigning_type_id: assignType,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const msg = data.message;
      setSuccessMessage(msg);
      handleButtonClick7();
    } else {
      const data = await response.json();
      const msg = data.message;
      setFailureMessage(msg);
      handleButtonClick8();
    }
  }

  const [searchedStream, setSearchedStream] = useState('')
  const [selectedUsers, setSelectedUsers] = useState([])
  const [hasUsers, setHasUsers] = useState([])
  const [streamHasUsers, setStreamHasUsers] = useState([])

  const handleAssigningType = (value) => {
    setAssignType(value)
  }

  const handleStreamSearch = (value) => {
    setSearchedStream(value)
  }

  const handleUserSelect = (value) => {
    setSelectedUser(value)
  }

  const clearFilter = () => {
    form.resetFields()
    setSearchedStream('')
    setSelectedUser('')
  }

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  useEffect(() => {
    setSelectedUsers(hasUsers)
  }, [hasUsers])

  //Function for checkbox handling
  const handleSelectUser = (e, userId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Streams</h3>
        </div>
        <div className="col-md 6">
          {/* Add Roles Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add Stream
            </Button>
          ) : null
          }
        </div>
      </div>
      <div className="row mt-2 mb-2 justify-content-between">
        <div className="col-md-4">
          {perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data') ? (
            <div className="d-flex">
              <Form form={form} style={{ width: '100%' }}>
                <Form.Item name="select" hasFeedback>
                  <Select
                    placeholder="Enter Stream Name"
                    onChange={handleStreamSearch}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: '100%' }}
                  >
                    {getstreams.map((stream) => (
                      <Select.Option value={stream.id} key={stream.id}>
                        {stream.stream_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
              <Button type="default" onClick={clearFilter} className="ml-2">
                Clear Filter
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Users table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Stream Name
            </CTableHeaderCell>
            {/* <CTableHeaderCell className="text-center" style={mystyle}>
              Project Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Start Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              End Date
            </CTableHeaderCell> */}
            {isEditButtonEnabled || isDeleteButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Actions
              </CTableHeaderCell>
            ) : null
            }
            {/* {isAssignStreamEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Assign Stream
              </CTableHeaderCell>
            ) : null
            } */}
            {/* <CTableHeaderCell className="text-center" style={mystyle}>
              Assign Type
            </CTableHeaderCell> */}
          </CTableRow>

          {/* Get API Stream */}
          {getstreams
            .filter((stream) => {
              // Apply Stream filter
              if (searchedStream !== '') {
                return stream.id === searchedStream
              }
              return true
            })
            .map((stream, index) => {
              const starttime = moment(stream.start_time).format('DD-MM-YYYY')
              const endtime = moment(stream.end_time).format('DD-MM-YYYY')
              return (
                <CTableRow key={index}>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {index + 1}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {stream.stream_name}
                  </CTableHeaderCell>
                  {/* <CTableHeaderCell className="text-center" style={mystyle2}>
                    {stream.project_details?.project_name}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {starttime}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {endtime}
                  </CTableHeaderCell> */}
                  {isEditButtonEnabled || isDeleteButtonEnabled ? (
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {isEditButtonEnabled ? (
                        <IconButton aria-label="update" onClick={() => showModal2(stream.id)}>
                          <EditIcon htmlColor="#28B463" />
                        </IconButton>
                      ) : null
                      }
                      {isDeleteButtonEnabled ? (
                        <IconButton aria-label="delete" onClick={() => showModal3(stream.id)}>
                          <DeleteIcon htmlColor="#FF0000" />
                        </IconButton>
                      ) : null
                      }
                    </CTableHeaderCell>
                  ) : null
                  }
                  {/* {isAssignStreamEnabled ? (
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      <IconButton
                        aria-label="assign"
                        title="Assign Stream"
                        onClick={() => showModal4(stream.id)}
                      >
                        <PermContactCalendarIcon htmlColor="#0070ff" />
                      </IconButton>
                    </CTableHeaderCell>
                  ) : null
                  }
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton
                      aria-label="assigned"
                      title="Assigned"
                      onClick={() => showModal5(stream.id)}
                    >
                      <ChecklistIcon htmlColor="#0070ff" />
                    </IconButton>
                  </CTableHeaderCell> */}
                </CTableRow>
              )

            })}
        </CTableHead>
        <CTableBody></CTableBody>
      </CTable>

      {/* Modal for Add Stream */}
      <Modal
        title="Add a Stream"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <br></br>

        <div className="form-outline mb-3">
          <label>Stream</label>
          <input
            name="stream_name"
            type="text"
            value={stream_name}
            onFocus={handleFocus}
            onChange={(e) => setStreamName(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Stream Name"
          />
          {formErrors.stream_name && (
            <div className="text-danger">{formErrors.stream_name}</div>
          )}
        </div>
{/* 
        <Form form={form}>
          <div className="form-outline mt-3">
            <label>Project</label>
            <Form.Item
              name="projectSelect"
              hasFeedback style={{ width: '100%' }}
              validateStatus={formErrors.project_id ? 'error' : ''}
              help={formErrors.project_id}>
              <Select
                placeholder="Select Project"
                onChange={handleProjectChange}
                value={project_id}
                showSearch
                onFocus={handleFocus}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projects.map((proj) => (
                  <Select.Option value={proj.id} key={proj.id}>
                    {proj.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form> */}

        {/* <div className="form-outline mt-3">
          <label>Start Time</label>
          <input
            type="date"
            name="start_time"
            value={start_time}
            onFocus={handleFocus}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Start Time"
          />
        </div>
        {formErrors.start_time && <div className="text-danger">{formErrors.start_time}</div>} */}

        {/* <div className="form-outline mt-3">
          <label>End Time</label>
          <input
            type="date"
            value={end_time}
            name="end_time"
            onFocus={handleFocus}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter End Time"
          />
        </div>
        {formErrors.end_time && <div className="text-danger">{formErrors.end_time}</div>} */}

      </Modal>

      {/* Modal for Update Role */}
      <Modal
        title="Update a Role"
        open={isModalOpen2}
        onOk={handleOk2}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel2}
        maskClosable={false}
      >
        <br></br>

        {bystream.map((str) => (
          <div key={str.id}>
            <div className="form-outline mb-3">
              <input
                name="stream_name"
                type="text"
                defaultValue={str.stream_name}
                onFocus={handleFocus}
                onChange={(e) => setStreamName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Stream Name"
              />
            </div>
            {formErrors.stream_name && (
              <div className="text-danger">{formErrors.stream_name}</div>)}

            {/* <Form form={form}>
              <div className="form-outline mt-3">
                <label>Project</label>
                <Form.Item
                  // name="projectSelect"
                  hasFeedback style={{ width: '100%' }}
                  validateStatus={formErrors.project_id ? 'error' : ''}
                  help={formErrors.project_id}>
                  <Select
                    placeholder="Select Project"
                    name="projectSelect"
                    onChange={handleProjectChange}
                    value={project_id}
                    showSearch
                    onFocus={handleFocus}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {projects.map((proj) => (
                      <Select.Option value={proj.id} key={proj.id}>
                        {proj.project_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form> */}
{/* 
            <div className="form-outline mt-3">
              <label>Start Time</label>
              <input
                type="date"
                name="start_time"
                value={start_time}
                onFocus={handleFocus}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Time"
              />
            </div>
            {formErrors.start_time && <div className="text-danger">{formErrors.start_time}</div>}

            <div className="form-outline mt-3">
              <label>End Time</label>
              <input
                type="date"
                value={end_time}
                name="end_time"
                onFocus={handleFocus}
                onChange={(e) => setEndTime(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter End Time"
              />
            </div>
            {formErrors.end_time && <div className="text-danger">{formErrors.end_time}</div>} */}
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
                    {users.map((user) => (
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
          <div className="col md-3"></div>
          <div className="col md-2 text-center">
            <h6 style={heading}>Availability</h6>
          </div>
          &nbsp;
          <Divider></Divider>
        </div>

        {useravailability.filter((user) => {
          // Apply User filter
          if (selectedUser !== '') {
            return user.id === selectedUser
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
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={perStyle}>{user.availability}</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>
          ))}
      </Modal>

      {/* Modal for Check Assigned Status Permissions */}
      <Modal
        title="Assigned Users"
        open={isModalOpen5}
        onOk={handleOk5}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel5}
      >
        <br></br>
        <div className="row">
          <div className="col md-2 text-center">
            <h6 style={heading}>Sr/No</h6>
          </div>
          <div className="col md-3"></div>
          <div className="col md-2 text-left">
            <h6 style={heading}>User Name</h6>
          </div>
          <div className="col md-3"></div>
          <div className="col md-2 text-center">
            <h6 style={heading}>Assigned Type</h6>
          </div>
          &nbsp;
          <Divider></Divider>
        </div>

        <div>
          {streamHasUsers.map((demo, index) => (
            <div className="row" key={demo.id}>
              <div className="col md-2 text-center">
                <h6>{index + 1}</h6>
              </div>
              <div className="col md-2 text-center">
                <h6>{demo.user_details.name}</h6>
              </div>
              <div className="col md-4 text-center">
                <h6>{demo.assign_type_details.assign_type_name}</h6>
                <IconButton
                  aria-label="assign_type"
                  title="Assign Type"
                  onClick={() => showModal6(demo.id)}
                >
                  <CreateIcon htmlColor="#0070ff" />
                </IconButton>
              </div>
              &nbsp;
              <Divider />
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal for Change Assign Type */}
      <Modal
        title="Assign Type"
        open={isModalOpen6}
        onOk={handleOk6}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel6}
      >
        <div className="form-outline mb-3">
          <label>Assign Type</label>
          <Form.Item>
            <Select
              placeholder="Select Status"
              onChange={handleAssigningType}
              value={assignType}
            >
              <Select.Option value="1">Partially Assigned</Select.Option>
              <Select.Option value="2">Fully Assigned</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Modal>

      {/* Modal for Deletion Confirmation */}
      <Modal
        title="Are you sure you want to delete?"
        open={isModalOpen3}
        onOk={handleOk3}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel3}
        style={modalStyle}
      ></Modal>

      {/* Alert for Add Stream Success*/}
      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
          Stream Added Successfully
        </Alert>
      )}

      {/* Alert for Add Stream Failure*/}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
          Failed to Add Stream
        </Alert>
      )}

      {/* Alert for Delete Stream Success*/}
      {showAlert3 && (
        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
          Stream Deleted Successfully
        </Alert>
      )}

      {/* Alert for Delete Stream Failure*/}
      {showAlert4 && (
        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
          Failed to Delete Stream
        </Alert>
      )}

      {/* Alert for Update Stream Success*/}
      {showAlert5 && (
        <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
          Stream Updated Successfully
        </Alert>
      )}

      {/* Alert for Update Stream Failure*/}
      {showAlert6 && (
        <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
          Failed to Update Stream
        </Alert>
      )}

      {/* Alert for Assign Stream Success*/}
      {showAlert7 && (
        <Alert onClose={handleCloseAlert7} severity="success" style={modalStyle2}>
          {successmessage}
        </Alert>
      )}

      {/* Alert for Assign Stream Failure*/}
      {showAlert8 && (
        <Alert onClose={handleCloseAlert8} severity="error" style={modalStyle2}>
          {failuremessage}
        </Alert>
      )}
    </>
  )
}

export default Streams
