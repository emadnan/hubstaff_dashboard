import { React, useState, useEffect } from 'react';
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Modal, Button, Form, Select } from 'antd'
const BASE_URL = process.env.REACT_APP_BASE_URL

function TaskAssignment() {

    const session = JSON.parse(sessionStorage.getItem('user-info'))
    const local = JSON.parse(localStorage.getItem('user-info'))
    const session_token = session.token;

    const [user_id, setUserId] = useState("");
    const [project_id, setProjectId] = useState("");
    const [task_description, setTaskDescription] = useState("");
    const [start_date, setStartDate] = useState("");
    const [dead_line, setDeadLine] = useState("");

    const [users, setAllUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    var filteredUsers = [];

    //CSS Styling
    const mystyle = {
        color: "white",
        backgroundColor: "#0070FF ",
        padding: "15px",
        fontFamily: "Arial",
        textAlign: 'center',
        alignSelf: 'flex-end',
    };

    const buttonStyle = {
        float: "right",
        padding: "2px",
        width: "140px",
        backgroundColor: "white",
        fontWeight: "bold",
        color: "#0070ff",
    };

    const mystyle2 = {
        backgroundColor: 'white ',
    };

    //Initial rendering through useEffect
    useEffect(() => {
        getUsers()
        getProjects()
        getTasks()
    }, [])

    //Get calls handling
    const handleUserChange = (value) => {
        setUserId(value)
    }

    const handleProjectChange = (value) => {
        setProjectId(value)
    }

    // Functions for Assign Tasks Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        addTask()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    function getTasks() {
        fetch(`${BASE_URL}/api/getTasks`)
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === 7) {
                    filteredUsers = data.task.filter((user) => user.team_lead_id === local.Users.id)
                }
                setTasks(filteredUsers)
            })
            .catch((error) => console.log(error))
    };

    function getUsers() {
        fetch(`${BASE_URL}/api/get_users`)
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === 7) {
                    filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && user.role === 5)
                }
                setAllUsers(filteredUsers)
            })
            .catch((error) => console.log(error))
    };

    function getProjects() {
        fetch(`${BASE_URL}/api/getproject`)
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === 7) {
                    filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
                }
                setProjects(filteredUsers)
            })
            .catch((error) => console.log(error))
    }

    async function addTask() {
        var formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('team_lead_id', local.Users.role);
        formData.append('project_id', project_id);
        formData.append('task_description', task_description);
        formData.append('start_date', start_date);
        formData.append('dead_line', dead_line);
        await fetch(`${BASE_URL}/api/addTasks`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${session_token}`
            },
            body: formData,
        }).then(response => {
            if (response.ok) {
                // handleButtonClick3();
                // getMembers()
            } else {
                // handleButtonClick4();
            }
        })
            .catch(error => {
                console.error(error);
            });
    };


    return (
        <>
            <div className='row'>
                <div className='col-md 6'>
                    <h3>Task Management</h3>
                </div>
                <div className='col-md 6'>
                    {/* Assign a Task Button */}
                    <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Assign Task</Button>
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* Task Assignment table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Start Date</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Dead Line</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Task Details</CTableHeaderCell>
                    </CTableRow>

                    {
                        tasks.map((task, index) => (
                            <CTableRow key={task.id}>
                                <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle2}>{task.user_id}</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle2}>{task.project_id}</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle2}>{task.start_date}</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle2}>{task.dead_line}</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle2}>{task.task_description}</CTableHeaderCell>
                            </CTableRow>
                        ))
                    }

                </CTableHead>
                <CTableBody>

                    {/* Modal for Assign Task */}
                    <Modal
                        title="Add a Project"
                        open={isModalOpen}
                        onOk={handleOk}
                        okButtonProps={{ style: { background: 'blue' } }}
                        onCancel={handleCancel}
                        maskClosable={false}
                    >
                        <br></br>
                        <div className="form-outline mb-3">
                            <label>User</label>
                            <Form.Item>
                                <Select
                                    placeholder="Select Departments"
                                    onChange={handleUserChange}
                                    value={user_id}
                                >
                                    {users.map((user) => (
                                        <Select.Option value={user.id} key={user.id}>
                                            {user.name}
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
                                    {projects.map((pro) => (
                                        <Select.Option value={pro.id} key={pro.id}>
                                            {pro.project_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="form-outline mb-3">
                            <label>Task Description</label>
                            <input
                                type="text"
                                value={task_description}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Description"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Start Date</label>
                            <input
                                type="date"
                                value={start_date}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Start Date"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>End Date</label>
                            <input
                                type="date"
                                value={dead_line}
                                onChange={(e) => setDeadLine(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Dead Line"
                            />
                        </div>
                    </Modal>

                </CTableBody>
            </CTable>
        </>
    )
}

export default TaskAssignment