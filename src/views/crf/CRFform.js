import { React, useState, useEffect } from 'react'
import { Select, Form, Modal } from 'antd'
import { Box, Typography } from '@mui/material'
import { Card, CardContent, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

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
    const [reference, setReference] = useState('')
    const [projectname, setProjectName] = useState('')
    const [modulename, setModuleName] = useState('')
    const [crf_id, setCrfId] = useState('')
    const [ref_id, setRef_id] = useState()
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
        const currentDate = getCurrentDate();
        setIssuanceDate(currentDate);
        setImplementationPartner(local.Users.company_name);
        setAuthor(local.Users.name);

        // const uniqueNumber = Math.floor(Math.random() * 1000);
        const concatenatedId = `Biafo-${projectname}-${modulename}`;
        setDocRefNo(concatenatedId);
    }, [projectname, modulename]);

    const [project, setProjects] = useState([])
    const [projectmodule, setProjectModule] = useState([])
    const [allfsf, setAllFsf] = useState([])
    const [fsfbyprojectandmodule, setFsfByProjectAndModule] = useState([])
    const [bycrfreference, setByCrfReference] = useState([])
    var filteredUsers = []
    const navigate = useNavigate()

    //CSS Styling
    const [isHoveredPrimary, setIsHoveredPrimary] = useState(false)
    const [isHoveredDanger, setIsHoveredDanger] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);

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

    const modalStyle = {
        position: 'fixed',
        top: '40%',
        left: '40%',
    }

    const selectstyle = {
        height: '40px',
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

    const [showLevel1, setShowLevel1] = useState(true)
    const [showLevel2, setShowLevel2] = useState(false)
    const [showLevel3, setShowLevel3] = useState(false)

    const handleNext1 = () => {
        setShowLevel1(false)
        setShowLevel2(true)
        getFsfByProjectAndModule()
        // addCrfForm()
    }

    const handleNext2 = () => {
        setShowLevel2(false)
        setShowLevel3(true)
        addCrfForm()
    }

    const handleBack2 = () => {
        setShowLevel2(false)
        setShowLevel1(true)
    }

    const handleNext3 = () => {
        setShowLevel3(false)
        addChangeRequestSummary()
        setTimeout(() => {
            navigate('/allcrf')
          }, 2000)
    }

    //Initial rendering
    useEffect(() => {
        getProjects()
        getProjectModules()
        getFsf()
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setIssuanceDate(formattedDate);
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
        console.log(value);
        if (value === "0") {
            setIsModalVisible(true);
        } else {
            // setFsfId(value)
            handleReference(value)
        }
    }

    const handleReference = (value) => {
        getCrfByReference(value)
    }

    const handleTimeChange = (value) => {
        setRequiredTime(value)
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
        await fetch(`${BASE_URL}/api/getCrfByProjectIdModuleIdAndFsfId/${project_id}/${module_id}/${value}`)
            .then((response) => response.json())
            .then((data) => setByCrfReference(data.Crfs))
            .catch((error) => console.log(error))
    }

    // Add API call
    async function addCrfForm() {
        let data = { project_id, module_id, fsf_id, company_id: local.Users.company_id, reference: reference, implementation_partner, issuance_date, author, doc_ref_no }
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
                    // handleButtonClick1()
                    // getList()
                } else {
                    // handleButtonClick2()
                }
            })
            .then((data) => {
                console.log("data: ",data)
                setRef_id(data.crf)
              })
            .catch((error) => {
                console.error(error)
            })
    }

    async function addChangeRequestSummary() {
        let user = { crf_id: ref_id, requirement, required_time_no, required_time_type, functional_resource, Technical_resource}
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
                    // handleButtonClick1()
                    // getList()
                } else {
                    // handleButtonClick2()
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

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
                                    <h6>Project Name</h6>
                                    <Box>
                                        <Form.Item name="selectProject" hasFeedback>
                                            <Select showSearch placeholder="Select Project" onChange={handleProjectChange} value={project_id} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                {project.map((pro) => (
                                                    <Select.Option value={pro.id} key={pro.id} project_name={pro.project_name}>
                                                        {pro.project_name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Box>
                                </div>

                                <div className="form-outline mb-6">
                                    <h6>Module Name</h6>
                                    <Box>
                                        <Form.Item name="selectModule" hasFeedback>
                                            <Select showSearch placeholder="Select Module" onChange={handleModuleChange} value={module_id} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
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
                                    <h6>FSF</h6>
                                    <Box>
                                        <Form.Item name="selectFsf" hasFeedback>
                                            <Select showSearch placeholder="Select Fsf" onChange={handleFsfChange} value={fsf_id} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
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
                                    <h6>Document Reference No</h6>
                                    <Box>
                                        <Form.Item name="selectCrf" hasFeedback>
                                            <Select showSearch placeholder="Select Crf" onChange={handleCrfReference} value={reference} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                <Select.Option value="0" key="none">
                                                    None
                                                </Select.Option>
                                                {bycrfreference.map((crf) => (
                                                    <Select.Option value={crf.doc_ref_no} key={crf.id}>
                                                        {crf.doc_ref_no}-{crf.crf_version}
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
                                        await navigate('/fsf');
                                        setIsModalVisible(false);
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
                                    <label>Requirement</label>
                                    <Form.Item>
                                        <input
                                            type="text"
                                            value={requirement}
                                            onChange={(e) => setRequirement(e.target.value)}
                                            className="form-control form-control-lg"
                                            placeholder="Enter Requirements"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-outline mb-6 time-container">
                                    <h6>Required Time</h6>
                                    <Box>
                                        <Form.Item name="selectTime" hasFeedback>
                                            <Select showSearch placeholder="Select Required Time" onChange={handleTimeChange} value={required_time_no} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
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
                                        <Form.Item name="selectType" hasFeedback>
                                            <Select showSearch placeholder="Select Required Type" onChange={handleTypeChange} value={required_time_type} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                <Select.Option value="hours" >hours</Select.Option>
                                                <Select.Option value="days" >days</Select.Option>
                                                <Select.Option value="weeks" >weeks</Select.Option>
                                                <Select.Option value="months" >months</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Box>
                                </div>

                                <div className="form-outline mb-6">
                                    <h6>Functional Resource</h6>
                                    <Box>
                                        <Form.Item name="selectResource" hasFeedback>
                                            <Select showSearch placeholder="Select Required" onChange={handleFunctionalResourceChange} value={functional_resource} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                <Select.Option value="Yes" >Yes</Select.Option>
                                                <Select.Option value="No" >No</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Box>
                                </div>

                                <div className="form-outline mb-6">
                                    <h6>Technical Resource</h6>
                                    <Box>
                                        <Form.Item name="selectTechnical" hasFeedback>
                                            <Select showSearch placeholder="Select Required" onChange={handleTechnicalResourceChange} value={Technical_resource} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                                <Select.Option value="Yes" >Yes</Select.Option>
                                                <Select.Option value="No" >No</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Box>
                                </div>

                                <Button
                                    onClick={handleNext3}
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
        </>
    )
}

export default CRFform