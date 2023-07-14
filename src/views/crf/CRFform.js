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
    const [implementation_partner, setImplementationPartner] = useState('BiafoTech')
    const [issuance_date, setIssuanceDate] = useState('')
    const [author, setAuthor] = useState(local.Users.name)
    const [projectname, setProjectName] = useState('')
    const [modulename, setModuleName] = useState('')
    let user = { project_id, module_id, fsf_id, implementation_partner, issuance_date, author }

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

    const selectstyle = {
        height: '40px',
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

                                <div className="form-outline mb-6">
                                    <h6>FSF</h6>
                                    <Box>
                                        <Form.Item name="selectFsf" hasFeedback>
                                            <Select showSearch placeholder="Select Fsf" onChange={handleFsfChange} value={fsf_id} filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
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
                                    </Box>
                                </div>

                                <div className="form-outline mb-3">
                                    <h6>Implementation Partner</h6>
                                    <Form.Item>
                                        <input
                                            type="text"
                                            value={implementation_partner}
                                            className="form-control form-control-lg"
                                            placeholder="Enter Field Table Name"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-outline mt-3">
                                    <h6>Issuance Date</h6>
                                    <Form.Item>
                                        <input
                                            type="date"
                                            name="issuance_date"
                                            value={issuance_date}
                                            className="form-control form-control-lg"
                                            placeholder="Enter Issuance Date"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-outline mb-3">
                                    <h6>Author</h6>
                                    <Form.Item>
                                        <input
                                            type="text"
                                            value={author}
                                            className="form-control form-control-lg"
                                            placeholder="Enter Field Table Name"
                                        />
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

                                <Button
                                    // onClick={handleNext1}
                                    onClick={() => console.log(user)}
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