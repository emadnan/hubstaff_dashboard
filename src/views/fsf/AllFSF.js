import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button, Modal, Checkbox, Divider, Alert, Select, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import DehazeIcon from '@mui/icons-material/Dehaze'
import CreateIcon from '@mui/icons-material/Create';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
import PeopleIcon from '@mui/icons-material/People'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardFooter,
} from 'mdb-react-ui-kit';
import { InputText } from "primereact/inputtext";
import { Scrollbars } from 'react-custom-scrollbars';

const BASE_URL = process.env.REACT_APP_BASE_URL

function AllFSF() {
  const local = JSON.parse(localStorage.getItem('user-info'))
  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))
  const local_token = local.token
  const session_token = session.token

  useEffect(() => {
    getFsfonTeamLeadId(local.token)
    getAssignedFsfToUser(local.token)
  }, [])

  let [form] = Form.useForm()

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Fsf')

  const navigate = useNavigate()
  const [fsf, setFsf] = useState([])
  const [filterfsf, setFilterFsf] = useState([])
  const [fsfbyid, setFsfById] = useState([])
  const [fsfonTeamId, setFsfOnTeamId] = useState([])
  const [members, setMembers] = useState([])
  const [hasmembers, setHasMembers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [assignedfsf, setAssignedFsf] = useState([])
  const [comment, setComment] = useState('')
  const [messages, setMessages] = useState('')
  const [temp_id, setTempId] = useState('')
  const [fsfcomment, setFsfComment] = useState('')
  const [status, setStatus] = useState([])
  const [teamstatus, setTeamStatus] = useState([])
  const [assignedstatus, setAssignedStatus] = useState([])
  const [teamassignedstatus, setTeamAssignedStatus] = useState([])
  const [assignedstatusteam, setAssignedStatusTeam] = useState([])
  const [bymessage, setByMessage] = useState([])
  var filteredUsers = []
  const [selectedFsf, setSelectedFsf] = useState('')

  //CSS Stylings
  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }

  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    minWidth: '100%',
    marginTop: '50px',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const perStyle = {
    fontSize: 14,
  }

  const perStyle2 = {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  }

  const headStyle = {
    color: '#0070ff',
    fontWeight: 'bold',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '80%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  //Function for checkbox handling
  const handleSelectUser = (e, permId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, permId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== permId))
    }
  }

  const handleStatusChange = (value) => {
    setStatus(value)
  }

  const handleTeamStatusChange = (value) => {
    setTeamStatus(value)
  }

  //GET API calls
  async function getFsf() {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationForm`)
      .then((response) => response.json())
      .then((data) => setFsf(data.Functional))
      .catch((error) => console.log(error))
  }

  async function getFsfbyFunctional() {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationForm`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.Functional.filter((user) => user.functional_lead_id === local.Users.user_id)
        } else if (local.Users.role === 7) {
          filteredUsers = data.Functional.filter((user) => user.ABAP_team_lead_id === local.Users.user_id)
        }
        setFilterFsf(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getFsfById(id) {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationFormById/${id}`)
      .then((response) => response.json())
      .then((data) => setFsfById(data.Functional))
      .catch((error) => console.log(error))
  }

  async function getMembers() {
    await fetch(`${BASE_URL}/api/getUsersByRoleId/5`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 7) {
          filteredUsers = data.User.filter((user) => user.company_id === local.Users.company_id)
        }
        setMembers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getMessagesByFsfId(id) {
    await fetch(`${BASE_URL}/api/getAllMessageByFsfId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setByMessage(data.chat)
      })
      .catch((error) => console.log(error))
  }


  async function getAssignedFsfToUserStatusTeamLead(id) {
    await fetch(`${BASE_URL}/api/getFsfFromAssignToteamleadByFsfIdAndLogin/${id}`)
      .then((response) => response.json())
      .then((data) => setAssignedStatusTeam(data.fsf_Assign_to_users))
      .catch((error) => console.log(error))
  }

  async function getFsfonTeamLeadId(token) {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationFormByTeamLeadId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.Functional.filter(
            (user) => user.functional_lead_id === local.Users.user_id,
          )
        } else if (local.Users.role === 7) {
          filteredUsers = data.Functional.filter(
            (user) => user.ABAP_team_lead_id === local.Users.user_id,
          )
        }
        setFsfOnTeamId(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getAssignedFsfToUser(token) {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationFormBylogin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAssignedFsf(data.Functional))
      .catch((error) => console.log(error))
  }

  async function getAssignedFsfToUserStatus(id) {
    await fetch(`${BASE_URL}/api/getFsfAssignToUserByFsfIdAndLogin/${id}`, {
      headers: {
        Authorization: `Bearer ${local_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setAssignedStatus(data.fsf_Assign_to_users)
        setStatus(data.fsf_Assign_to_users[0].status)
        setComment(data.fsf_Assign_to_users[0].comment)
      })
      .catch((error) => console.log(error))
  }

  async function getAssignedFsfToTeamLeadStatus(id) {
    await fetch(`${BASE_URL}/api/getFsfAssignToteamleadByFsfIdAndLogin/${id}`, {
      headers: {
        Authorization: `Bearer ${local_token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTeamAssignedStatus(data.fsf_Assign_to_users)
        setTeamStatus(data.fsf_Assign_to_users[0].status)
      })
      .catch((error) => console.log(error))
  }

  async function getHasMembers(id) {
    await fetch(`${BASE_URL}/api/getFsfAssignToUsersByFsfId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const temp_array = data.fsf_Assign_to_users.map((element) => element.user_id)
        setHasMembers(temp_array)
      })
      .catch((error) => console.log(error))
  }

  //Initial rendering through useEffect
  useEffect(() => {
    getFsf()
    getMembers()
    getFsfbyFunctional()
  }, [])

  useEffect(() => {
    setSelectedUsers(hasmembers)
  }, [hasmembers])

  // Filter on the basis of Project
  const handleFsfSelectAndSearch = (value) => {
    setSelectedFsf(value)
  }

  const handleSearch = (inputValue, option) => {
    return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
  };

  const clearFilter = () => {
    form.resetFields()
    setSelectedFsf('')
  }

  // Functions for Delete FSF Success
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

  // Functions for Delete FSF Failure
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

  // Functions for Assign Members Success
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

  // Functions for Assign Members Failure
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

  // Functions for Update Status Success
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
      }, 30000)

      return () => clearTimeout(timer)
    }
  }, [showAlert5])

  // Functions for Update Status Failure
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

  // Functions for View FSF Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = (id) => {
    getFsfById(id)
    setIsModalOpen(id)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // Functions for Assign Status to FSF Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    getAssignedFsfToUserStatus(id)
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    updateAssignedFsf(isModalOpen2)
    setIsModalOpen2(false)
    setComment('')
    setStatus('')
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
    setComment('')
    setStatus('')
  }

  // Functions for Delete FSF Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    deleteFsf(isModalOpen3)
    setIsModalOpen3(false)
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
  }

  // Functions for Assign Users Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    getHasMembers(id)
    setIsModalOpen4(id)
  }

  const handleOk4 = () => {
    assignMembers(isModalOpen4)
    setIsModalOpen4(false)
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
  }

  // Functions for Change Status Modal
  const [isModalOpen5, setIsModalOpen5] = useState(false)
  const showModal5 = (id) => {
    getAssignedFsfToTeamLeadStatus(id)
    setIsModalOpen5(id)
  }

  const handleOk5 = () => {
    updateFsfStatus(isModalOpen5)
    setIsModalOpen5(false)
    setTeamStatus('')
  }

  const handleCancel5 = () => {
    setIsModalOpen5(false)
    setTeamStatus('')
  }

  // Functions for Assigned Status Modal
  const [isModalOpen6, setIsModalOpen6] = useState(false)
  const showModal6 = (id) => {
    getAssignedFsfToUserStatusTeamLead(id)
    setIsModalOpen6(id)
  }

  const handleOk6 = () => {
    setIsModalOpen6(false)
    setTeamStatus('')
  }

  const handleCancel6 = () => {
    setIsModalOpen6(false)
    setTeamStatus('')
  }

  // Functions for Add FSF Messages Modal
  const [isModalOpen7, setIsModalOpen7] = useState(false)
  const showModal7 = (id) => {
    getMessagesByFsfId(id)
    setTempId(id)
    setIsModalOpen7(id)
  }

  const handleOk7 = () => {
    setIsModalOpen7(false)
  }

  const handleCancel7 = () => {
    setIsModalOpen7(false)
  }

  // API Calls through Fetch
  async function deleteFsf(newid) {
    await fetch(`${BASE_URL}/api/deleteFunctionalSpecificationForm`, {
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
          getFsf()
          getFsfonTeamLeadId(local.token)
          getAssignedFsfToUser(local.token)
          handleButtonClick1()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function assignMembers(newid) {
    await fetch(`${BASE_URL}/api/fsfAssignToUsers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fsf_id: newid,
        user_ids: selectedUsers,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getMembers()
          handleButtonClick3()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function updateAssignedFsf(newid) {
    var formData = new FormData()
    formData.append('status', status)
    formData.append('fsf_id', newid)
    formData.append('comment', comment)
    await fetch(`${BASE_URL}/api/updateStatusByLogin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session_token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          getAssignedFsfToUser(local.token)
        } else {
          // handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function updateFsfStatus(newid) {
    var formData = new FormData()
    formData.append('status', teamstatus)
    formData.append('fsf_id', newid)
    await fetch(`${BASE_URL}/api/updateStatusByTeamLogin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session_token}`,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          getFsfonTeamLeadId(local.token)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function addMessage() {
    let item = { fsf_id: temp_id, sender_id: local.Users.user_id, messages }
    await fetch(`${BASE_URL}/api/sendFsfMessage`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getMessagesByFsfId(temp_id)
          setMessages('')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const urlAttachment = (imageUrl) => {
    // Logic to concatenate the base URL with the image URL
    const concatinatedImage = `${BASE_URL}/attachment/${imageUrl}`
    return concatinatedImage
  }

  const urlInputScreens = (imageUrl) => {
    // Logic to concatenate the base URL with the image URL
    const concatinatedImage = `${BASE_URL}/input_screens/${imageUrl}`
    return concatinatedImage
  }

  const urlOutputScreens = (imageUrl) => {
    const concatinatedImage = `${BASE_URL}/output_screens/${imageUrl}`
    // Logic to concatenate the base URL with the image URL
    return concatinatedImage
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Functional Specification Form</h3>
        </div>
        <div className="col-md 6">
          {/* Add FSF Button */}
          {isCreateButtonEnabled ? (
            <Button
              className="btn btn-primary"
              style={buttonStyle}
              onClick={async () => {
                await navigate('/fsfform')
              }}
            >
              Add FSF
            </Button>
          ) : null}
        </div>
      </div>

        <div className="row mt-2 mb-2 justify-content-between">
          <Form form={form} className="d-flex w-100">
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <Form.Item name="fsfSelect" hasFeedback style={{ width: '100%' }}>
                  <Select
                    placeholder="Select FSF"
                    onChange={handleFsfSelectAndSearch}
                    value={selectedFsf}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {filterfsf.map((fsf) => (
                      <Select.Option value={fsf.id} key={fsf.id}>
                        {fsf.wricef_id}-{fsf.fsf_version}
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

      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        {local.Users.role === 6 || local.Users.role === 7 ? (

          <CTableHead color="light">
            <CTableRow>

              <CTableHeaderCell className="text-center" style={mystyle}>
                Sr/No
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>
                WRICEF ID
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>
                Status
              </CTableHeaderCell>

              {local.Users.role === 6 || local.Users.role === 7 ? (
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Comment
                </CTableHeaderCell>
              ) : null}

              {local.Users.role === 7 ? (
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Assign User
                </CTableHeaderCell>
              ) : null}

              {local.Users.role === 7 ? (
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Users Assigned Status
                </CTableHeaderCell>
              ) : null}

              <CTableHeaderCell className="text-center" style={mystyle}>
                Actions
              </CTableHeaderCell>

            </CTableRow>

            {fsfonTeamId.filter((fsf) => {
                  if (selectedFsf !== '') {
                    return fsf.id === selectedFsf
                  }
                  return true
                }).map((fsf, index) => (
              <CTableRow key={fsf.id}>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {index + 1}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {fsf.wricef_id}-{fsf.fsf_version}
                </CTableHeaderCell>
                {
                  local.Users.role === 6 ? (
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {fsf.status}
                    </CTableHeaderCell>
                  ) : local.Users.role === 7 ? (
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {fsf.status}
                      <IconButton
                        aria-label="status"
                        title="Status"
                        onClick={() => showModal5(fsf.id)}
                      >
                        <CreateIcon htmlColor="#0070ff" />
                      </IconButton>
                    </CTableHeaderCell>
                  ) : null
                }
                {local.Users.role === 6 || local.Users.role === 7 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton
                      aria-label="comment"
                      title="Comment"
                      onClick={() => showModal7(fsf.id)}
                    >
                      <ChatBubbleIcon htmlColor="#0070ff" />
                    </IconButton>
                  </CTableHeaderCell>
                ) : null}
                {local.Users.role === 7 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton
                      aria-label="assign"
                      title="Assign Members"
                      onClick={() => showModal4(fsf.id)}
                    >
                      <PermContactCalendarIcon htmlColor="#0070ff" />
                    </IconButton>
                  </CTableHeaderCell>
                ) : null}
                {local.Users.role === 7 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton
                      aria-label="assigned-status"
                      title="Assigned Status"
                      onClick={() => showModal6(fsf.id)}
                    >
                      <PeopleIcon htmlColor="#0070ff" />
                    </IconButton>
                  </CTableHeaderCell>
                ) : null}
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  <IconButton aria-label="view" title="View FSF" onClick={() => showModal(fsf.id)}>
                    <VisibilityIcon htmlColor="#28B463" />
                  </IconButton>
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableHead>
        ) : local.Users.role === 5 ? (
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell className="text-center" style={mystyle}>
                Sr/No
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>
                WRICEF ID
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>
                Assigned By
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>
                Status
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>
                Actions
              </CTableHeaderCell>
            </CTableRow>

            {assignedfsf.filter((assigned) => {
                  if (selectedFsf !== '') {
                    return assigned.id === selectedFsf
                  }
                  return true
                }).map((assigned, index) => (
              <CTableRow key={assigned.id}>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {index + 1}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {assigned.wricef_id}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {assigned.team_lead_details.name}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {assigned.assign_status}
                  <IconButton
                    aria-label="status"
                    title="Update Status"
                    onClick={() => showModal2(assigned.fsf_id)}
                  >
                    <CreateIcon htmlColor="#0070ff" />
                  </IconButton>
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  <IconButton
                    aria-label="view"
                    title="View FSF"
                    onClick={() => showModal(assigned.id)}
                  >
                    <VisibilityIcon htmlColor="#28B463" />
                  </IconButton>
                </CTableHeaderCell>
              </CTableRow>
            ))}
          </CTableHead>
        ) : null}

        <CTableBody>

          {/* Modal for Assign Members */}
          <Modal
            title="Assign Members"
            open={isModalOpen4}
            onOk={handleOk4}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel4}
          >
            <br></br>
            <div className="row">
              <div className="col md-2 text-center">
                <h6>Sr/No</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6>Members</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={heading}>Select</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            <div>
              {members.map((mem, index) => (
                <div className="row" key={mem.id}>
                  <div className="col md-2 text-center">
                    <h6>{index + 1}</h6>
                  </div>
                  <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <h6>{mem.name}</h6>
                  </div>
                  <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <Checkbox
                      checked={selectedUsers.includes(mem.id)}
                      onChange={(e) => handleSelectUser(e, mem.id)}
                    />
                  </div>
                  &nbsp;
                  <Divider />
                </div>
              ))}
            </div>
          </Modal>

          {/* Modal for View FSF Details */}
          <Modal
            title={<div style={{ textAlign: 'center', fontWeight: 'bold' }}>FSF Details</div>}
            open={isModalOpen}
            onOk={handleOk}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel}
            width={800}
          >
            {fsfbyid.map((fsf) => {
              return (
                <div key={fsf.id}>
                  <br></br>
                  <h6 style={perStyle}>WRICEF ID</h6>
                  <p>{fsf.wricef_id}</p>
                  <h6 style={perStyle}>Project Name</h6>
                  <p>{fsf.project_name}</p>
                  <h6 style={perStyle}>Module Name</h6>
                  <p>{fsf.Module_name}</p>
                  <h6 style={perStyle}>Functional Lead Name</h6>
                  <p>{fsf.function_lead_details.name}</p>
                  <h6 style={perStyle}>Requested Date</h6>
                  <p>{new Date(fsf.requested_date).toLocaleDateString()}</p>
                  <h6 style={perStyle}>Type of Development</h6>
                  <p>{fsf.type_of_development}</p>
                  <h6 style={perStyle}>Priority</h6>
                  <p>{fsf.priority}</p>
                  <h6 style={perStyle}>Usage Frequency</h6>
                  <p>{fsf.usage_frequency}</p>
                  <h6 style={perStyle}>Transaction Code</h6>
                  <p>{fsf.transaction_code}</p>
                  <h6 style={perStyle}>Authorization Role</h6>
                  <p>{fsf.authorization_role}</p>
                  <h6 style={perStyle}>Development Logic</h6>
                  {/* <Editor
                  apiKey="46tu7q2m7kbsfpbdoc5mwnyn5hs97kdpefj8dnpuvz65aknl"
                  cloudChannel="dev"
                  value={fsf.development_logic}
                  modules={{ toolbar: false }}
                  readOnly={true}
                  /> */}
                  <p>{fsf.development_logic}</p>
                  <div style={{ display: 'flex', justifyContent: 'left' }}>
                    <a href={fsf.attachment}>
                      <img
                        src={urlAttachment(fsf.attachment)}
                        alt="Attachment"
                        style={{ width: '400px', height: '200px' }}
                      />
                    </a>
                  </div>
                  <Divider></Divider>
                  <h6 style={perStyle2}>Input Screen</h6>
                  <br></br>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a href={fsf.input_screen}>
                      <img
                        src={urlInputScreens(fsf.input_screen)}
                        alt="Input Screen"
                        style={{ width: '800px', height: '400px' }}
                      />
                    </a>
                  </div>
                  <br></br>
                  <h6 style={perStyle2}>Input Parameters</h6>
                  <CTable
                    align="middle"
                    className="mb-0 border"
                    hover
                    responsive
                    style={{ marginTop: '20px' }}
                  >
                    <CTableHead color="light">
                      {/* FSF table heading */}
                      <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Sr/No
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Parameter Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Description
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Technical Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Length
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Type
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Table Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          M/O
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          P/S
                        </CTableHeaderCell>
                      </CTableRow>

                      {fsf.get_fsf_input_parameter.map((param, index) => (
                        <CTableRow key={param.id}>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {index + 1}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.input_parameter_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.description}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_technical_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_length}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_type}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_table_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.mandatory_or_optional}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.parameter_or_selection}
                          </CTableHeaderCell>
                        </CTableRow>
                      ))}
                    </CTableHead>
                    <CTableBody></CTableBody>
                  </CTable>
                  <br></br>
                  <Divider></Divider>
                  <h6 style={perStyle2}>Output Screen</h6>
                  <br></br>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <a href={fsf.output_screen}>
                      <img
                        src={urlOutputScreens(fsf.output_screen)}
                        alt="Output Screen"
                        style={{ width: '800px', height: '400px' }}
                      />
                    </a>
                  </div>
                  <br></br>
                  <h6 style={perStyle2}>Output Parameters</h6>
                  <CTable
                    align="middle"
                    className="mb-0 border"
                    hover
                    responsive
                    style={{ marginTop: '20px' }}
                  >
                    <CTableHead color="light">
                      {/* FSF table heading */}
                      <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Sr/No
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Parameter Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Description
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Technical Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Length
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Type
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          Field Table Name
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          M/O
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>
                          P/S
                        </CTableHeaderCell>
                      </CTableRow>

                      {fsf.get_fsf_output_parameter.map((param, index) => (
                        <CTableRow key={param.id}>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {index + 1}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.output_parameter_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.description}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_technical_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_length}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_type}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.field_table_name}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.mandatory_or_optional}
                          </CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>
                            {param.parameter_or_selection}
                          </CTableHeaderCell>
                        </CTableRow>
                      ))}
                    </CTableHead>
                    <CTableBody></CTableBody>
                  </CTable>
                  <Divider></Divider>
                </div>
              )
            })}
          </Modal>

          {/* Modal for Assign Status to FSF */}
          <Modal
            title="Assign Status"
            open={isModalOpen2}
            onOk={handleOk2}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel2}
          >
            {assignedstatus.map((assigned) => (
              <div key={assigned.id}>
                <div className="form-outline mb-3">
                  <label>Status</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Status"
                      onChange={handleStatusChange}
                      defaultValue={assigned.status}
                    >
                      <Select.Option value="Completed">Completed</Select.Option>
                      <Select.Option value="InProgress">InProgress</Select.Option>
                      <Select.Option value="Pending">Pending</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                {/* <div className="form-outline mb-3">
                  <label>Comment</label>
                  <input
                    type="text"
                    defaultValue={assigned.comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Comment"
                  />
                </div> */}
              </div>
            ))}
          </Modal>

          {/* Modal for Change FSF Status to FSF */}
          <Modal
            title="Assign Status"
            open={isModalOpen5}
            onOk={handleOk5}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel5}
          >
            {teamassignedstatus.map((assign) => (
              <div key={assign.id}>
                <div className="form-outline mb-3">
                  <label>Status</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Status"
                      onChange={handleTeamStatusChange}
                      defaultValue={assign.status}
                    >
                      <Select.Option value="Completed">Completed</Select.Option>
                      <Select.Option value="InProgress">InProgress</Select.Option>
                      <Select.Option value="Pending">Pending</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

              </div>
            ))}
          </Modal>

          {/* Modal for Check Assigned Status Permissions */}
          <Modal
            title="Members Status"
            open={isModalOpen6}
            onOk={handleOk6}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel6}
          >
            <br></br>
            <div className="row">
              <div className="col md-2 text-center">
                <h6 style={heading}>Sr/No</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={heading}>Member Name</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={heading}>Status</h6>
              </div>
              {/* <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={heading}>Comment</h6>
              </div> */}
              &nbsp;
              <Divider></Divider>
            </div>

            <div>
              {assignedstatusteam.map((stat, index) => (
                <div className="row" key={stat.id}>
                  <div className="col md-2 text-center">
                    <h6>{index + 1}</h6>
                  </div>
                  <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <h6>{stat.name}</h6>
                  </div>
                  <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <h6>{stat.status}</h6>
                  </div>
                  {/* <div className="col md-3"></div>
                  <div className="col md-2 text-center">
                    <h6>{stat.comment}</h6>
                  </div> */}
                  &nbsp;
                  <Divider />
                </div>
              ))}
            </div>
          </Modal>

          {/* Modal for Change FSF Comments at Functional */}
          <Modal
            open={isModalOpen7}
            onOk={handleOk7}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel7}
            footer={null}
          >
            <MDBRow className="d-flex justify-content-center">
              <MDBCol md="10" lg="10" xl="10">
                <MDBCard style={{ width: '100%', height: '100%', maxWidth: '1000px', maxHeight: '100%' }}>
                  <MDBCardHeader
                    className="d-flex justify-content-between align-items-center p-3"
                    style={{ borderTop: "4px solid #5141e0" }}
                  >
                    <h5 className="mb-0">Chat messages</h5>
                  </MDBCardHeader>
                  <Scrollbars
                    autoHide
                    autoHideTimeout={500}
                    autoHideDuration={200}
                    style={{ height: '400px' }}
                  >
                    <MDBCardBody style={{ height: '100%' }}>

                      {bymessage.map((msg, index) => {
                        return (
                          <div key={index}>
                            {msg.sender_id === local.Users.user_id ? (
                              <>
                                <div className="d-flex justify-content-between">
                                  <p className="small mb-1 text-muted">{msg.message_time}</p>
                                  <p className="small mb-1">Me</p>
                                </div>
                                <div className="d-flex flex-row justify-content-end mb-4 pt-1">
                                  <div>
                                    <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-primary" style={{ wordBreak: 'break-word' }}>
                                      {msg.messages}
                                    </p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="d-flex justify-content-between">
                                  <p className="small mb-1">{msg.crf_chat_sender_detailes[0]?.name}</p>
                                  <p className="small mb-1 text-muted">{msg.message_time}</p>
                                </div>
                                <div className="d-flex flex-row justify-content-start">
                                  <div>
                                    <p
                                      className="small p-2 ms-3 mb-3 rounded-3"
                                      style={{ backgroundColor: "#f5f6f7", wordBreak: 'break-word' }}
                                    >
                                      {msg.messages}
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}

                    </MDBCardBody>
                  </Scrollbars>

                  <MDBCardFooter className="text-muted d-flex justify-content-start align-items-center p-3">
                    <div style={{ position: 'relative', flex: 1 }}>
                      <InputText
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Type Message..."
                        value={messages}
                        onChange={(e) => setMessages(e.target.value)}
                      />
                      <IconButton color="primary" aria-label="add an alarm" onClick={() => addMessage()}
                        className="p-button-text"
                        style={{
                          position: 'absolute',
                          right: '5px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          color: '#321fdb'
                        }}>
                        <SendIcon />
                      </IconButton>
                    </div>
                  </MDBCardFooter>

                </MDBCard>
              </MDBCol>
            </MDBRow>
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

          {/* Alert for Add Company Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              FSF Deleted Successfully
            </Alert>
          )}

          {/* Alert for Add Company Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Delete FSF
            </Alert>
          )}

          {/* Alert for  Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Members Assigned Successfully
            </Alert>
          )}

          {/* Alert for Assign Members Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Assign Members
            </Alert>
          )}

          {/* Alert for Update StatusSuccess*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Status Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Status Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Status
            </Alert>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default AllFSF
