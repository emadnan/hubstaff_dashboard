import { React, useState, useEffect } from 'react';
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'
import { Modal, Button, Form, Select } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Departments = () => {

    // Variable declarations
    const [company_id, setCompanyId] = useState("");
    const [department_name, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");

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
        width: "150px",
        backgroundColor: "#0070ff",
        fontWeight: "bold",
        color: "white",
    };

    // Functions for Add Department Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        addDepartment()
        setIsModalOpen(false);
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
    };

    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    // Functions for Add Department Success
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

    // Functions for Add Department Failure
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

    // Functions for Delete Department Success
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

    // Functions for Delete Department Failure
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

    // Functions for Update Department Success
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

    // Functions for Update Department Failure
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

    //Get calls handling
    const handleCompanyChange = (value) => {
        setCompanyId(value);
    };

    // Get API call

    const [users, setUsers] = useState([]);
    const [company, setCompanies] = useState([]);

    function getList() {
        fetch("http://10.3.3.80/api/getdepartment")
            .then((response) => response.json())
            .then((data) => setUsers(data.Departments))
            .catch((error) => console.log(error));
    }

    function getCompany() {
        fetch("http://10.3.3.80/api/getcompany")
            .then((response) => response.json())
            .then((data) => setCompanies(data.companies))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getList()
        getCompany()
    }, []);

    // Add API call
    async function addDepartment() {
        let item = { company_id, department_name, description }

        await fetch("http://10.3.3.80/api/add_department",
            {
                method: 'POST',
                body: JSON.stringify(item),
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
    async function deleteDepartment(newid) {
        await fetch('http://10.3.3.80/api/delete-department', {
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
    async function updateDepartment(newid) {
        await fetch('http://10.3.3.80/api/update-department', {
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
                    <h3>Departments</h3>
                </div>
                <div className='col-md 6'>
                    {/* Add Department Button */}
                    <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Department</Button>
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* Users table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Company Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Department Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
                    </CTableRow>

                    {/* Get API Users */}
                    {users.map((department, index) => (
                        <CTableRow key={department.id}>
                            <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
                            {/* <CTableHeaderCell className="text-center">{department.company_id}</CTableHeaderCell> */}
                            <CTableHeaderCell className="text-center">{department.company_name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">{department.department_name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">{department.description}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                                <IconButton aria-label="update" onClick={() => showModal3(department.id)}>
                                    <EditIcon htmlColor='#28B463' />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={() => showModal2(department.id)}>
                                    <DeleteIcon htmlColor='#FF0000' />
                                </IconButton>

                            </CTableHeaderCell>
                        </CTableRow>
                    ))}

                </CTableHead>
                <CTableBody>

                    {/* Modal for Add Department */}
                    <Modal title="Add a Department" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

                        <div className="form-outline mb-3">
                            <Form.Item label="Company">
                                <Select placeholder="Select Company" onChange={handleCompanyChange} value={company_id}>
                                    {company.map((count) => (
                                        <Select.Option value={count.name} key={count.id}>
                                            {count.company_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
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
                            <Form.Item label="Company">
                                <Select placeholder="Select Company" onChange={handleCompanyChange} value={company_id}>
                                    {company.map((count) => (
                                        <Select.Option value={count.name} key={count.id}>
                                            {count.company_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
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

                    {/* Alert for Add Department Success*/}
                    {showAlert1 && (
                        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
                            Department Added Successfully
                        </Alert>
                    )}

                    {/* Alert for Add Department Failure*/}
                    {showAlert2 && (
                        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                            Failed to Add Department
                        </Alert>
                    )}

                    {/* Alert for Delete Department Success*/}
                    {showAlert3 && (
                        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
                            Department Deleted Successfully
                        </Alert>
                    )}

                    {/* Alert for Delete Department Failure*/}
                    {showAlert4 && (
                        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
                            Failed to Delete Department
                        </Alert>
                    )}

                    {/* Alert for Update Department Success*/}
                    {showAlert5 && (
                        <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
                            Department Updated Successfully
                        </Alert>
                    )}

                    {/* Alert for Update Department Failure*/}
                    {showAlert6 && (
                        <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
                            Failed to Update Department
                        </Alert>
                    )}

                </CTableBody>
            </CTable>
        </>
    )
                    
}

export default Departments