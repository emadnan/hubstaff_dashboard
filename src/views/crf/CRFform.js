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
    const [projectname, setProjectName] = useState('')
    const [modulename, setModuleName] = useState('')

    const [project, setProjects] = useState([])
    const [projectmodule, setProjectModule] = useState([])
    const [allfsf, setAllFsf] = useState([])
    var filteredUsers = []
    const navigate = useNavigate()

    //CSS Styling
    const [isHoveredPrimary, setIsHoveredPrimary] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);

    const primaryButtonStyle = {
        backgroundColor: isHoveredPrimary ? '#6699CC' : 'blue',
        color: 'white',
        transition: 'background-color 0.3s',
    }

    const modalStyle = {
        position: 'fixed',
        top: '40%',
        left: '40%',
    }

    const handleMouseEnterPrimary = () => {
        setIsHoveredPrimary(true)
    }

    const handleMouseLeavePrimary = () => {
        setIsHoveredPrimary(false)
    }

    const [showLevel1, setShowLevel1] = useState(true)
    const [showLevel2, setShowLevel2] = useState(false)

    const handleNext1 = () => {
        setShowLevel1(false)
        setShowLevel2(true)
    }

    //Initial rendering
    useEffect(() => {
        getProjects()
        getProjectModules()
        getFsf()
    }, [])

    const handleProjectChange = (value, option) => {
        setProjectId(value)
        setProjectName(option.project_name)
    }

    const handleModuleChange = (value, option) => {
        setModuleId(value)
        setModuleName(option.module_name)
    }

    const handleFsfChange = (value) => {
        if (value === "0") {
            setIsModalVisible(true);
        } else {
            setFsfId(value)
        }
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
                                    <label>Project Name</label>
                                    <Form.Item>
                                        <Select
                                            showSearch
                                            placeholder="Select Project"
                                            onChange={handleProjectChange}
                                            value={project_id}
                                            name="project_id"
                                            // onFocus={handleFocus}
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                                    <label>Module Name</label>
                                    <Form.Item>
                                        <Select
                                            showSearch
                                            placeholder="Select Module"
                                            onChange={handleModuleChange}
                                            value={module_id}
                                            name="module_id"
                                            // onFocus={handleFocus}
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                                    <label>FSF</label>
                                    <Form.Item>
                                        <Select
                                            showSearch
                                            placeholder="Select FSF"
                                            onChange={handleFsfChange}
                                            value={fsf_id}
                                            name="fsf_id"
                                            // onFocus={handleFocus}
                                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option value="0" key="none">
                                                None
                                            </Select.Option>
                                            {allfsf.map((fsf) => (
                                                <Select.Option value={fsf.id} key={fsf.id}>
                                                    {fsf.wricef_id}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
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

                                {/* <div className="form-outline mb-3">
                                    <label>Implementation Partner</label>
                                    <Form.Item>
                                        <input
                                            type="text"
                                            value="BiafoTech"
                                            readOnly
                                            className="form-control form-control-lg"
                                            placeholder="Enter Field Technical Name"
                                        />
                                    </Form.Item>
                                </div> */}

                                {/* <div className="form-outline mb-3">
                                    <label>Reference Id</label>
                                    <Select
                                        placeholder="Select Reference Id"
                                        onChange={handleReferenceIdChange}
                                        value={reference_id}
                                        name="reference_id"
                                        onFocus={handleFocus}
                                    >
                                        <Select.Option value="0" key="none">
                                            None
                                        </Select.Option>
                                        {fsfwricef.map((fsf) => (
                                            <Select.Option value={fsf.id} key={fsf.id}>
                                                {fsf.wricef_id}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div> */}

                                {/* <div className="form-outline mb-3">
                                    <label>Module</label>
                                    <Select
                                        placeholder="Select Module"
                                        onChange={handleModuleChange}
                                        value={module_id}
                                        name="module_id"
                                        onFocus={handleFocus}
                                    >
                                        {projectmodule.map((proj) => (
                                            <Select.Option value={proj.id} key={proj.id} module_name={proj.name}>
                                                {proj.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div> */}

                                {/* <div className="form-outline mb-3">
                                    <label>Project</label>
                                    <Select
                                        placeholder="Select Project"
                                        onChange={handleProjectChange}
                                        value={project_id}
                                        name="project_id"
                                        onFocus={handleFocus}
                                    >
                                        {project.map((pro) => (
                                            <Select.Option value={pro.id} key={pro.id} project_name={pro.project_name}>
                                                {pro.project_name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div> */}

                                {/* <div className="form-outline mb-3">
                                    <label>Type of Development</label>
                                    <Select
                                        placeholder="Select Type of Development"
                                        onChange={handleTypeOfDevelopmentChange}
                                        value={type_of_development}
                                        name="type_of_development"
                                        onFocus={handleFocus}
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
                                </div> */}

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
        </>
    )
}

export default CRFform