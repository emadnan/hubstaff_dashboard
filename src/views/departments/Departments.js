import { React, useState, useEffect } from 'react';
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'
import { Modal, Button } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Departments = () => {

    // CSS Stylings
    const modalStyle = {
        position: "fixed",
        top: "25%",
        left: "40%",
    };

    const modalStyle2 = {
        position: "fixed",
        top: "13%",
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
        marginLeft: '-100%',
    }

    // Variable declarations
    const [company_id, setCompanyId] = useState("");
    const [department_name, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");

    // Functions for Add Department Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        addDepartment()
        setIsModalOpen(false);
        handleButtonClick();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Functions for Delete Department Modal
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const showModal2 = (id) => {
        setIsModalOpen2(id);
    };

    const handleOk2 = () => {
        deleteDepartment(isModalOpen2);
        setIsModalOpen2(false);
        handleButtonClick2();
    };

    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    // Functions for Update Department Modal
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const showModal3 = (id) => {
        setIsModalOpen3(id);
    };

    const handleOk3 = () => {
        updateDepartment(isModalOpen3);
        setIsModalOpen3(false);
        handleButtonClick3();
    };

    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    // Functions for Add User Alert
    const [showAlert, setShowAlert] = useState(false);

    function handleButtonClick() {
        setShowAlert(true);
    }

    function handleCloseAlert() {
        setShowAlert(false);
    }

    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    // Functions for Delete User Alert
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

    // Functions for Update User Alert
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

    const [users, setUsers] = useState([]);

    // Get API call
    function getList() {
        fetch("http://127.0.0.1:8000/api/getdepartment")
            .then((response) => response.json())
            .then((data) => setUsers(data.Departments))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getList()
    }, []);

    // Add API call
    async function addDepartment() {
        let item = { company_id, department_name, description }

        await fetch("http://127.0.0.1:8000/api/add_department",
            {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json'
                },

            }).then(response => {
                if (response.ok) {
                    console.log('Department added Successfully');
                    getList()
                } else {
                    console.error('Failed to add department');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Delete API call
    async function deleteDepartment(newid) {
        await fetch('http://127.0.0.1:8000/api/delete-department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid
            })
        }).then(response => {
            if (response.ok) {
                console.log('Department deleted successfully');
                getList()
            } else {
                console.error('Failed to delete department');
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    // Update API call
    async function updateDepartment(newid) {
        await fetch('http://127.0.0.1:8000/api/update-department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid,
                company_id: company_id,
                department_name: department_name,
                description: description,
            })
        }).then(response => {
            if (response.ok) {
                console.log('Department updated successfully');
                getList()
            } else {
                console.error('Failed to update department');
            }
        })
            .catch(error => {
                console.error(error);
            });

    }

    return (
        <>
            <div className='row'>
                <div className='col-md 6'></div>
                <div className='col-md 6'>
                    {/* Add Department Button */}
                    <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Department</Button>
                </div>
            </div>
            <br></br>
            <div className="card">
                <div className="card-body">
                    <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                        <CTableHead color="light" >

                            {/* Users table heading */}
                            <CTableRow>
                                <CTableHeaderCell className="text-center" style={mystyle}>Company Id</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Department Name</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
                            </CTableRow>

                            {/* Get API Users */}
                            {users.map((department) => (
                                <CTableRow key={department.id}>
                                    <CTableHeaderCell className="text-center">{department.company_id}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">{department.department_name}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">{department.description}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                                        <IconButton aria-label="delete" onClick={() => showModal2(department.id)}>
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                        <IconButton aria-label="update" onClick={() => showModal3(department.id)}>
                                            <EditIcon color="primary " />
                                        </IconButton>
                                    </CTableHeaderCell>
                                </CTableRow>
                            ))}

                        </CTableHead>
                        <CTableBody>

                            {/* Modal for Add Department */}
                            <Modal title="Add a Department" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

                                <div className="form-outline mb-3">
                                    <input
                                        type="number"
                                        value={company_id}
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Company Id"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="text"
                                        value={department_name}
                                        onChange={(e) => setDepartmentName(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Department Name"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Description"
                                    />
                                </div>

                            </Modal>

                            {/* Modal for Update Department */}
                            <Modal title="Update a Department" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} style={modalStyle}>

                                <div className="form-outline mb-3">
                                    <input
                                        type="number"
                                        value={company_id}
                                        onChange={(e) => setCompanyId(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Company Id"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="text"
                                        value={department_name}
                                        onChange={(e) => setDepartmentName(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Department Name"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Description"
                                    />
                                </div>

                            </Modal>

                            {/* Modal for deletion confirmation */}
                            <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
                            </Modal>

                            {/* Alert for Add Department */}
                            {showAlert && (
                                <Alert onClose={handleCloseAlert} severity="success" style={modalStyle2}>
                                    Department has been added
                                </Alert>
                            )}

                            {/* Alert for Delete Department */}
                            {showAlert2 && (
                                <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                                    Department has been deleted
                                </Alert>
                            )}

                            {/* Alert for Update Department */}
                            {showAlert3 && (
                                <Alert onClose={handleCloseAlert3} severity="info" style={modalStyle2}>
                                    Department has been updated
                                </Alert>
                            )}

                        </CTableBody>
                    </CTable>
                </div>
            </div>
        </>
    )
}

export default Departments