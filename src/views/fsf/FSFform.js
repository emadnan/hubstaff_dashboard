import { React, useState, useEffect } from 'react'
import { Modal } from 'antd'
import {
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTable,
} from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import { useNavigate } from 'react-router-dom'

import { Card, CardContent, MenuItem, Button } from '@mui/material'
import { Box, TextField, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'

function FSFform() {

  const local = JSON.parse(localStorage.getItem('user-info'))

  //Variable declarations
  const [wricef_id, setWRicefId] = useState('')
  const [module_name, setModuleName] = useState('')
  const [functional_lead_id, setFuncionalLeadId] = useState(local.Users.id)
  const [team_lead_id, setTeamLeadId] = useState('')
  const [requested_date, setRequestedDate] = useState('')
  const [type_of_development, setTypeOfDevelopment] = useState('')
  const [priority, setPriority] = useState('')
  const [usage_frequency, setUsageFrequency] = useState('')
  const [transaction_code, setTransactionCode] = useState('')
  const [authorization_level, setAuthorizationLevel] = useState('')
  const [description, setDescription] = useState('')
  const [field_technical_name, setFieldTechnicalName] = useState('')
  const [field_length, setFieldLength] = useState('')
  const [field_type, setFieldType] = useState('')
  const [field_table_name, setFieldTableName] = useState('')
  const [mandatory_or_optional, setMandatoryOrOptional] = useState('')
  const [parameter_or_selection, setParameterOrSelection] = useState('')
  const [project, setProjects] = useState([])
  const [fsfHasParameter, setFsfHasParameter] = useState([])
  const [ref_id, setRef_id] = useState()
  const [postData, setPostData] = useState([])
  const [users, setUsers] = useState([])
  const [teamlead, setTeamLeads] = useState([])
  var filteredUsers = []

  const navigate = useNavigate()

  const [isFocused, setIsFocused] = useState(false)

  //CSS Styling
  const [isHoveredPrimary, setIsHoveredPrimary] = useState(false)

  const [isHoveredDanger, setIsHoveredDanger] = useState(false)

  const [isHoveredSuccess, setIsHoveredSuccess] = useState(false)

  const mystyle = {
    color: 'black',
    backgroundColor: 'white',
    padding: '15px',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: '#0070ff',
    fontWeight: 'bold',
    color: 'white',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const handleInputFocus = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
  }

  const primaryButtonStyle = {
    backgroundColor: isHoveredPrimary ? '#6699CC' : 'blue',
    color: 'white',
    transition: 'background-color 0.3s',
  }

  const dangerButtonStyle = {
    backgroundColor: isHoveredDanger ? '#FAA0A0' : 'red',
    color: 'white',
    transition: 'background-color 0.3s',
  }

  const successButtonStyle = {
    backgroundColor: isHoveredSuccess ? '#90EE90' : 'green',
    color: 'white',
    transition: 'background-color 0.3s',
  }

  const handleMouseEnterPrimary = () => {
    setIsHoveredPrimary(true)
  }

  const handleMouseLeavePrimary = () => {
    setIsHoveredPrimary(false)
  }

  const handleMouseEnterDanger = () => {
    setIsHoveredDanger(true)
  }

  const handleMouseLeaveDanger = () => {
    setIsHoveredDanger(false)
  }

  const handleMouseEnterSuccess = () => {
    setIsHoveredSuccess(true)
  }

  const handleMouseLeaveSuccess = () => {
    setIsHoveredSuccess(false)
  }

  //GET calls handling
  const handleModuleChange = (event) => {
    const selectedValue = event.target.value
    setModuleName(selectedValue)
  }

  const handleTypeOfDevelopmentChange = (event) => {
    const selectedValue = event.target.value
    setTypeOfDevelopment(selectedValue)
  }

  const handlePriorityChange = (event) => {
    const selectedValue = event.target.value
    setPriority(selectedValue)
  }

  const handleTeamLeadChange = (event) => {
    const selectedValue = event.target.value
    setTeamLeadId(selectedValue)
  }

  const handleFunctionalLeadChange = (event) => {
    const selectedValue = event.target.value
    setFuncionalLeadId(selectedValue)
  }

  const handleUsageFrequencyChange = (event) => {
    const selectedValue = event.target.value
    setUsageFrequency(selectedValue)
  }

  const handleMandatoryOrOptionalChange = (event) => {
    const selectedValue = event.target.value
    setMandatoryOrOptional(selectedValue)
  }

  const handleParameterOrSelection = (event) => {
    const selectedValue = event.target.value
    setParameterOrSelection(selectedValue)
  }

  // Functions of Add Parameter Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    addFsfStage3()
    setIsModalOpen(false)
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  // Functions for Delete FSF Parameter Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    deleteFSF(isModalOpen2)
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Update FSF Parameter Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getFsfHasParameterByFsfId(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    updateFSF(isModalOpen3)
    setIsModalOpen3(false)
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  //DIV handlings
  const [showDiv1, setShowDiv1] = useState(true)
  const [showDiv2, setShowDiv2] = useState(false)
  const [showDiv3, setShowDiv3] = useState(false)

  const handleClick1 = () => {
    setShowDiv1(false)
    setShowDiv2(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
    addFsfStage1()
  }

  const handleClick2 = () => {
    setShowDiv2(false)
    setShowDiv3(true)
    addFsfStage2()
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleClick3 = () => {
    setShowDiv3(false)
    setShowDiv2(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleClick4 = () => {
    setShowDiv2(false)
    setShowDiv1(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  // Functions for Add FSF Success
  const [showAlert1, setShowAlert1] = useState(false)

  const [showAlert3, setShowAlert3] = useState(false)

  const [showAlert4, setShowAlert4] = useState(false)

  const [showAlert5, setShowAlert5] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleCloseAlert1() {
    setShowAlert1(false)
  }

  function submitHandle() {
    handleButtonClick1()
    setTimeout(() => {
      navigate('/allfsf')
    }, 2000)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  // Functions for Add FSF Failure
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  function handleCloseAlert2() {
    setShowAlert2(false)
  }

  function handleButtonClick3() {
    setShowAlert3(true)
  }

  function handleCloseAlert3() {
    setShowAlert3(false)
  }

  function handleButtonClick4() {
    setShowAlert4(true)
  }

  function handleCloseAlert4() {
    setShowAlert4(false)
  }

  function handleButtonClick5() {
    setShowAlert5(true)
  }

  function handleCloseAlert5() {
    setShowAlert5(false)
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 3000)

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

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert5])

  //Initial rendering
  useEffect(() => {
    getProjects()
    getUsers()
    getTeamLeads(local.Users.company_id);
  }, [])

  //GET API calls
  function getProjects() {
    fetch('http://10.3.3.80/api/getproject')
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === '1') {
          filteredUsers = data.projects
        } else if (local.Users.role === '3') {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getUsers() {
    fetch('http://10.3.3.80/api/get_users')
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === '1') {
          filteredUsers = data.Users
        } else if (local.Users.role === '3') {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
        }
        setUsers(filteredUsers.slice(1))
      })
      .catch((error) => console.log(error))
  }

  function getTeamLeads(id) {
    fetch(`http://10.3.3.80/api/getTeamLeadByCompanyId/${id}`)
      .then((response) => response.json())
      .then((data) => setTeamLeads(data.Team_Leads))
      .catch((error) => console.log(error))
  }

  function getFSFParameters() {
    fetch(`http://10.3.3.80/api/getFsfHasParameterByFsfId/${ref_id}`)
      .then((response) => response.json())
      .then((data) => setPostData(data.fsf_has_parameter))
      .catch((error) => console.log(error))
  }

  function getFsfHasParameterByFsfId(id) {
    fetch(`http://10.3.3.80/api/getFsfHasParameterById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFsfHasParameter(data.fsf)
        setDescription(data.fsf[0].description)
        setFieldTechnicalName(data.fsf[0].field_technical_name)
        setFieldLength(data.fsf[0].field_length)
        setFieldType(data.fsf[0].field_type)
        setFieldTableName(data.fsf[0].field_table_name)
        setMandatoryOrOptional(data.fsf[0].mandatory_or_optional)
        setParameterOrSelection(data.fsf[0].parameter_or_selection)
      })
      .catch((error) => console.log(error))
  };

  // Add API calls
  async function addFsfStage1() {
    let data = {
      wricef_id,
      module_name,
      functional_lead_id,
      team_lead_id,
      requested_date,
      type_of_development,
      priority,
      usage_frequency,
    }
    console.log(data)

    await fetch('http://10.3.3.80/api/addFunctionalSpecificationForm/1/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json() // Parse the response body as JSON
        } else {
          throw new Error('Request failed with status ' + response.status)
        }
      })
      .then((data) => {
        console.log(data)
        setRef_id(data.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function addFsfStage2() {
    let data = { id: ref_id, transaction_code, authorization_level }
    console.log(data)

    await fetch('http://10.3.3.80/api/addFunctionalSpecificationForm/2/', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json() // Parse the response body as JSON
        } else {
          throw new Error('Request failed with status ' + response.status)
        }
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        handleButtonClick2()
        console.error(error)
      })
  }

  async function addFsfStage3() {
    let data = {
      fsf_id: ref_id,
      description,
      field_technical_name,
      field_length,
      field_type,
      field_table_name,
      mandatory_or_optional,
      parameter_or_selection,
    }
    console.log(data)

    try {
      const response = await fetch('http://10.3.3.80/api/addFunctionalSpecificationForm/3/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const responseData = await response.json()
        console.log('responseData: ', responseData)
        handleButtonClick4()
        getFSFParameters()
      } else {
        throw new Error('Request failed with status ' + response.status)
      }
    } catch (error) {
      handleButtonClick2()
      console.error(error)
    }
  }

  // Delete FSF Parameter API call
  async function deleteFSF(id) {
    await fetch(`http://10.3.3.80/api/DeleteFsfHasParameterByFsfId`, {
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
          handleButtonClick5()
          getFSFParameters()
        }
      })
      .catch((error) => {
        handleButtonClick2()
        console.error(error)
      })
  }

  // Update FSF Parameter API call
  async function updateFSF(newid) {
    await fetch('http://10.3.3.80/api/UpdateFsfHasParameterByFsfId', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        fsf_id: ref_id,
        description: description,
        field_technical_name: field_technical_name,
        field_length: field_length,
        field_type: field_type,
        field_table_name: field_table_name,
        mandatory_or_optional: mandatory_or_optional,
        parameter_or_selection: parameter_or_selection,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick3()
          getFSFParameters()
        } else {
          // handleButtonClick6();
        }
      })
      .catch((error) => {
        handleButtonClick2()
        console.error(error)
      })
  }

  return (
    <>
      {/* FSF Level 1 Form Starts */}
      {showDiv1 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Development Request Data
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 1
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 600, justifyContent: 'center', padding: '20px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-wricef-id"
                    label="WRICEF ID"
                    variant="standard"
                    type="wricef_id"
                    name="wricef_id"
                    value={wricef_id}
                    onChange={(e) => setWRicefId(e.target.value)}
                    placeholder="Enter WRICEF ID"
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-module_name"
                    label="Module Name"
                    variant="standard"
                    select
                    value={module_name}
                    onChange={handleModuleChange}
                    placeholder="Select Module Name"
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="Test 1">Test 1</MenuItem>
                    <MenuItem value="Test 2">Test 2</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-functional_lead"
                    label="Functional Lead"
                    variant="standard"
                    type="functional_lead"
                    name="functional_lead"
                    value={local.Users.name}
                    onChange={handleFunctionalLeadChange}
                    placeholder="Functional Lead"
                    sx={{ width: '100%' }}
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-team_lead"
                    label="Team Lead"
                    variant="standard"
                    select
                    value={team_lead_id}
                    onChange={handleTeamLeadChange}
                    placeholder="Select Team Lead"
                    sx={{ width: '100%' }}
                  >
                    {teamlead.map((team) => (
                      <MenuItem value={team.id} key={team.id}>{team.name}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-requested_date"
                    label="Requested Date"
                    variant="standard"
                    type="date"
                    value={requested_date}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    placeholder="Select Requested Date"
                    sx={{ width: '100%' }}
                    InputProps={{
                      style: {
                        color: isFocused || requested_date ? 'black' : 'transparent',
                      },
                      onFocus: handleInputFocus,
                      onBlur: handleInputBlur,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-type_of_development"
                    label="Type of Development"
                    variant="standard"
                    select
                    value={type_of_development}
                    onChange={handleTypeOfDevelopmentChange}
                    placeholder="Select Type of Development"
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="Form">Form</MenuItem>
                    <MenuItem value="Report">Report</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-priority"
                    label="Priority"
                    variant="standard"
                    select
                    value={priority}
                    onChange={handlePriorityChange}
                    placeholder="Select Priority"
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-usage_frequency"
                    label="Usage Frequency"
                    variant="standard"
                    select
                    value={usage_frequency}
                    onChange={handleUsageFrequencyChange}
                    placeholder="Select Usage Frequency"
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                    <MenuItem value="Monthly">Monthly</MenuItem>
                  </TextField>
                </Box>

                <Button
                  onClick={handleClick1}
                  style={primaryButtonStyle}
                  onMouseEnter={handleMouseEnterPrimary}
                  onMouseLeave={handleMouseLeavePrimary}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* FSF Level 1 Form Ends */}

      {/* FSF Level 2 Form Starts */}
      {showDiv2 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Development Screen Data
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 2
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 600, justifyContent: 'center', padding: '20px' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-transaction-code"
                    label="Transaction Code"
                    variant="standard"
                    type="text"
                    value={transaction_code}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-authorization-level"
                    label="Authorization Level"
                    variant="standard"
                    type="text"
                    value={authorization_level}
                    onChange={(e) => setAuthorizationLevel(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    onClick={handleClick4}
                    style={dangerButtonStyle}
                    onMouseEnter={handleMouseEnterDanger}
                    onMouseLeave={handleMouseLeaveDanger}
                  >
                    Back
                  </Button>
                  <Button
                    style={primaryButtonStyle}
                    onMouseEnter={handleMouseEnterPrimary}
                    onMouseLeave={handleMouseLeavePrimary}
                    onClick={handleClick2}
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* FSF Level 2 Form Ends */}

      {/* FSF Level 3 Form Starts */}
      {showDiv3 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Add Parameter
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 3
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 3,
              mb: 1,
            }}
          >
            <Tooltip title="Add Parameters">
              <Button
                style={primaryButtonStyle}
                onClick={showModal}
                onMouseEnter={handleMouseEnterPrimary}
                onMouseLeave={handleMouseLeavePrimary}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </Box>

          <CTable
            align="middle"
            className="mb-0 border"
            hover
            responsive
            style={{ marginTop: '20px' }}
          >
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Sr No.
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
                  Mandatory/Optional
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Parameter/Selection
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Actions
                </CTableHeaderCell>{' '}
                {/* Add Actions column */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {postData.map((data, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.description}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_technical_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_length}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_type}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_table_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.mandatory_or_optional}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.parameter_or_selection}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    <IconButton aria-label="Update" onClick={() => showModal3(data.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => showModal2(data.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}

              {/* Modal for Add Parameter */}
              <Modal
                open={isModalOpen}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      OK
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Add a Parameter
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-description"
                    label="Description"
                    variant="standard"
                    type="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Description"
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-field_technical_name"
                    label="Field Technical Name"
                    variant="standard"
                    type="field_technical_name"
                    name="field_technical_name"
                    value={field_technical_name}
                    onChange={(e) => setFieldTechnicalName(e.target.value)}
                    placeholder="Enter Field Technical Name"
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-field_length"
                    label="Field Length"
                    variant="standard"
                    type="field_length"
                    name="field_technical_name"
                    value={field_length}
                    onChange={(e) => setFieldLength(e.target.value)}
                    placeholder="Enter Field Length"
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-field_type"
                    label="Field Type"
                    variant="standard"
                    type="field_type"
                    name="field_type"
                    value={field_type}
                    onChange={(e) => setFieldType(e.target.value)}
                    placeholder="Enter Field Type"
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="input-field_table_name"
                    label="Field Table Name"
                    variant="standard"
                    type="field_table_name"
                    name="field_table_name"
                    value={field_table_name}
                    onChange={(e) => setFieldTableName(e.target.value)}
                    placeholder="Enter Field Table Name"
                    sx={{ width: '100%' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-mandatory_or_optional"
                    label="Mandatory or Optional"
                    variant="standard"
                    select
                    value={mandatory_or_optional}
                    onChange={handleMandatoryOrOptionalChange}
                    placeholder="Select Mandatory or Optional"
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="Mandatory">Mandatory</MenuItem>
                    <MenuItem value="Optional">Optional</MenuItem>
                  </TextField>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                  <TextField
                    id="select-parameter_or_selection"
                    label="Parameter or Selection"
                    variant="standard"
                    select
                    value={parameter_or_selection}
                    onChange={handleParameterOrSelection}
                    placeholder="Select Parameter or Selection"
                    sx={{ width: '100%' }}
                  >
                    <MenuItem value="Parameter">Parameter</MenuItem>
                    <MenuItem value="Selection">Selection</MenuItem>
                  </TextField>
                </Box>
              </Modal>

              {/* Modal for Update FSF Parameters */}

              <Modal
                open={isModalOpen3}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel3}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk3}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      Update
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Update a Parameter
                </Typography>
                {fsfHasParameter.map((fsf) => (
                  <div key={fsf.id}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="input-description"
                        label="Description"
                        variant="standard"
                        type="description"
                        name="description"
                        defaultValue={fsf.description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                        sx={{ width: '100%' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="input-field_technical_name"
                        label="Field Technical Name"
                        variant="standard"
                        type="field_technical_name"
                        name="field_technical_name"
                        defaultValue={fsf.field_technical_name}
                        onChange={(e) => setFieldTechnicalName(e.target.value)}
                        placeholder="Enter Field Technical Name"
                        sx={{ width: '100%' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="input-field_length"
                        label="Field Length"
                        variant="standard"
                        type="field_length"
                        name="field_technical_name"
                        defaultValue={fsf.field_length}
                        onChange={(e) => setFieldLength(e.target.value)}
                        placeholder="Enter Field Length"
                        sx={{ width: '100%' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="input-field_type"
                        label="Field Type"
                        variant="standard"
                        type="field_type"
                        name="field_type"
                        defaultValue={fsf.field_type}
                        onChange={(e) => setFieldType(e.target.value)}
                        placeholder="Enter Field Type"
                        sx={{ width: '100%' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="input-field_table_name"
                        label="Field Table Name"
                        variant="standard"
                        type="field_table_name"
                        name="field_table_name"
                        defaultValue={fsf.field_table_name}
                        onChange={(e) => setFieldTableName(e.target.value)}
                        placeholder="Enter Field Table Name"
                        sx={{ width: '100%' }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="select-mandatory_or_optional"
                        label="Mandatory or Optional"
                        variant="standard"
                        select
                        defaultValue={fsf.mandatory_or_optional}
                        onChange={handleMandatoryOrOptionalChange}
                        placeholder="Select Mandatory or Optional"
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value="Mandatory">Mandatory</MenuItem>
                        <MenuItem value="Optional">Optional</MenuItem>
                      </TextField>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                      <TextField
                        id="select-parameter_or_selection"
                        label="Parameter or Selection"
                        variant="standard"
                        select
                        defaultValue={fsf.parameter_or_selection}
                        onChange={handleParameterOrSelection}
                        placeholder="Select Parameter or Selection"
                        sx={{ width: '100%' }}
                      >
                        <MenuItem value="Parameter">Parameter</MenuItem>
                        <MenuItem value="Selection">Selection</MenuItem>
                      </TextField>
                    </Box>
                  </div>
                ))}
              </Modal>

              {/* Modal for Deletion Confirmation */}
              <Modal
                open={isModalOpen2}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel2} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel2}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk2}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      OK
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Are you sure you want to delete?
                </Typography>
              </Modal>

              {/* Alert for Add FSF Success*/}
              {showAlert1 && (
                <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
                  FSF Added Successfully
                </Alert>
              )}

              {/* Alert for Add FSF Failure*/}
              {showAlert2 && (
                <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                  Failed to Add FSF
                </Alert>
              )}

              {/* Alert for Update FSF Parameters*/}
              {showAlert3 && (
                <Alert onClose={handleCloseAlert3} severity="primary" style={modalStyle2}>
                  FSF Update Successfully
                </Alert>
              )}

              {/* Alert for Add FSF Parameters*/}
              {showAlert4 && (
                <Alert onClose={handleCloseAlert4} severity="primary" style={modalStyle2}>
                  FSF Parameter Added Successfully
                </Alert>
              )}

              {/* Alert for Delete FSF Parameters*/}
              {showAlert5 && (
                <Alert onClose={handleCloseAlert5} severity="primary" style={modalStyle2}>
                  FSF Parameter Deleted Successfully
                </Alert>
              )}
            </CTableBody>
          </CTable>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 2,
              mb: 2,
            }}
          >
            <Button
              onClick={handleClick3}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button>
            <Button
              style={successButtonStyle}
              onClick={() => submitHandle()}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Submit
            </Button>
          </Box>
        </div>
      )}
      {/* FSF Level 3 Form Ends */}
    </>
  )
}

export default FSFform
