import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Users = () => {

    // Variable declarations
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const local = JSON.parse(localStorage.getItem('user-info'));
    const permissions = local.permissions;

    const perm = permissions.map(permission => ({
        name: permission.name,
    }));

    const isCreateButtonEnabled = perm.some(item => item.name === 'Create_User');
    const isEditButtonEnabled = perm.some(item => item.name === 'Update_User');
    const isDeleteButtonEnabled = perm.some(item => item.name === 'Delete_User');

    // CSS Stylings
    const modalStyle = {
        position: "fixed",
        top: "25%",
        left: "40%",
    };

    const modalStyle2 = {
        position: "fixed",
        top: "10%",
        left: "55%",
        transform: "translateX(-50%)",
    };

    const mystyle2 = {
        backgroundColor: "white ",
    };

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
        width: "120px",
        backgroundColor: "white",
        fontWeight: "bold",
        color: "#0070ff",
    };

    // Functions for Add User Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        addUser()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Functions for Delete User Modal
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const showModal2 = (id) => {
        setIsModalOpen2(id);
    };

    const handleOk2 = () => {
        deleteUser(isModalOpen2);
        setIsModalOpen2(false);
    };

    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    // Functions for Update User Modal
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const showModal3 = (id) => {
        // getUserById(id);
        setIsModalOpen3(id);
    };

    const handleOk3 = () => {
        updateUser(isModalOpen3);
        setIsModalOpen3(false);
    };

    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    // Functions for Add User Success
    const [showAlert1, setShowAlert1] = useState(false);

    function handleButtonClick1() {
        setShowAlert1(true);
    }

    function handleCloseAlert1() {
        setShowAlert1(false);
    }

    useEffect(() => {
        if (showAlert1) {
            const timer = setTimeout(() => {
                setShowAlert1(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert1]);

    // Functions for Add User Failure
    const [showAlert2, setShowAlert2] = useState(false);

    function handleButtonClick2() {
        setShowAlert2(true);
    }

    function handleCloseAlert2() {
        setShowAlert2(false);
    }

    useEffect(() => {
        if (showAlert2) {
            const timer = setTimeout(() => {
                setShowAlert2(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert2]);

    // Functions for Delete User Success
    const [showAlert3, setShowAlert3] = useState(false);

    function handleButtonClick3() {
        setShowAlert3(true);
    }

    function handleCloseAlert3() {
        setShowAlert3(false);
    }

    useEffect(() => {
        if (showAlert3) {
            const timer = setTimeout(() => {
                setShowAlert3(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert3]);

    // Functions for Delete User Failure
    const [showAlert4, setShowAlert4] = useState(false);

    function handleButtonClick4() {
        setShowAlert4(true);
    }

    function handleCloseAlert4() {
        setShowAlert4(false);
    }

    useEffect(() => {
        if (showAlert4) {
            const timer = setTimeout(() => {
                setShowAlert4(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert4]);

    // Functions for Update User Success
    const [showAlert5, setShowAlert5] = useState(false);

    function handleButtonClick5() {
        setShowAlert5(true);
    }

    function handleCloseAlert5() {
        setShowAlert5(false);
    }

    useEffect(() => {
        if (showAlert5) {
            const timer = setTimeout(() => {
                setShowAlert5(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert5]);

    // Functions for Update User Failure
    const [showAlert6, setShowAlert6] = useState(false);

    function handleButtonClick6() {
        setShowAlert6(true);
    }

    function handleCloseAlert6() {
        setShowAlert6(false);
    }

    useEffect(() => {
        if (showAlert6) {
            const timer = setTimeout(() => {
                setShowAlert6(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert6]);

    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    var filteredUsers = [];

    // Get API call
    function getList() {
        fetch("http://10.3.3.80/api/get_users")
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === "1") {
                    filteredUsers = data.Users;
                }
                else if (local.Users.role === "3") {
                    filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id);
                }
                else if (local.Users.role === "5") {
                    filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id);
                }
                setUsers(filteredUsers);
            })
            .catch((error) => console.log(error));
    };

    function getRoles() {
        fetch("http://10.3.3.80/api/getroles")
            .then((response) => response.json())
            .then((data) => setRoles(data.roles))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getList();
        getRoles()
    }, [getList, getRoles]);

    //Get calls handling
    const handleRoleChange = (value) => {
        setRole(value);
    };

    // Add API call
    async function addUser() {
        let adduser = { name, email, password, role, company_id: local.Users.company_id}
        console.log(adduser);

        await fetch("http://10.3.3.80/api/add_user",
            {
                method: 'POST',
                body: JSON.stringify(adduser),
                headers: {
                    'Content-Type': 'application/json'
                },

            }).then(response => {
                if (response.ok) {
                    handleButtonClick1();
                    getList()
                } else {
                    handleButtonClick2();
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Delete API call
    async function deleteUser(newid) {
        await fetch('http://10.3.3.80/api/delete_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid
            })
        }).then(response => {
            if (response.ok) {
                handleButtonClick3();
                getList()
            } else {
                handleButtonClick4();
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    // Update API call
    async function updateUser(newid) {
        await fetch('http://10.3.3.80/api/update_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid,
                name: name,
                email: email,
                password: password,
                role: role,

            })
        }).then(response => {
            if (response.ok) {
                handleButtonClick5();
                getList()
            } else {
                handleButtonClick6();
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    return (
        <>
            <div className='row'>
                <div className='col-md 6'>
                    <h3>Users</h3>
                </div>
                <div className='col-md 6'>
                    {/* Add Users Button */}
                    {isCreateButtonEnabled ? (
                        <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add User</Button>
                    ) : null}
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* Users table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>User Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Email</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Role</CTableHeaderCell>
                        {isEditButtonEnabled || isDeleteButtonEnabled ? (
                            <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
                        ) : null}
                    </CTableRow>

                    {/* Get API Users */}
                    {users.map((user, index) => (
                        <CTableRow key={user.id}>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{user.name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{user.email}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{user.role}</CTableHeaderCell>
                            {isEditButtonEnabled || isDeleteButtonEnabled ? (
                                <CTableHeaderCell className="text-center" style={mystyle2}>
                                    {isEditButtonEnabled ? (
                                        <IconButton aria-label="update" onClick={() => showModal3(user.id)}>
                                            <EditIcon htmlColor='#28B463' />
                                        </IconButton>
                                    ) : null}
                                    {isDeleteButtonEnabled ? (
                                        <IconButton aria-label="delete" onClick={() => showModal2(user.id)}>
                                            <DeleteIcon htmlColor='#FF0000' />
                                        </IconButton>
                                    ) : null}
                                </CTableHeaderCell>
                            ) : null}
                        </CTableRow>
                    ))}

                </CTableHead>
                <CTableBody>

                    {/* Modal for Add User */}
                    <Modal title="Add a User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                        <br></br>

                        <div className="form-outline mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter User Name"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Email"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Password"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Role</label>
                            <Form.Item>
                                <Select placeholder='Select' onChange={handleRoleChange} value={role}>
                                    {roles.map((user) => (
                                        <Select.Option value={user.id} key={user.id}>
                                            {user.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                    </Modal>

                    {/* Modal for Update User */}
                    <Modal title="Update a User" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3}>

                        <br></br>

                        <div className="form-outline mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter User Name"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Email"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Password"
                            />
                        </div>

                        <div className="form-outline mb-3">
                            <label>Role</label>
                            <Form.Item>
                                <Select placeholder="Select Role Id" onChange={handleRoleChange} value={role}>
                                    {roles.map((user) => (
                                        <Select.Option value={user.id} key={user.id}>
                                            {user.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </Modal>

                    {/* Modal for Deletion Confirmation */}
                    <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
                    </Modal>

                    {/* Alert for Add User Success*/}
                    {showAlert1 && (
                        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
                            User Added Successfully
                        </Alert>
                    )}

                    {/* Alert for Add User Failure*/}
                    {showAlert2 && (
                        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                            Failed to Add User
                        </Alert>
                    )}

                    {/* Alert for Delete User Success*/}
                    {showAlert3 && (
                        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
                            User Deleted Successfully
                        </Alert>
                    )}

                    {/* Alert for Delete User Failure*/}
                    {showAlert4 && (
                        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
                            Failed to Delete User
                        </Alert>
                    )}

                    {/* Alert for Update User Success*/}
                    {showAlert5 && (
                        <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
                            User Updated Successfully
                        </Alert>
                    )}

                    {/* Alert for Update User Failure*/}
                    {showAlert6 && (
                        <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
                            Failed to Update User
                        </Alert>
                    )}

                </CTableBody>
            </CTable>
        </>
    );
}

export default Users;