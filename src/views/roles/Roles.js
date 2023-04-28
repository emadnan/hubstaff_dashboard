import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button, Divider, Checkbox } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';


const Roles = () => {

    // Variable declarations
    const [name, setName] = useState("");

    //Local Storage data
    const local = JSON.parse(localStorage.getItem('user-info'));
    const permissions = local.permissions;
    const perm = permissions.map(permission => ({
        name: permission.name,
    }));

    //Role & Permissions check
    const isCreateButtonEnabled = perm.some(item => item.name === 'Create_Role');
    const isEditButtonEnabled = perm.some(item => item.name === 'Update_Role');
    const isDeleteButtonEnabled = perm.some(item => item.name === 'Delete_Role');
    const isAssignPermissionEnabled = perm.some(item => item.name === 'Assign_Permission');

    // CSS Stylings
    const modalStyle = {
        position: "fixed",
        top: "25%",
        left: "40%",
    };

    const heading = {
        display: 'flex',
        justifyContent: 'flex-end',
        float: 'right',
    };

    const modalStyle2 = {
        position: "fixed",
        top: "10%",
        left: "55%",
        transform: "translateX(-50%)",
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

    const mystyle2 = {
        backgroundColor: "white ",
    };

    // Functions for Add Role Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        addRole()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Functions for Delete Role Modal
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const showModal2 = (id) => {
        setIsModalOpen2(id);
    };

    const handleOk2 = () => {
        deleteRole(isModalOpen2);
        setIsModalOpen2(false);
    };

    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    // Functions for Update Role Modal
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const showModal3 = (id) => {
        getRoleById(id)
        setIsModalOpen3(id);
    };

    const handleOk3 = () => {
        updateRole(isModalOpen3);
        setIsModalOpen3(false);
    };

    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    // Functions for Assign Users Modal
    const [isModalOpen4, setIsModalOpen4] = useState(false);
    const showModal4 = (id) => {
        getHasPermissions(id)
        setIsModalOpen4(id);
    };

    const handleOk4 = () => {
        assignPermissions(isModalOpen4)
        setIsModalOpen4(false);
    };

    const handleCancel4 = () => {
        setIsModalOpen4(false);
    };

    // Functions for Add Role Success
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

    // Functions for Add Role Failure
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

    // Functions for Delete Role Success
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

    // Functions for Delete Role Failure
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

    // Functions for Update Role Success
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

    // Functions for Update Role Failure
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

    // Functions for Assign Permission Success
    const [showAlert7, setShowAlert7] = useState(false);

    function handleButtonClick7() {
        setShowAlert7(true);
    }

    function handleCloseAlert7() {
        setShowAlert7(false);
    }

    useEffect(() => {
        if (showAlert7) {
            const timer = setTimeout(() => {
                setShowAlert7(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert7]);

    // Functions for Assign Permissions Failure
    const [showAlert8, setShowAlert8] = useState(false);

    function handleButtonClick8() {
        setShowAlert8(true);
    }

    function handleCloseAlert8() {
        setShowAlert8(false);
    }

    useEffect(() => {
        if (showAlert8) {
            const timer = setTimeout(() => {
                setShowAlert8(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert8]);

    //Function for checkbox handling
    const handleSelectUser = (e, permId) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, permId]);
        } else {
            setSelectedUsers(selectedUsers.filter((id) => id !== permId));
        }
    };

    //Array declarations for API calls
    const [roles, setRoles] = useState([]);
    const [permission, setPermission] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [getrole, setRoleById] = useState([]);
    const [haspermission, setHasPermission] = useState([]);

    //Initial rendering through useEffect
    useEffect(() => {
        getRoles()
        getPermission()
    }, []);

    useEffect(() => {
        setSelectedUsers(haspermission);
    }, [haspermission]);

    // Get API call
    function getRoles() {
        fetch("http://10.3.3.80/api/getroles")
            .then((response) => response.json())
            .then((data) => setRoles(data.roles))
            .catch((error) => console.log(error));
    };

    function getPermission() {
        fetch("http://10.3.3.80/api/getpermissions")
            .then((response) => response.json())
            .then((data) => setPermission(data.permissions))
            .catch((error) => console.log(error));
    };

    function getRoleById(id) {
        fetch(`http://10.3.3.80/api/get_roles_by_id/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setRoleById(data.roles);
                setName(data.roles[0].name);
            })
            .catch((error) => console.log(error));
    };

    function getHasPermissions(id) {
        fetch(`http://10.3.3.80/api/get-permission-by-id/${id}`)
            .then((response) => response.json())
            .then((data) => {
                const temp_array = data.Permission.map(element => element.permission_id);
                setHasPermission(temp_array);
                console.log(temp_array);
            })
            .catch((error) => console.log(error));
    };

    // Add API call
    async function addRole() {
        let addrole = { name }

        await fetch("http://10.3.3.80/api/addrole",
            {
                method: 'POST',
                body: JSON.stringify(addrole),
                headers: {
                    'Content-Type': 'application/json'
                },

            }).then(response => {
                if (response.ok) {
                    handleButtonClick1();
                    getRoles()
                } else {
                    handleButtonClick2();
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Delete API call
    async function deleteRole(newid) {
        await fetch('http://10.3.3.80/api/delete-role', {
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
                getRoles()
            } else {
                handleButtonClick4();
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    // Update API call
    async function updateRole(newid) {
        await fetch('http://10.3.3.80/api/update-role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid,
                name: name,
            })
        }).then(response => {
            if (response.ok) {
                handleButtonClick5();
                getRoles()
            } else {
                handleButtonClick6();
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    //Assign Permissions API call
    async function assignPermissions(newid) {
        await fetch('http://10.3.3.80/api/role-permissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role_id: newid,
                permissions: selectedUsers,
            })
        }).then(response => {
            if (response.ok) {
                handleButtonClick7();
                getPermission()
            } else {
                handleButtonClick8();
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
                    <h3>Roles</h3>
                </div>
                <div className='col-md 6'>
                    {/* Add Roles Button */}
                    {isCreateButtonEnabled ? (
                        <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Role</Button>
                    ) : null}
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* Users table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Role Name</CTableHeaderCell>
                        {isEditButtonEnabled || isDeleteButtonEnabled ? (
                            <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
                        ) : null}
                        {isAssignPermissionEnabled ? (
                            <CTableHeaderCell className="text-center" style={mystyle}>Assign</CTableHeaderCell>
                        ) : null}
                    </CTableRow>

                    {/* Get API Users */}
                    {
                        local.Users.role === "1" || local.Users.role === "3" ?
                            roles.map((role, index) => (
                                <CTableRow key={role.id}>
                                    <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center" style={mystyle2}>{role.name}</CTableHeaderCell>
                                    {isEditButtonEnabled || isDeleteButtonEnabled ? (
                                        <CTableHeaderCell className="text-center" style={mystyle2}>
                                            {isEditButtonEnabled ? (
                                                <IconButton aria-label="update" title="Update" onClick={() => showModal3(role.id)}>
                                                    <EditIcon htmlColor='#28B463' />
                                                </IconButton>
                                            ) : null}
                                            {isDeleteButtonEnabled ? (
                                                <IconButton aria-label="delete" title="Delete" onClick={() => showModal2(role.id)}>
                                                    <DeleteIcon htmlColor='#FF0000' />
                                                </IconButton>
                                            ) : null}
                                        </CTableHeaderCell>
                                    ) : null}
                                    {isAssignPermissionEnabled ? (
                                        <CTableHeaderCell className="text-center" style={mystyle2}>
                                            <IconButton aria-label="assign" title="Assign Permission" onClick={() => showModal4(role.id)}>
                                                <PermContactCalendarIcon htmlColor='#0070ff' />
                                            </IconButton>
                                        </CTableHeaderCell>
                                    ) : null}
                                </CTableRow>
                            )) : null
                    }
                </CTableHead>
                <CTableBody>
                </CTableBody>
            </CTable>

            {/* Modal for Add Role */}
            <Modal title="Add a Role" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <br></br>

                <div className="form-outline mb-3">
                    <label>Role</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control form-control-lg"
                        placeholder="Enter Role Name"
                    />
                </div>

            </Modal>

            {/* Modal for Update Role */}
            <Modal title="Update a Role" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3}>

                <br></br>

                {getrole.map((role) => (
                    <div key={role.id}>
                        <div className="form-outline mb-3">
                            <input
                                type="text"
                                defaultValue={role.name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Role Name"
                            />
                        </div>
                    </div>
                ))}

            </Modal>

            {/* Modal for Deletion Confirmation */}
            <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
            </Modal>

            {/* Modal for Assign Permissions */}
            <Modal title="Assign Permissions" open={isModalOpen4} onOk={handleOk4} onCancel={handleCancel4}>

                <br></br>
                <div className='row'>
                    <div className='col md-2 text-center'>
                        <h6>Sr/No</h6>
                    </div>
                    <div className='col md-3'></div>
                    <div className='col md-2 text-center'>
                        <h6>Permissions</h6>
                    </div>
                    <div className='col md-3'></div>
                    <div className='col md-2 text-center'>
                        <h6 style={heading}>Select</h6>
                    </div>
                    &nbsp;
                    <Divider></Divider>
                </div>

                <div>
                    {permission.map((perm, index) => (
                        <div className='row' key={perm.id}>
                            <div className='col md-2 text-center'>
                                <h6>{index + 1}</h6>
                            </div>
                            <div className='col md-3'></div>
                            <div className='col md-2 text-center'>
                                <h6>{perm.name}</h6>
                            </div>
                            <div className='col md-3'></div>
                            <div className='col md-2 text-center'>
                                <Checkbox
                                    checked={selectedUsers.includes(perm.id)}
                                    onChange={(e) => handleSelectUser(e, perm.id)}
                                />
                            </div>
                            &nbsp;
                            <Divider />
                        </div>
                    ))}
                </div>
            </Modal>

            {/* Alert for Add Role Success*/}
            {showAlert1 && (
                <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
                    Role Added Successfully
                </Alert>
            )}

            {/* Alert for Add Role Failure*/}
            {showAlert2 && (
                <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                    Failed to Add Role
                </Alert>
            )}

            {/* Alert for Delete Role Success*/}
            {showAlert3 && (
                <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
                    Role Deleted Successfully
                </Alert>
            )}

            {/* Alert for Delete Role Failure*/}
            {showAlert4 && (
                <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
                    Failed to Delete Role
                </Alert>
            )}

            {/* Alert for Update Role Success*/}
            {showAlert5 && (
                <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
                    Role Updated Successfully
                </Alert>
            )}

            {/* Alert for Update Role Failure*/}
            {showAlert6 && (
                <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
                    Failed to Update Role
                </Alert>
            )}

            {/* Alert for Permission Assign Success*/}
            {showAlert7 && (
                <Alert onClose={handleCloseAlert7} severity="success" style={modalStyle2}>
                    Permissions Assigned Successfully
                </Alert>
            )}

            {/* Alert for Permission Assign Failure*/}
            {showAlert8 && (
                <Alert onClose={handleCloseAlert8} severity="error" style={modalStyle2}>
                    Failed to Assign Permissions
                </Alert>
            )}
        </>
    )
}

export default Roles