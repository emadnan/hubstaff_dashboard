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

    const [users, setUsers] = useState([]);

    const modalStyle = {
        position: "fixed",
        top: "25%",
        left: "40%",
    };

    const mystyle = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "15px",
        fontFamily: "Arial",
        textAlign: 'center',
        alignSelf: 'flex-end',
    };

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

    return (
        <>
        <Button className="btn btn-primary" style={{ marginLeft: '85%' }} onClick={showModal}>Add Department</Button>
            <div className="card">
                <div className="card-body">
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
                                        <IconButton aria-label="delete" onClick={() => deleteDepartment(department.id)}>
                                            <DeleteIcon color="primary"/>
                                        </IconButton>
                                        <IconButton aria-label="delete">
                      <EditIcon color="primary" />
                    </IconButton>
                                    </CTableHeaderCell>
                            </CTableRow>
                            ))}

                        </CTableHead>
                        <CTableBody>
                            <Modal title="Add a Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

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
                        </CTableBody>
                    </CTable>
                </div>
            </div>
        </>
    )
}

export default Departments