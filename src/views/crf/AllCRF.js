import { React, useState, useEffect } from 'react'
import { Divider, Modal, Select, Form, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Box } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CreateIcon from '@mui/icons-material/Create';
import VisibilityIcon from '@mui/icons-material/Visibility'
import CommentIcon from '@mui/icons-material/Comment'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Alert from '@mui/material/Alert'
// import Button from '@mui/material/Button';
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

function AllCRF() {
  //Local Storage access
  const local = JSON.parse(localStorage.getItem('user-info'))
  const navigate = useNavigate()
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Updation Variables Declaration
  const [temp_id, setTempId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [module_id, setModuleId] = useState('')
  const [fsf_id, setFsfId] = useState('')
  const [company_id, setCompanyId] = useState('')
  const [project_manager, setProjectManager] = useState('')
  const [functional_id, setFunctionalId] = useState('')
  const [reference, setReference] = useState('')
  const [implementation_partner, setImplementationPartner] = useState('')
  const [issuance_date, setIssuanceDate] = useState('')
  const [author, setAuthor] = useState('')
  const [doc_ref_no, setDocRefNo] = useState('')
  const [crf_version, setCrfVersion] = useState('')
  const [status, setStatus] = useState('')
  const [comment, setComment] = useState('')
  const [messages, setMessages] = useState('')
  const [crf_id, setCrfId] = useState('')
  const [crf_title, setCrfTitle] = useState('')
  const [requirement, setRequirement] = useState('')
  const [required_time_no, setRequiredTime] = useState('')
  const [required_time_type, setRequiredTimeType] = useState('')
  const [functional_resource, setFunctionalResource] = useState('')
  const [Technical_resource, setTechnicalResource] = useState('')
  const [type_of_requirement, setTypeOfRequirement] = useState('')
  const [priority, setPriority] = useState('')
  const [with_in_project_scope, setWithInProjectScope] = useState('')

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Crf')

  //CSS Stylings

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
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
    fontSize: 16,
    fontWeight: 'bold',
  }

  const perStyle2 = {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '80%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const handleTimeChange = (value) => {
    setRequiredTime(value)
  }

  const handleTypeOfRequirementChange = (value) => {
    setTypeOfRequirement(value)
  }

  const handlePriorityChange = (value) => {
    setPriority(value)
  }

  const handleWithInProjectScopeChange = (value) => {
    setWithInProjectScope(value)
  }

  const handleTypeChange = (value) => {
    setRequiredTimeType(value)
  }

  const handleFunctionalResourceChange = (value) => {
    setFunctionalResource(value)
  }

  const handleTechnicalResourceChange = (value) => {
    setTechnicalResource(value)
  }

  // Functions for Delete CRF Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false)
  const showModal1 = (id) => {
    setIsModalOpen1(id)
  }

  const handleOk1 = () => {
    deleteCrf(isModalOpen1)
    setIsModalOpen1(false)
  }

  const handleCancel1 = () => {
    setIsModalOpen1(false)
  }

  // Functions for View CRF Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    getCrfById(id)
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Add CRF Messages Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getMessagesByCrfId(id)
    setTempId(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    setIsModalOpen3(false)
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
  }

  // Functions for Add and Update Status at Project Manager Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    getCrfById(id)
    setIsModalOpen4(id)
  }

  const handleOk4 = () => {
    updateCommentandStatus(isModalOpen4)
    setIsModalOpen4(false)
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
  }

  // Functions for Update CRF Modal
  const [isModalOpen5, setIsModalOpen5] = useState(false)
  const showModal5 = (id) => {
    getCrfUpdateById(id)
    setIsModalOpen5(id)
  }

  const handleOk5 = () => {
    updateCrf(isModalOpen5)
    setIsModalOpen5(false)
  }

  const handleCancel5 = () => {
    setIsModalOpen5(false)
  }

  //Initial rendering through useEffect
  useEffect(() => {
    getCrf()
    getCrfbyRole()
  }, [])

  const [showAlert1, setShowAlert1] = useState(false)
  const [showAlert2, setShowAlert2] = useState(false)
  const [showAlert3, setShowAlert3] = useState(false)
  const [showAlert4, setShowAlert4] = useState(false)

  let [form] = Form.useForm()

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  function handleButtonClick3() {
    setShowAlert3(true)
  }

  function handleButtonClick4() {
    setShowAlert4(true)
  }

  function handleCloseAlert1() {
    setShowAlert1(false)
  }

  function handleCloseAlert2() {
    setShowAlert2(false)
  }

  function handleCloseAlert3() {
    setShowAlert3(false)
  }

  function handleCloseAlert4() {
    setShowAlert4(false)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert2])

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert3])

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert4])

  const handleStatusChange = (value) => {
    setStatus(value)
  }

  // Filter on the basis of Project
  const handleCrfSelectAndSearch = (value) => {
    setSelectedCrf(value)
  }

  const clearFilter = () => {
    form.resetFields()
    setSelectedCrf('')
  }

  //Array declarations for GET methods
  const [crf, setCrf] = useState([])
  const [bycrf, setCrfById] = useState([])
  const [bycrfid, setByCrfId] = useState([])
  const [bymessage, setByMessage] = useState([])
  const [filtercrf, setFilterCrf] = useState([])
  const [selectedCrf, setSelectedCrf] = useState('')
  var filteredUsers = []

  //GET API calls
  async function getCrf() {
    await fetch(`${BASE_URL}/api/getChangeRequestForm`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.CRForm.filter(
            (user) =>
              user.company_id === local.Users.company_id &&
              user.functional_id === local.Users.user_id,
          )
        } else if (local.Users.role === 7) {
          filteredUsers = data.CRForm.filter(
            (user) =>
              user.company_id === local.Users.company_id &&
              user.project_manager === local.Users.user_id,
          )
        }
        setCrf(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getCrfbyRole() {
    await fetch(`${BASE_URL}/api/getChangeRequestForm`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.CRForm.filter((user) => user.functional_id === local.Users.user_id)
        } else if (local.Users.role === 7) {
          filteredUsers = data.CRForm.filter((user) => user.project_manager === local.Users.user_id)
        }
        setFilterCrf(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getCrfById(id) {
    await fetch(`${BASE_URL}/api/getChangeRequestFormById/${id}`)
      .then((response) => response.json())
      .then((data) => setCrfById(data.CRForm))
      .catch((error) => console.log(error))
  }

  async function getMessagesByCrfId(id) {
    await fetch(`${BASE_URL}/api/getAllMessageByCrfId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setByMessage(data.chat)
      })
      .catch((error) => console.log(error))
  }

  function getCrfUpdateById(id) {
    fetch(`${BASE_URL}/api/getChangeRequestFormById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setByCrfId(data.CRForm)
        setProjectId(data.CRForm[0].project_id)
        setModuleId(data.CRForm[0].module_id)
        setFsfId(data.CRForm[0].fsf_id)
        setCompanyId(data.CRForm[0].company_id)
        setProjectManager(data.CRForm[0].project_manager)
        setFunctionalId(data.CRForm[0].functional_id)
        setReference(data.CRForm[0].reference)
        setImplementationPartner(data.CRForm[0].implementation_partner)
        setIssuanceDate(data.CRForm[0].issuance_date)
        setAuthor(data.CRForm[0].author)
        setDocRefNo(data.CRForm[0].doc_ref_no)
        setCrfVersion(data.CRForm[0].crf_version)
        setStatus(data.CRForm[0].status)
        setComment(data.CRForm[0].comment)
        setCrfId(data.CRForm[0].crs_details.crf_id)
        setCrfTitle(data.CRForm[0].crs_details.crf_title)
        setRequirement(data.CRForm[0].crs_details.requirement)
        setRequiredTime(data.CRForm[0].crs_details.required_time_no)
        setRequiredTimeType(data.CRForm[0].crs_details.required_time_type)
        setFunctionalResource(data.CRForm[0].crs_details.functional_resource)
        setTechnicalResource(data.CRForm[0].crs_details.Technical_resource)
        setTypeOfRequirement(data.CRForm[0].crs_details.type_of_requirement)
        setPriority(data.CRForm[0].crs_details.priority)
        setWithInProjectScope(data.CRForm[0].crs_details.with_in_project_scope)
      })
      .catch((error) => console.log(error))
  }

  // API Calls through Fetch
  async function deleteCrf(newid) {
    await fetch(`${BASE_URL}/api/deleteChangeRequestForm`, {
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
          getCrf()
          handleButtonClick1()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // API Calls through Fetch
  async function updateComment(newid) {
    await fetch(`${BASE_URL}/api/updateComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        comment: comment,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getCrf()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // API Calls through Fetch
  async function updateCommentandStatus(newid) {
    await fetch(`${BASE_URL}/api/updateStatusAndComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        status: status,
        comment: comment,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getCrf();
          handleButtonClick3();
        } else {
          handleButtonClick4();
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function addMessage() {
    let item = { crf_id: temp_id, sender_id: local.Users.user_id, messages }
    await fetch(`${BASE_URL}/api/sendMessage`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getMessagesByCrfId(temp_id)
          setMessages('')
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update CRF API call
  async function updateCrf(newid) {
    await fetch(`${BASE_URL}/api/updateCrfAndCrs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        project_id: project_id,
        module_id: module_id,
        fsf_id: fsf_id,
        company_id: company_id,
        project_manager: project_manager,
        functional_id: functional_id,
        reference: reference,
        implementation_partner: implementation_partner,
        issuance_date: issuance_date,
        author: author,
        doc_ref_no: doc_ref_no,
        crf_version: crf_version,
        status: status,
        comment: comment,
        crf_id: crf_id,
        crf_title: crf_title,
        requirement: requirement,
        required_time_no: required_time_no,
        required_time_type: required_time_type,
        functional_resource: functional_resource,
        Technical_resource: Technical_resource,
        type_of_requirement: type_of_requirement,
        priority: priority,
        with_in_project_scope: with_in_project_scope,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getCrf()
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
          <h3>Change Request Form</h3>
        </div>
        <div className="col-md 6">
          {/* Add CRF Button */}
          {isCreateButtonEnabled ? (
            <Button
              className="btn btn-primary"
              style={buttonStyle}
              onClick={async () => {
                await navigate('/crfform')
              }}
            >
              Add CRF
            </Button>
          ) : null}
        </div>
      </div>

      <div className="row mt-2 mb-2 justify-content-between">
          <Form form={form} className="d-flex w-100">
            <div className="col-md-3">
              <div className="d-flex align-items-center">
                <Form.Item name="crfSelect" hasFeedback style={{ width: '100%' }}>
                  <Select
                    placeholder="Select CRF"
                    onChange={handleCrfSelectAndSearch}
                    value={selectedCrf}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {crf.map((crf) => (
                      <Select.Option value={crf.id} key={crf.id}>
                        {crf.doc_ref_no}-{crf.crf_version}.{crf.crf_version_float}
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
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Document Reference No
            </CTableHeaderCell>
            {local.Users.role === 6 ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Assigned To
              </CTableHeaderCell>
            ) : null}
            <CTableHeaderCell className="text-center" style={mystyle}>
              Issuance Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Status
            </CTableHeaderCell>
            {local.Users.role === 7 ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Comments
              </CTableHeaderCell>
            ) : null}
            {local.Users.role === 6 ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Comments
              </CTableHeaderCell>
            ) : null}
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}
          {crf.filter((crf) => {
                  if (selectedCrf !== '') {
                    return crf.id === selectedCrf
                  }
                  return true
                }).map((crf, index) =>
            crf.crs_details === null ? (
              ''
            ) : (
              <CTableRow key={crf.id}>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {index + 1}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {crf.doc_ref_no}-{crf.crf_version}
                  {'.'}
                  {crf.crf_version_float}
                </CTableHeaderCell>
                {local.Users.role === 6 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {crf.project_manager_details.name}
                  </CTableHeaderCell>
                ) : null}
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {new Date(crf.issuance_date).toLocaleDateString()}
                </CTableHeaderCell>
                {local.Users.role === 6 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {crf.status}
                  </CTableHeaderCell>
                ) : null}
                {local.Users.role === 7 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {crf.status}
                    <IconButton aria-label="status" title="Status" onClick={() => showModal4(crf.id)}>
                      <CreateIcon htmlColor="#0070ff" />
                    </IconButton>
                  </CTableHeaderCell>
                ) : null}
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  <IconButton
                    aria-label="comment"
                    title="Comment"
                    onClick={() => showModal3(crf.id)}
                  >
                    <ChatBubbleIcon htmlColor="#0070ff" />
                  </IconButton>
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  <IconButton aria-label="view" title="View CRF" onClick={() => showModal2(crf.id)}>
                    <VisibilityIcon htmlColor="#28B463" />
                  </IconButton>
                  {crf.status === 'Change Request' && local.Users.role === 6 ? (
                    <IconButton aria-label="update" onClick={() => showModal5(crf.id)}>
                      <EditIcon htmlColor="#0070ff" />
                    </IconButton>
                  ) : null}
                </CTableHeaderCell>
              </CTableRow>
            ),
          )}
        </CTableHead>

        <CTableBody></CTableBody>
      </CTable>

      {/* Modal for Deletion Confirmation */}
      <Modal
        title="Are you sure you want to delete?"
        open={isModalOpen1}
        onOk={handleOk1}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel1}
        style={modalStyle}
      ></Modal>

      {/* Modal for View FSF Details */}
      <Modal
        title={
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 26 }}>
            Change Request Form
          </div>
        }
        open={isModalOpen2}
        onOk={handleOk2}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel2}
        width={800}
      >
        {bycrf.map((crf) => {
          return (
            <div key={crf.id}>
              <Divider></Divider>
              <h6 style={perStyle}>Customer</h6>
              <p>{crf.project_details.project_name}</p>
              <h6 style={perStyle}>Implementation Partner</h6>
              <p>{crf.implementation_partner}</p>
              <h6 style={perStyle}>Document Reference No</h6>
              <p>
                {crf.doc_ref_no}-{crf.crf_version}
                {'.'}
                {crf.crf_version_float}
              </p>
              <h6 style={perStyle}>Issuance Date</h6>
              <p>{new Date(crf.issuance_date).toLocaleDateString()}</p>
              <h6 style={perStyle}>Author</h6>
              <p>{crf.author}</p>
              <Divider></Divider>
              <h6 style={perStyle2}>Change Request Summary</h6>
              <br></br>
              <h6 style={perStyle}>CRF Title</h6>
              <p>{crf.crs_details.crf_title}</p>
              <h6 style={perStyle}>Change Request Number</h6>
              <p>
                {crf.doc_ref_no}-{crf.crf_version}
                {'.'}
                {crf.crf_version_float}
              </p>
              <h6 style={perStyle}>New Requirements</h6>
              <p>{crf.crs_details.requirement}</p>
              <h6 style={perStyle}>Type Of Requirement</h6>
              <p>{crf.crs_details.type_of_requirement}</p>
              <h6 style={perStyle}>Priority</h6>
              <p>{crf.crs_details.priority}</p>
              <h6 style={perStyle}>Required Time</h6>
              <p>
                {crf.crs_details.required_time_no} {crf.crs_details.required_time_type}
              </p>
              <h6 style={perStyle}>Functional Resource Requirement</h6>
              <p>{crf.crs_details.functional_resource}</p>
              <h6 style={perStyle}>Technical Resource Requirement</h6>
              <p>{crf.crs_details.Technical_resource}</p>
              <h6 style={perStyle}>With-In Project Scope</h6>
              <p>{crf.crs_details.with_in_project_scope}</p>
            </div>
          )
        })}
      </Modal>

      {/* Modal for Change CRF Comments at Functional */}
      <Modal
        open={isModalOpen3}
        onOk={handleOk3}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel3}
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
                                <p className="small p-2 me-3 mb-3 text-white rounded-3 bg-primary" style={{wordBreak: 'break-word'}}>
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

      {/* Modal for Change CRF Comments and Status at Project Manager */}
      <Modal
        // title="Change Request"
        open={isModalOpen4}
        onOk={handleOk4}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel4}
      >
        {bycrf.map((crf) => (
          <div key={crf.id}>
            <div className="form-outline mb-3">
              <h6 style={perStyle}>Status</h6>
              <Form.Item>
                <Select
                  placeholder="Select Status"
                  onChange={handleStatusChange}
                  defaultValue={crf.status}
                >
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Accepted">Accepted</Select.Option>
                  <Select.Option value="Change Request">Change Request</Select.Option>
                </Select>
              </Form.Item>
            </div>

          </div>
        ))}
      </Modal>

      {/* Modal for Update CRF */}
      <Modal
        title="Update CRF"
        open={isModalOpen5}
        onOk={handleOk5}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel5}
        maskClosable={false}
      >
        <br></br>

        {bycrfid.map((crf) => (
          <div key={crf.id}>
            <div className="form-outline mb-3">
              <h6 style={perStyle}>Title</h6>
              <Form.Item name="crf_title">
                <input
                  type="text"
                  defaultValue={crf.crs_details.crf_title}
                  onChange={(e) => setCrfTitle(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Title"
                />
              </Form.Item>
            </div>

            <div className="form-outline mb-3">
              <h6 style={perStyle}>New Requirement Detail</h6>
              <Form.Item name="requirement">
                <input
                  type="text"
                  defaultValue={crf.crs_details.requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter New Requirement Detail"
                />
              </Form.Item>
            </div>

            <div className="form-outline mb-6">
              <h6 style={perStyle}>Type Of Requirement</h6>
              <Box>
                <Form.Item name="type_of_requirement" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Type of Requirement"
                    onChange={handleTypeOfRequirementChange}
                    defaultValue={crf.crs_details.type_of_requirement}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="Change">Change</Select.Option>
                    <Select.Option value="Enhancement">Enhancement</Select.Option>
                    <Select.Option value="Error_rectification">Error Rectification</Select.Option>
                  </Select>
                </Form.Item>
              </Box>
            </div>

            <div className="form-outline mb-6">
              <h6 style={perStyle}>Priority</h6>
              <Box>
                <Form.Item name="priority" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Priority"
                    onChange={handlePriorityChange}
                    defaultValue={crf.crs_details.priority}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="Low">Low</Select.Option>
                    <Select.Option value="Medium">Medium</Select.Option>
                    <Select.Option value="High">High</Select.Option>
                  </Select>
                </Form.Item>
              </Box>
            </div>

            <div className="form-outline mb-6 time-container">
              <h6 style={perStyle}>Required Time</h6>
              <Box>
                <Form.Item name="required_time_no" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Required Time"
                    onChange={handleTimeChange}
                    defaultValue={crf.crs_details.required_time_no}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="1">1</Select.Option>
                    <Select.Option value="2">2</Select.Option>
                    <Select.Option value="3">3</Select.Option>
                    <Select.Option value="4">4</Select.Option>
                    <Select.Option value="5">5</Select.Option>
                    <Select.Option value="6">6</Select.Option>
                    <Select.Option value="7">7</Select.Option>
                    <Select.Option value="8">8</Select.Option>
                    <Select.Option value="9">9</Select.Option>
                  </Select>
                </Form.Item>
              </Box>

              <Box>
                <Form.Item name="required_time_type" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Required Type"
                    onChange={handleTypeChange}
                    defaultValue={crf.crs_details.required_time_type}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="hours">hours</Select.Option>
                    <Select.Option value="days">days</Select.Option>
                    <Select.Option value="weeks">weeks</Select.Option>
                    <Select.Option value="months">months</Select.Option>
                  </Select>
                </Form.Item>
              </Box>
            </div>

            <div className="form-outline mb-6">
              <h6 style={perStyle}>Functional Resource (required)</h6>
              <Box>
                <Form.Item name="functional_resource" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Required"
                    onChange={handleFunctionalResourceChange}
                    defaultValue={crf.crs_details.functional_resource}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Box>
            </div>

            <div className="form-outline mb-6">
              <h6 style={perStyle}>Technical Resource (required)</h6>
              <Box>
                <Form.Item name="Technical_resource" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Required"
                    onChange={handleTechnicalResourceChange}
                    defaultValue={crf.crs_details.Technical_resource}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Box>
            </div>

            <div className="form-outline mb-6">
              <h6 style={perStyle}>Within Project Scope</h6>
              <Box>
                <Form.Item name="with_in_project_scope" hasFeedback>
                  <Select
                    showSearch
                    placeholder="Select Within Project Scope"
                    onChange={handleWithInProjectScopeChange}
                    defaultValue={crf.crs_details.with_in_project_scope}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Select.Option value="Yes">Yes</Select.Option>
                    <Select.Option value="No">No</Select.Option>
                  </Select>
                </Form.Item>
              </Box>
            </div>
          </div>
        ))}
      </Modal>

      {/* Alert for Delete CRF Success*/}
      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
          CRF Deleted Successfully
        </Alert>
      )}

      {/* Alert for Delete CRF Failure*/}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
          CRF Deleted Successfully
        </Alert>
      )}

      {/* Alert for Update Status Success*/}
      {showAlert3 && (
        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
          Status Updated Successfully
        </Alert>
      )}

      {/* Alert for Update Status Failure*/}
      {showAlert4 && (
        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
          Failed to Update Status
        </Alert>
      )}
    </>
  )
}

export default AllCRF