import { React, useState, useEffect } from 'react'
import { Select, Form, Modal } from 'antd'
import { Box, Typography } from '@mui/material'
import { Card, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'

const BASE_URL = process.env.REACT_APP_BASE_URL

function CRFform() {
  //Local Storage access
  const local = JSON.parse(localStorage.getItem('user-info'))

  //Variable Declarations
  const [project_id, setProjectId] = useState('')
  const [module_id, setModuleId] = useState('')
  const [fsf_id, setFsfId] = useState('')
  const [implementation_partner, setImplementationPartner] = useState('')
  const [issuance_date, setIssuanceDate] = useState('')
  const [author, setAuthor] = useState('')
  const [doc_ref_no, setDocRefNo] = useState('')
  const [project_manager, setProjectManager] = useState('')
  const [reference, setReference] = useState('')
  const [projectname, setProjectName] = useState('')
  const [modulename, setModuleName] = useState('')
  const [crf_id, setCrfId] = useState('')
  const [ref_id, setRef_id] = useState()
  const [crf_title, setCrfTitle] = useState('')
  const [type_of_requirement, setTypeOfRequirement] = useState('')
  const [priority, setPriority] = useState('')
  const [with_in_project_scope, setWithInProjectScope] = useState('')
  const [requirement, setRequirement] = useState('')
  const [required_time_no, setRequiredTime] = useState('')
  const [required_time_type, setRequiredTimeType] = useState('')
  const [functional_resource, setFunctionalResource] = useState('')
  const [Technical_resource, setTechnicalResource] = useState('')

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  }

  useEffect(() => {
    const currentDate = getCurrentDate()
    setIssuanceDate(currentDate)
    setImplementationPartner(local.Users.company_name)
    setAuthor(local.Users.name)

    // const uniqueNumber = Math.floor(Math.random() * 1000);
    const concatenatedId = `Biafo-${projectname}-${modulename}`
    setDocRefNo(concatenatedId)
  }, [projectname, modulename])

  const [project, setProjects] = useState([])
  const [projectmodule, setProjectModule] = useState([])
  const [allfsf, setAllFsf] = useState([])
  const [fsfbyprojectandmodule, setFsfByProjectAndModule] = useState([])
  const [bycrfreference, setByCrfReference] = useState([])
  const [byusers, setByUsers] = useState([])
  var filteredUsers = []
  const navigate = useNavigate()

  //CSS Styling
  const [isHoveredPrimary, setIsHoveredPrimary] = useState(false)
  const [isHoveredDanger, setIsHoveredDanger] = useState(false)
  const [isHoveredSuccess, setIsHoveredSuccess] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

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

  const modalStyle = {
    position: 'fixed',
    top: '40%',
    left: '40%',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const selectstyle = {
    height: '40px',
  }

  const perStyle = {
    fontSize: 15,
    fontWeight: 'bold',
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

  const [showLevel1, setShowLevel1] = useState(true)
  const [showLevel2, setShowLevel2] = useState(false)
  const [showLevel3, setShowLevel3] = useState(false)

  const handleNext1 = () => {
    if (project_id && module_id) {
      setShowLevel1(false)
      setShowLevel2(true)
      getFsfByProjectAndModule()
    } else {
      callErrors(
        project_id,
        module_id,
        fsf_id,
        reference,
        project_manager,
        implementation_partner,
        issuance_date,
        author,
        doc_ref_no,
        crf_id,
        crf_title,
        type_of_requirement,
        priority,
        with_in_project_scope,
        requirement,
        required_time_no,
        required_time_type,
        functional_resource,
        Technical_resource,
      )
    }
  }

  const handleNext2 = () => {
    if (fsf_id && project_manager && reference && implementation_partner && issuance_date && author && doc_ref_no) {
      setShowLevel2(false)
      setShowLevel3(true)
      addCrfForm()
    } else {
      callErrors(
        project_id,
        module_id,
        fsf_id,
        reference,
        project_manager,
        implementation_partner,
        issuance_date,
        author,
        doc_ref_no,
        crf_id,
        crf_title,
        type_of_requirement,
        priority,
        with_in_project_scope,
        requirement,
        required_time_no,
        required_time_type,
        functional_resource,
        Technical_resource,
      )
    }
  }

  const handleBack2 = () => {
    setShowLevel2(false)
    setShowLevel1(true)
  }

  const handleNext3 = () => {
    if (
      ref_id &&
      crf_title &&
      type_of_requirement &&
      priority &&
      with_in_project_scope &&
      requirement &&
      required_time_no &&
      required_time_type &&
      functional_resource &&
      Technical_resource
    ) {
      setShowLevel3(false)
      addChangeRequestSummary()
      setTimeout(() => {
        navigate('/allcrf')
      }, 2000)
    } else {
      callErrors(
        project_id,
        module_id,
        fsf_id,
        reference,
        project_manager,
        implementation_partner,
        issuance_date,
        author,
        doc_ref_no,
        crf_id,
        crf_title,
        type_of_requirement,
        priority,
        with_in_project_scope,
        requirement,
        required_time_no,
        required_time_type,
        functional_resource,
        Technical_resource,
      )
    }
  }

  //Initial rendering
  useEffect(() => {
    getProjects()
    getUsers()
    getProjectModules()
    getFsf()
    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    setIssuanceDate(formattedDate)
  }, [])

  const handleProjectChange = (value, option) => {
    setProjectId(value)
    setProjectName(option.project_name)
  }

  const handleModuleChange = (value, option) => {
    setModuleId(value)
    setModuleName(option.module_name)
  }

  const handleCrfReference = (value) => {
    console.log(value)
    setReference(value)
  }

  const handleFsfChange = (value) => {
    console.log(value)
    if (value === '0') {
      setIsModalVisible(true)
    } else {
      handleReference(value)
    }
  }

  const handleReference = (value) => {
    getCrfByReference(value)
  }

  const handleProjectManagerChange = (value) => {
    setProjectManager(value)
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

  const [formErrors, setFormErrors] = useState({
    project_id: '',
    module_id: '',
    fsf_id: '',
    reference: '',
    project_manager: '',
    implementation_partner: '',
    issuance_date: '',
    author: '',
    doc_ref_no: '',
    crf_id: '',
    crf_title: '',
    type_of_requirement: '',
    priority: '',
    with_in_project_scope: '',
    requirement: '',
    required_time_no: '',
    required_time_type: '',
    functional_resource: '',
    Technical_resource: '',
  })

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  const callErrors = (
    project_id,
    module_id,
    fsf_id,
    reference,
    project_manager,
    implementation_partner,
    issuance_date,
    author,
    doc_ref_no,
    crf_id,
    crf_title,
    type_of_requirement,
    priority,
    with_in_project_scope,
    requirement,
    required_time_no,
    required_time_type,
    functional_resource,
    Technical_resource,
  ) => {
    const errors = {}
    if (showLevel1 && !project_id) {
      errors.project_id = 'Please Select the Project'
    }
    if (showLevel1 && !module_id) {
      errors.module_id = 'Please Select the Module'
    }
    if (showLevel2 && !fsf_id) {
      errors.fsf_id = 'Please Select the FSF'
    }
    if (showLevel2 && !reference) {
      errors.reference = 'Please Select the Reference Id'
    }
    if (showLevel2 && !project_manager) {
      errors.project_manager = 'Please Select the Project Manager'
    }
    if (showLevel2 && !implementation_partner) {
      errors.implementation_partner = 'Please Select the Implementation Partner'
    }
    if (showLevel2 && !issuance_date) {
      errors.issuance_date = 'Please Select the Insurance Date'
    }
    if (showLevel2 && !author) {
      errors.author = 'Please Select the Authur'
    }
    if (showLevel2 && !doc_ref_no) {
      errors.doc_ref_no = 'Please Select the Document Reference No'
    }
    if (showLevel3 && !crf_id) {
      errors.crf_id = 'Please Select CRF Id'
    }
    if (showLevel3 && !crf_title) {
      errors.crf_title = 'Please Enter Your CRF Title'
    }
    if (showLevel3 && !type_of_requirement) {
      errors.type_of_requirement = 'Please Select the Type of Requirement'
    }
    if (showLevel3 && !priority) {
      errors.priority = 'Please Select the Priority'
    }
    if (showLevel3 && !with_in_project_scope) {
      errors.with_in_project_scope = 'Please Select With-In Project Scope '
    }
    if (showLevel3 && !requirement) {
      errors.requirement = 'Enter Your Requirements'
    }
    if (showLevel3 && !required_time_no) {
      errors.required_time_no = 'Please Select Requirement Time'
    }
    if (showLevel3 && !required_time_type) {
      errors.required_time_type = 'Please Select Requirement Time Type'
    }
    if (showLevel3 && !functional_resource) {
      errors.functional_resource = 'Please Select Function Resource'
    }
    if (showLevel3 && !Technical_resource) {
      errors.Technical_resource = 'Please Select Technical Resource'
    }

    setFormErrors(errors)
  }

  //GET API calls
  async function getProjects() {
    await fetch(`${BASE_URL}/api/getproject`)
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

  async function getUsers() {
    await fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && (user.role === 6 || user.role === 7))
        }
        setByUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }


  async function getProjectModules() {
    await fetch(`${BASE_URL}/api/getModules`)
      .then((response) => response.json())
      .then((data) => setProjectModule(data.Module))
      .catch((error) => console.log(error))
  }

  async function getFsf() {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationForm`)
      .then((response) => response.json())
      .then((data) => setAllFsf(data.Functional))
      .catch((error) => console.log(error))
  }

  async function getFsfByProjectAndModule() {
    await fetch(`${BASE_URL}/api/getFsfByProjectIdAndModuleId/${project_id}/${module_id}`)
      .then((response) => response.json())
      .then((data) => setFsfByProjectAndModule(data.FSFs))
      .catch((error) => console.log(error))
  }

  async function getCrfByReference(value) {
    setFsfId(value)
    await fetch(
      `${BASE_URL}/api/getCrfByProjectIdModuleIdAndFsfId/${project_id}/${module_id}/${value}`,
    )
      .then((response) => response.json())
      .then((data) => setByCrfReference(data.Crfs))
      .catch((error) => console.log(error))
  }

  // Add API call
  async function addCrfForm() {
    let data = {
      project_id,
      module_id,
      fsf_id,
      functional_id: local.Users.user_id,
      company_id: local.Users.company_id,
      reference: reference,
      project_manager,
      implementation_partner,
      issuance_date,
      author,
      doc_ref_no,
    }
    console.log(data)

    await fetch(`${BASE_URL}/api/addChangeRequestForm`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
      })
      .then((data) => {
        console.log('data: ', data)
        setRef_id(data.crf)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  async function addChangeRequestSummary() {
    let user = {
      crf_id: ref_id,
      crf_title,
      type_of_requirement,
      priority,
      with_in_project_scope,
      requirement,
      required_time_no,
      required_time_type,
      functional_resource,
      Technical_resource,
    }
    console.log(user)

    await fetch(`${BASE_URL}/api/addChangeRequestSummary`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick1()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Functions for Add CRF Success
  const [showAlert1, setShowAlert1] = useState(false)
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleButtonClick2() {
    setShowAlert2(true)
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

  return (
    <>
      {/* CRF Level 1 Form Starts */}
      {showLevel1 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Change Request Document
              </Typography>
            </Box>
          </Box>

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
                <div className="form-outline mb-6">
                  <h6 style={perStyle}>Project Name</h6>
                  <Box>
                    <Form.Item
                      name="project_id"
                      validateStatus={formErrors.project_id ? 'error' : ''}
                      help={formErrors.project_id}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Project"
                        onChange={handleProjectChange}
                        value={project_id}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {project.map((pro) => (
                          <Select.Option
                            value={pro.id}
                            key={pro.id}
                            project_name={pro.project_name}
                          >
                            {pro.project_name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Box>
                </div>

                <div className="form-outline mb-6">
                  <h6 style={perStyle}>Module Name</h6>
                  <Box>
                    <Form.Item
                      name="module_id"
                      validateStatus={formErrors.module_id ? 'error' : ''}
                      help={formErrors.module_id}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Module"
                        onChange={handleModuleChange}
                        value={module_id}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {projectmodule.map((proj) => (
                          <Select.Option value={proj.id} key={proj.id} module_name={proj.name}>
                            {proj.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Box>
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

      {/* CRF Level 2 Form Starts */}
      {showLevel2 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Change Request Document
              </Typography>
            </Box>
          </Box>

          <br></br>

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
                <div className="form-outline mb-6">
                  <h6 style={perStyle}>FSF</h6>
                  <Box>
                    <Form.Item
                      name="fsf_id"
                      validateStatus={formErrors.fsf_id ? 'error' : ''}
                      help={formErrors.fsf_id}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Fsf"
                        onChange={handleFsfChange}
                        value={fsf_id}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Select.Option value="0" key="none">
                          None
                        </Select.Option>
                        {fsfbyprojectandmodule.map((fsf) => (
                          <Select.Option value={fsf.id} key={fsf.id}>
                            {fsf.wricef_id}-{fsf.description}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Box>
                </div>

                <div className="form-outline mb-6">
                  <h6 style={perStyle}>Document Reference No</h6>
                  <Box>
                    <Form.Item
                      name="reference"
                      validateStatus={formErrors.reference ? 'error' : ''}
                      help={formErrors.reference}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Crf"
                        onChange={handleCrfReference}
                        value={reference}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Select.Option value="0" key="none">
                          None
                        </Select.Option>
                        {bycrfreference.map((crf) => (
                          <Select.Option value={crf.doc_ref_no} key={crf.id}>
                            {crf.doc_ref_no}-{crf.crf_version}{'.'}{crf.crf_version_float}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Box>
                </div>

                <div className="form-outline mb-6">
                  <h6 style={perStyle}>Project Manager</h6>
                  <Box>
                    <Form.Item
                      name="project_manager"
                      validateStatus={formErrors.project_manager ? 'error' : ''}
                      help={formErrors.project_manager}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Project Manager"
                        onChange={handleProjectManagerChange}
                        value={project_manager}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {byusers.map((user) => (
                          <Select.Option value={user.id} key={user.id}>
                            {user.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Box>
                </div>

                <Modal
                  title="Create FSF"
                  open={isModalVisible}
                  onCancel={() => setIsModalVisible(false)}
                  okButtonProps={{ style: { background: 'blue' } }}
                  style={modalStyle}
                  onOk={async () => {
                    await navigate('/fsf')
                    setIsModalVisible(false)
                  }}
                >
                  {/* Modal content */}
                  <p>Create Functional Specification Form first </p>
                </Modal>

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
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* CRF Change Request Summary Form Starts */}
      {showLevel3 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Change Request Summary
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>
                <div className="form-outline mb-3">
                  <h6 style={perStyle}>Title</h6>
                  <Form.Item
                    name="crf_title"
                    validateStatus={formErrors.crf_title ? 'error' : ''}
                    help={formErrors.crf_title}
                  >
                    <input
                      type="text"
                      value={crf_title}
                      onChange={(e) => setCrfTitle(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Title"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <h6 style={perStyle}>New Requirement Detail</h6>
                  <Form.Item
                    name="requirement"
                    validateStatus={formErrors.requirement ? 'error' : ''}
                    help={formErrors.requirement}
                  >
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter New Requirement Detail"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-6">
                  <h6 style={perStyle}>Type Of Requirement</h6>
                  <Box>
                    <Form.Item
                      name="type_of_requirement"
                      validateStatus={formErrors.type_of_requirement ? 'error' : ''}
                      help={formErrors.type_of_requirement}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Type of Requirement"
                        onChange={handleTypeOfRequirementChange}
                        value={type_of_requirement}
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
                    <Form.Item
                      name="priority"
                      validateStatus={formErrors.priority ? 'error' : ''}
                      help={formErrors.priority}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Priority"
                        onChange={handlePriorityChange}
                        value={priority}
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
                    <Form.Item
                      name="required_time_no"
                      validateStatus={formErrors.required_time_no ? 'error' : ''}
                      help={formErrors.required_time_no}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Required Time"
                        onChange={handleTimeChange}
                        value={required_time_no}
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
                    <Form.Item
                      name="required_time_type"
                      validateStatus={formErrors.required_time_type ? 'error' : ''}
                      help={formErrors.required_time_type}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Required Type"
                        onChange={handleTypeChange}
                        value={required_time_type}
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
                    <Form.Item
                      name="functional_resource"
                      validateStatus={formErrors.functional_resource ? 'error' : ''}
                      help={formErrors.functional_resource}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Required"
                        onChange={handleFunctionalResourceChange}
                        value={functional_resource}
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
                    <Form.Item
                      name="Technical_resource"
                      validateStatus={formErrors.Technical_resource ? 'error' : ''}
                      help={formErrors.Technical_resource}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Required"
                        onChange={handleTechnicalResourceChange}
                        value={Technical_resource}
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
                    <Form.Item
                      name="with_in_project_scope"
                      validateStatus={formErrors.with_in_project_scope ? 'error' : ''}
                      help={formErrors.with_in_project_scope}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder="Select Within Project Scope"
                        onChange={handleWithInProjectScopeChange}
                        value={with_in_project_scope}
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

                <Button
                  onClick={handleNext3}
                  style={successButtonStyle}
                  onMouseEnter={handleMouseEnterSuccess}
                  onMouseLeave={handleMouseLeaveSuccess}
                >
                  Submit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Alert for Add CRF Success*/}
      {showAlert1 && (
        <Alert severity="success" style={modalStyle2}>
          CRF Successfully Submitted
        </Alert>
      )}

      {/* Alert for Add CRF Failure*/}
      {showAlert2 && (
        <Alert severity="error" style={modalStyle2}>
          CRF Successfully Submitted
        </Alert>
      )}
    </>
  )
}

export default CRFform
