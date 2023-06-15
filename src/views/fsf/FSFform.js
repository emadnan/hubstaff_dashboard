import { React, useState, useEffect, useRef } from 'react'
import { Modal, Form, Select } from 'antd'
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
import { Editor } from '@tinymce/tinymce-react'

import { Card, CardContent, MenuItem, Button } from '@mui/material'
import { Box, TextField, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
const BASE_URL = process.env.REACT_APP_BASE_URL

function FSFform() {

  const local = JSON.parse(localStorage.getItem('user-info'))

  //Variable declarations
  const [reference_id, setReferenceId] = useState('')
  const [module_id, setModuleId] = useState('')
  const [moduleName, setModuleName] = useState('')
  const [project_id, setProjectId] = useState('')
  const [projectName, setProjectName] = useState('')
  const [functional_lead_id, setFunctionalLeadId] = useState(local.Users.id)
  const [ABAP_team_lead_id, setABAPTeamLeadId] = useState('')
  const [wricef_id, setWRicefId] = useState('')
  const [type_of_development, setTypeOfDevelopment] = useState('')
  const [requested_date, setRequestedDate] = useState('')
  const [priority, setPriority] = useState('')
  const [usage_frequency, setUsageFrequency] = useState('')
  const [transaction_code, setTransactionCode] = useState('')
  const [authorization_role, setAuthorizationRole] = useState('')
  const [development_logic, setDevelopmentLogic] = useState('')

  const [fsf_id, setFsfId] = useState('')
  const [description, setDescription] = useState('')
  const [input_parameter_name, setInputParameterName] = useState('')
  const [output_parameter_name, setOutputParameterName] = useState('')
  const [field_technical_name, setFieldTechnicalName] = useState('')
  const [field_length, setFieldLength] = useState('')
  const [field_type, setFieldType] = useState('')
  const [field_table_name, setFieldTableName] = useState('')
  const [mandatory_or_optional, setMandatoryOrOptional] = useState('')
  const [parameter_or_selection, setParameterOrSelection] = useState('')

  const [project, setProjects] = useState([])
  const [fsfHasParameter, setFsfHasParameter] = useState([])
  const [ref_id, setRef_id] = useState()
  const [users, setUsers] = useState([])
  const [teamlead, setTeamLeads] = useState([])
  const [projectmodule, setProjectModule] = useState([])
  const [fsfwricef, setFsfWricef] = useState([])
  const [fsf_input, setFsfInput] = useState([])
  const [fsf_output, setFsfOutput] = useState([])
  var filteredUsers = []

  const navigate = useNavigate()

  const [isFocused, setIsFocused] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [imageError2, setImageError2] = useState(false);

  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // Check if the selected file is an image
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setImageError(false);
    } else {
      setSelectedImage(null);
      setImageError(true);
    }
  };

  const handleFileUpload2 = (event) => {
    const file = event.target.files[0];

    // Check if the selected file is an image
    if (file && file.type.startsWith('image/')) {
      setSelectedImage2(URL.createObjectURL(file));
      setImageError2(false);
    } else {
      setSelectedImage2(null);
      setImageError2(true);
    }
  };

  useEffect(() => {
    setWRicefId(`Biafo-${projectName}-${moduleName}`);
  }, [projectName, moduleName]);

  // const editorRef = useRef()

  const editorConfig = {
    height: 200,
    menubar: 'file edit view insert format',
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar: `undo redo | formatselect | bold italic backcolor |
      alignleft aligncenter alignright alignjustify |
      bullist numlist outdent indent | removeformat | help`,
    file_picker_types: 'file image media',
    file_picker_callback: function (callback, value, meta) {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.onchange = function () {
        const file = this.files[0]
        const reader = new FileReader()
        reader.onload = function () {
          // Pass the image URL to the callback function
          callback(reader.result)
        }
        reader.readAsDataURL(file)
      }
      input.click()
    },
  }

  const handleEditorChange = (content, editor) => {
    console.log('content: ', content)
    setDevelopmentLogic(content);
  }

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
  const handleModuleChange = (value, option) => {
    setModuleId(value)
    setModuleName(option.module_name)
  };

  const handleProjectChange = (value, option) => {
    setProjectId(value)
    setProjectName(option.project_name)
  }

  const handleTypeOfDevelopmentChange = (value) => {
    setTypeOfDevelopment(value)
  }

  const handleFunctionalLeadChange = (value) => {
    setFunctionalLeadId(value)
  }

  const handleReferenceIdChange = (value) => {
    setReferenceId(value)
  }

  const handleAbapTeamLeadId = (value) => {
    setABAPTeamLeadId(value)
  }

  const handlePriorityChange = (value) => {
    setPriority(value)
  }

  const handleUsageFrequencyChange = (value) => {
    setUsageFrequency(value)
  }

  const handleMandatoryOrOptionalChange = (value) => {
    setMandatoryOrOptional(value)
  }

  const handleParameterOrSelection = (value) => {
    setParameterOrSelection(value)
  }

  // Functions of Add Input Parameter Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    addInputParameter()
    setIsModalOpen(false)
    setInputParameterName('')
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
    setInputParameterName('')
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  // Functions of Add Output Parameter Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = () => {
    setIsModalOpen2(true)
  }

  const handleOk2 = () => {
    addOutputParameter()
    setIsModalOpen2(false)
    setOutputParameterName('')
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
    setOutputParameterName('')
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  //DIV handlings
  const [showLevel1, setShowLevel1] = useState(true)
  const [showLevel2, setShowLevel2] = useState(false)
  const [showLevel3, setShowLevel3] = useState(false)
  const [showLevel4, setShowLevel4] = useState(false)
  const [showLevel5, setShowLevel5] = useState(false)
  const [showLevel6, setShowLevel6] = useState(false)
  const [showLevel7, setShowLevel7] = useState(false)

  const handleNext1 = () => {
    setShowLevel1(false)
    setShowLevel2(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack2 = () => {
    setShowLevel2(false)
    setShowLevel1(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext2 = () => {
    setShowLevel2(false)
    setShowLevel3(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack3 = () => {
    setShowLevel3(false)
    setShowLevel2(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext3 = () => {
    setShowLevel3(false)
    setShowLevel4(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
    addFsfForm()
  }

  const handleBack4 = () => {
    setShowLevel4(false)
    setShowLevel3(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext4 = () => {
    setShowLevel4(false)
    setShowLevel5(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack5 = () => {
    setShowLevel5(false)
    setShowLevel4(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext5 = () => {
    setShowLevel5(false)
    setShowLevel6(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack6 = () => {
    setShowLevel6(false)
    setShowLevel5(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext6 = () => {
    setShowLevel6(false)
    setShowLevel7(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack7 = () => {
    setShowLevel7(false)
    setShowLevel6(true)
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
    getTeamLeads(local.Users.company_id)
    getProjectModules()
    getFsfWricefId()
  }, [])

  //GET API calls
  function getProjects() {
    fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.projects
        } else if (local.Users.role === 3) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        } else if (local.Users.role === 6) {
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
        if (local.Users.role === 1) {
          filteredUsers = data.Users
        } else if (local.Users.role === 3) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
        }
        setUsers(filteredUsers.slice(1))
      })
      .catch((error) => console.log(error))
  }

  function getTeamLeads(id) {
    fetch(`${BASE_URL}/api/getTeamLeadByCompanyId/${id}`)
      .then((response) => response.json())
      .then((data) => setTeamLeads(data.Team_Leads))
      .catch((error) => console.log(error))
  }

  function getProjectModules() {
    fetch(`${BASE_URL}/api/getModules`)
      .then((response) => response.json())
      .then((data) => setProjectModule(data.Module))
      .catch((error) => console.log(error))
  }

  function getFsfWricefId() {
    fetch(`${BASE_URL}/api/getFunctionalSpecificationForm`)
      .then((response) => response.json())
      .then((data) => setFsfWricef(data.Functional))
      .catch((error) => console.log(error))
  }

  function getFSFInputParameters() {
    fetch(`${BASE_URL}/api/getFsfHasParameterByFsfId/${ref_id}`)
      .then((response) => response.json())
      .then((data) => setFsfInput(data.fsf_has_parameter))
      .catch((error) => console.log(error))
  }

  function getFSFOutputParameters() {
    fetch(`${BASE_URL}/api/getFsfHasOutputParameters/${ref_id}`)
      .then((response) => response.json())
      .then((data) => setFsfOutput(data.fsf_has_output_parameters))
      .catch((error) => console.log(error))
  }

  function getFsfHasParameterByFsfId(id) {
    fetch(`${BASE_URL}/api/getFsfHasParameterById/${id}`)
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
  }

  // Add API calls
  async function addFsfForm() {
    let data = {
      reference_id,
      module_id,
      project_id,
      type_of_development,
      wricef_id,
      functional_lead_id,
      ABAP_team_lead_id,
      requested_date,
      priority,
      usage_frequency,
      transaction_code,
      authorization_role,
      development_logic,
    }
    console.log(data)

    await fetch(`${BASE_URL}/api/addFunctionalSpecificationForm`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('Request failed with status ' + response.status)
        }
      })
      .then((data) => {
        console.log("My data", data)
        setRef_id(data.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function addInputParameter() {
    let inputfsf = {
      fsf_id: ref_id,
      description,
      input_parameter_name,
      field_technical_name,
      field_length,
      field_type,
      field_table_name,
      mandatory_or_optional,
      parameter_or_selection,
    }
    console.log(inputfsf)

    await fetch(`${BASE_URL}/api/addFsfHasInputParameters`, {
      method: 'POST',
      body: JSON.stringify(inputfsf),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getFSFInputParameters()
        } else {
          throw new Error('Request failed with status ' + response.status)
        }
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function addOutputParameter() {
    let inputfsf = {
      fsf_id: ref_id,
      description,
      output_parameter_name,
      field_technical_name,
      field_length,
      field_type,
      field_table_name,
      mandatory_or_optional,
      parameter_or_selection,
    }
    console.log(inputfsf)

    await fetch(`${BASE_URL}/api/addFsfOutputParameters`, {
      method: 'POST',
      body: JSON.stringify(inputfsf),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getFSFOutputParameters()
        } else {
          throw new Error('Request failed with status ' + response.status)
        }
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <>
      {/* FSF Level 1 Form Starts */}
      {showLevel1 && (
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
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>

                <div className="form-outline mb-3">
                  <label>Reference Id</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Reference Id"
                      onChange={handleReferenceIdChange}
                      value={reference_id}
                    >
                      <Select.Option value="0" key="none">None</Select.Option>
                      {fsfwricef.map((fsf) => (
                        <Select.Option value={fsf.id} key={fsf.id}>
                          {fsf.wricef_id}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Module</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Module"
                      onChange={handleModuleChange}
                      value={module_id}
                    >
                      {projectmodule.map((proj) => (
                        <Select.Option value={proj.id} key={proj.id} module_name={proj.name}>
                          {proj.name}
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
                      {project.map((pro) => (
                        <Select.Option value={pro.id} key={pro.id} project_name={pro.project_name}>
                          {pro.project_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Type of Development</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Type of Development"
                      onChange={handleTypeOfDevelopmentChange}
                      value={type_of_development}
                    >
                      <Select.Option value="Workflow">Workflow</Select.Option>
                      <Select.Option value="Report">Report</Select.Option>
                      <Select.Option value="Enhancement">Enhancement</Select.Option>
                      <Select.Option value="Interface">Interface</Select.Option>
                      <Select.Option value="Customization">Customization</Select.Option>
                      <Select.Option value="Form">Form</Select.Option>
                      <Select.Option value="Upload">Upload</Select.Option>
                      <Select.Option value="Integration">Integration</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <Button
                  onClick={handleNext1}
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
      {showLevel2 && (
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
                Level 2
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>

                {/* <div className="form-outline mb-3">
                  <label>WRICEF Id</label>
                  <input
                    type="text"
                    value={wricef_id}
                    className="form-control form-control-lg"
                    placeholder="Enter Wricef Id"
                  />
                </div> */}

                {/* <div className="form-outline mb-3">
                  <label>Functional Lead</label>
                  <input
                    type="number"
                    value={local.Users.id}
                    onChange={handleFunctionalLeadChange}
                    className="form-control form-control-lg"
                    placeholder="Enter Functional Lead"
                  />
                </div> */}

                <div className="form-outline mb-3">
                  <label>ABAP Team Lead</label>
                  <Form.Item>
                    <Select
                      placeholder="Select ABAP Team Lead"
                      onChange={handleAbapTeamLeadId}
                      value={ABAP_team_lead_id}
                    >
                      {teamlead.map((team) => (
                        <Select.Option value={team.id} key={team.id}>
                          {team.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Requested Date</label>
                  <input
                    type="date"
                    value={requested_date}
                    onChange={(e) => setRequestedDate(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Requested Date"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Priority</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Priority"
                      onChange={handlePriorityChange}
                      value={priority}
                    >
                      <Select.Option value="Low">Low</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="High">High</Select.Option>
                      <Select.Option value="Go-Live Critical">Go-Live Critical</Select.Option>
                      <Select.Option value="After Go-Live">After Go-Live</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Usage Frequency</label>
                  <Form.Item>
                    <Select
                      placeholder="Select Usage Frequency"
                      onChange={handleUsageFrequencyChange}
                      value={usage_frequency}
                    >
                      <Select.Option value="Daily">Daily</Select.Option>
                      <Select.Option value="Weekly">Weekly</Select.Option>
                      <Select.Option value="Monthly">Monthly</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    onClick={handleBack2}
                    style={dangerButtonStyle}
                    onMouseEnter={handleMouseEnterDanger}
                    onMouseLeave={handleMouseLeaveDanger}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleNext2}
                    style={primaryButtonStyle}
                    onMouseEnter={handleMouseEnterPrimary}
                    onMouseLeave={handleMouseLeavePrimary}
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
      {showLevel3 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Development Logic
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

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>

                <div className="form-outline mb-3">
                  <label>Transaction Code</label>
                  <input
                    type="text"
                    value={transaction_code}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Transaction Code"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Authorization Role</label>
                  <input
                    type="text"
                    value={authorization_role}
                    onChange={(e) => setAuthorizationRole(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Authorization Role"
                  />
                </div>

                {/* <div className="form-outline mb-3">
                  <label>Development Logic</label>
                  <input
                    type="text"
                    value={development_logic}
                    onChange={(e) => setDevelopmentLogic(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Development Logic"
                  />
                </div> */}

                <Editor
                  apiKey="46tu7q2m7kbsfpbdoc5mwnyn5hs97kdpefj8dnpuvz65aknl"
                  cloudChannel="dev"
                  init={editorConfig}
                  onEditorChange={handleEditorChange}
                />

                <br></br>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    onClick={handleBack3}
                    style={dangerButtonStyle}
                    onMouseEnter={handleMouseEnterDanger}
                    onMouseLeave={handleMouseLeaveDanger}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext3}
                    style={primaryButtonStyle}
                    onMouseEnter={handleMouseEnterPrimary}
                    onMouseLeave={handleMouseLeavePrimary}
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* FSF Level 3 Form Ends */}

      {/* FSF Level 4 Form Starts */}
      {showLevel4 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Input Screen
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 4
              </Typography>
            </Box>
          </Box>

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
            {/* <Button
              onClick={handleBack4}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button> */}
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*" 
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              onClick={() => fileInputRef.current.click()} 
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Upload Image
            </Button>
            <Button
              onClick={handleNext4}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Next
            </Button>
          </Box>

          {imageError && <p>Error: Please select a valid image file.</p>}

          {selectedImage && (
            <div>
              {/* <h4>Selected Image:</h4> */}
              <img src={selectedImage} alt="Selected" />
            </div>
          )}
        </div>
      )}
      {/* FSF Level 4 Form Ends */}

      {/* FSF Level 5 Form Starts */}
      {showLevel5 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Input Screen Parameters
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 5
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
                {/* <CTableHeaderCell className="text-center" style={mystyle}>
                  Actions
                </CTableHeaderCell> */}
                {/* Add Actions column */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {fsf_input.map((data, index) => (
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
                  {/* <CTableDataCell className="text-center" style={mystyle}>
                    <IconButton aria-label="Update" onClick={() => showModal3(data.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => showModal2(data.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  </CTableDataCell> */}
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

                <div className="form-outline mb-3">
                  <label>Parameter Name</label>
                  <input
                    type="text"
                    value={input_parameter_name}
                    onChange={(e) => setInputParameterName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Input Parameter Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Description"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Technical Name</label>
                  <input
                    type="text"
                    value={field_technical_name}
                    onChange={(e) => setFieldTechnicalName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Technical Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Length</label>
                  <input
                    type="text"
                    value={field_length}
                    onChange={(e) => setFieldLength(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Length"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Type</label>
                  <input
                    type="text"
                    value={field_type}
                    onChange={(e) => setFieldType(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Type"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Table Name</label>
                  <input
                    type="text"
                    value={field_table_name}
                    onChange={(e) => setFieldTableName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Table Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Mandatory or Optional</label>
                  <Form.Item>
                    <Select
                      placeholder="Select"
                      onChange={handleMandatoryOrOptionalChange}
                      value={mandatory_or_optional}
                    >
                      <Select.Option value="Mandatory">Mandatory</Select.Option>
                      <Select.Option value="Optional">Optional</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Parameter or Selection</label>
                  <Form.Item>
                    <Select
                      placeholder="Select"
                      onChange={handleParameterOrSelection}
                      value={parameter_or_selection}
                    >
                      <Select.Option value="Parameter">Parameter</Select.Option>
                      <Select.Option value="Selection">Selection</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

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
              onClick={handleBack5}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button>
            <Button
              onClick={handleNext5}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Next
            </Button>
          </Box>
        </div>
      )}
      {/* FSF Level 5 Form Ends */}

      {/* FSF Level 6 Form Starts */}
      {showLevel6 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Output Screen
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 6
              </Typography>
            </Box>
          </Box>

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
            {/* <Button
          onClick={handleBack6}
          style={dangerButtonStyle}
          onMouseEnter={handleMouseEnterDanger}
          onMouseLeave={handleMouseLeaveDanger}
        >
          Back
        </Button> */}
            <input
              type="file"
              onChange={handleFileUpload2}
              accept="image/*" 
              style={{ display: 'none' }}
              ref={fileInputRef2}
            />
            <Button
              onClick={() => fileInputRef2.current.click()} 
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Upload Image
            </Button>
            <Button
              onClick={handleNext6}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Next
            </Button>
          </Box>

          {imageError2 && <p>Error: Please select a valid image file.</p>}

          {selectedImage2 && (
            <div>
              {/* <h4>Selected Image:</h4> */}
              <img src={selectedImage2} alt="Selected" />
            </div>
          )}
        </div>
      )}
      {/* FSF Level 6 Form Ends */}

      {/* FSF Level 7 Form Starts */}
      {showLevel7 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Output Screen Parameters
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 7
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
                onClick={showModal2}
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
                </CTableHeaderCell>
                {/* Add Actions column */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {fsf_output.map((data, index) => (
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
                  {/* <CTableDataCell className="text-center" style={mystyle}>
                    <IconButton aria-label="Update" onClick={() => showModal3(data.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => showModal2(data.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  </CTableDataCell> */}
                </CTableRow>
              ))}

              {/* Modal for Add Parameter */}
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
                  Add a Parameter
                </Typography>
                <div className="form-outline mb-3">
                  <label>Parameter Name</label>
                  <input
                    type="text"
                    value={output_parameter_name}
                    onChange={(e) => setOutputParameterName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Output Parameter Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Description"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Technical Name</label>
                  <input
                    type="text"
                    value={field_technical_name}
                    onChange={(e) => setFieldTechnicalName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Technical Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Length</label>
                  <input
                    type="text"
                    value={field_length}
                    onChange={(e) => setFieldLength(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Length"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Type</label>
                  <input
                    type="text"
                    value={field_type}
                    onChange={(e) => setFieldType(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Type"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Field Table Name</label>
                  <input
                    type="text"
                    value={field_table_name}
                    onChange={(e) => setFieldTableName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Field Table Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Mandatory or Optional</label>
                  <Form.Item>
                    <Select
                      placeholder="Select"
                      onChange={handleMandatoryOrOptionalChange}
                      value={mandatory_or_optional}
                    >
                      <Select.Option value="Mandatory">Mandatory</Select.Option>
                      <Select.Option value="Optional">Optional</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Parameter or Selection</label>
                  <Form.Item>
                    <Select
                      placeholder="Select"
                      onChange={handleParameterOrSelection}
                      value={parameter_or_selection}
                    >
                      <Select.Option value="Parameter">Parameter</Select.Option>
                      <Select.Option value="Selection">Selection</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
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
              onClick={handleBack7}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button>
            <Button
              onClick={submitHandle}
              style={successButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Submit
            </Button>
          </Box>
        </div>
      )}
      {/* FSF Level 7 Form Ends */}
    </>
  )
}

export default FSFform
