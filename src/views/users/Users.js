import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Users = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role_id, setRoleId] = useState("");

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

    const [users, setUsers] = useState([]);

    function getList() {
        fetch("http://127.0.0.1:8000/api/get_users")
            .then((response) => response.json())
            .then((data) => setUsers(data.Users))
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        getList()
    }, []);
    async function addUser() {
        let adduser = { name, email, password, role_id }

        await fetch("http://127.0.0.1:8000/api/add_user",
            {
                method: 'POST',
                body: JSON.stringify(adduser),
                headers: {
                    'Content-Type': 'application/json'
                },

            }).then(response => {
                if (response.ok) {
                    console.log('User added Successfully');
                    getList()
                } else {
                    console.error('Failed to add project');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    async function deleteUser(newid) {
        await fetch('http://127.0.0.1:8000/api/delete_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: newid
            })
        }).then(response => {
            if (response.ok) {
                console.log('Project deleted successfully');
                getList()
            } else {
                console.error('Failed to delete project');
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
                    <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add User</Button>
                </div>
            </div>
            <br></br>
            <div className="card">
                <div className="card-body">
                    <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                        <CTableHead color="light" >

                            <CTableRow>
                                <CTableHeaderCell className="text-center" style={mystyle}>Name</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Email</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Role-Id</CTableHeaderCell>
                                <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
                            </CTableRow>

                            {users.map((user) => (
                                <CTableRow key={user.id}>
                                    <CTableHeaderCell className="text-center">{user.name}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">{user.email}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center">{user.role_id}</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                                        <IconButton aria-label="delete" onClick={() => deleteUser(user.id)}>
                                            <DeleteIcon color="primary" />
                                        </IconButton>
                                        <IconButton aria-label="delete">
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </CTableHeaderCell>
                                </CTableRow>
                            ))}

                        </CTableHead>
                        <CTableBody>

                            <Modal title="Add a User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

                                <div className="form-outline mb-3">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter User Name"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Email"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Password"
                                    />
                                </div>

                                <div className="form-outline mb-3">
                                    <input
                                        type="number"
                                        value={role_id}
                                        onChange={(e) => setRoleId(e.target.value)}
                                        className="form-control form-control-lg"
                                        placeholder="Enter Role Id"
                                    />
                                </div>

                            </Modal>
                        </CTableBody>
                    </CTable>
                </div>
            </div>
        </>
    );
}

export default Users;

