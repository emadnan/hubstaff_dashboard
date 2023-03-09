import { React, useState, useEffect } from 'react';
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'
import { Modal, Button } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Departments = () => {

    const [company_id, setCompanyId] = useState("");
    const [department_name, setDepartmentName] = useState("");
    const [description, setDescription] = useState("");

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

    const [users, setUsers] = useState([]);

    const modalStyle = {
        position: "fixed",
        top: "25%",
        left: "40%",
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
        marginLeft: '85%',
    }

    function getList() {
        fetch("http://127.0.0.1:8000/api/getdepartment")
            .then((response) => response.json())
            .then((data) => setUsers(data.Departments))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getList()
    }, []);

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
            <div className="card">
                <div className="card-body">
                    <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Department</Button>
                    <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                        <CTableHead color="light" >

                            <CTableRow>
                                <CTableHeaderCell className="text-center" style={mystyle}>Company Id</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Department Name</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
                            </CTableRow>

                            {users.map((department) => (
                                <CTableRow key={department.id}>
                                    <CTableHeaderCell className="text-center">{department.company_id}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">{department.department_name}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">{department.description}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                                        {/* <IconButton aria-label="delete" onClick={() => deleteDepartment(department.id)}> */}
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

                            <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
                            </Modal>

                        </CTableBody>
                    </CTable>
                </div>
            </div>
        </>
    )
}

export default Departments