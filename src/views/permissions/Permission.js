import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Permission = () => {

    // Variable declarations
    const [name, setName] = useState("");

    // const [guard_name, setGuardName] = useState("");

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
        backgroundColor: "#0070ff",
        fontWeight: "bold",
        color: "white",
    };

    // Functions for Add Permission Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        addPermission()
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Functions for Delete Permission Modal
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const showModal2 = (id) => {
        setIsModalOpen2(id);
    };

    const handleOk2 = () => {
        deletePermission(isModalOpen2);
        setIsModalOpen2(false);
    };

    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    // Functions for Update Permission Modal
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const showModal3 = (id) => {
        setIsModalOpen3(id);
    };

    const handleOk3 = () => {
        updatePermission(isModalOpen3);
        setIsModalOpen3(false);
    };

    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    // Functions for Add Permission Success
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

    // Functions for Add Permission Failure
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

    // Functions for Delete Permission Success
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

    // Functions for Delete Permission Failure
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

    // Functions for Update Permission Success
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

    // Functions for Update Permission Failure
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

    const [permission, setPermission] = useState([]);

    // Get API call
    function getPermission() {
        fetch("http://10.3.3.80/api/getpermissions")
            .then((response) => response.json())
            .then((data) => setPermission(data.permissions))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getPermission()
    }, []);

    // Add API call
    async function addPermission() {
        let addpermission = { name }

        await fetch("http://10.3.3.80/api/addpermission",
            {
                method: 'POST',
                body: JSON.stringify(addpermission),
                headers: {
                    'Content-Type': 'application/json'
                },

            }).then(response => {
                if (response.ok) {
                    handleButtonClick1();
                    getPermission()
                } else {
                    handleButtonClick2();
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Delete API call
    async function deletePermission(newid) {
        await fetch('http://10.3.3.80/api/delete-permission', {
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
                getPermission()
            } else {
                handleButtonClick4();
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    // Update API call
    async function updatePermission(newid) {
        await fetch('http://10.3.3.80/api/update-permission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid,
                name: name,
                // guard_name: guard_name,
            })
        }).then(response => {
            if (response.ok) {
                handleButtonClick5();
                getPermission()
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
                    <h3>Permissions</h3>
                </div>
                <div className='col-md 6'>
                    {/* Add Permission Button */}
                    <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Permission</Button>
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* Users table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Permission Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
                    </CTableRow>

                    {/* Get API Users */}
                    {permission.map((perm, index) => (
                        <CTableRow key={perm.id}>
                            <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">{perm.name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                                <IconButton aria-label="update" onClick={() => showModal3(perm.id)}>
                                    <EditIcon htmlColor='#28B463' />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => showModal2(perm.id)}>
                                    <DeleteIcon htmlColor='#FF0000' />
                                </IconButton>

                            </CTableHeaderCell>
                        </CTableRow>
                    ))}

                </CTableHead>
                <CTableBody>

                    {/* Modal for Add Permission */}
                    <Modal title="Add a Permission" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                        <br></br>

                        <div className="form-outline mb-3">
                            <label>Permission</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Permission Name"
                            />
                        </div>

                    </Modal>

                    {/* Modal for Update Permission */}
                    <Modal title="Update a Permission" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3}>

                        <br></br>

                        <div className="form-outline mb-3">
                            <label>Permission</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-control form-control-lg"
                                placeholder="Enter Permission Name"
                            />
                        </div>

                    </Modal>

                    {/* Modal for Deletion Confirmation */}
                    <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
                    </Modal>

                    {/* Alert for Add Permission Success*/}
                    {showAlert1 && (
                        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
                            Permission Added Successfully
                        </Alert>
                    )}

                    {/* Alert for Add Permission Failure*/}
                    {showAlert2 && (
                        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                            Failed to Add Permission
                        </Alert>
                    )}

                    {/* Alert for Delete Permission Success*/}
                    {showAlert3 && (
                        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
                            Permission Deleted Successfully
                        </Alert>
                    )}

                    {/* Alert for Delete Permission Failure*/}
                    {showAlert4 && (
                        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
                            Failed to Delete Permission
                        </Alert>
                    )}

                    {/* Alert for Update Permission Success*/}
                    {showAlert5 && (
                        <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
                            Permission Updated Successfully
                        </Alert>
                    )}

                    {/* Alert for Update Permission Failure*/}
                    {showAlert6 && (
                        <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
                            Failed to Update Permission
                        </Alert>
                    )}

                </CTableBody>
            </CTable>
        </>
    )
}

export default Permission