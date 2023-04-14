import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';

const AssignedProjects = () => {

    // CSS Stylings
    const mystyle = {
        color: "white",
        backgroundColor: "#0070FF ",
        padding: "15px",
        fontFamily: "Arial",
        textAlign: 'center',
        alignSelf: 'flex-end',
    };

    const mystyle2 = {
        backgroundColor: "white ",
    };

    const [assigns, setAssigns] = useState([]);
    var filteredUsers = [];
    const local = JSON.parse(localStorage.getItem('user-info'));

    // Get API call
    function getAssigns() {
        fetch("http://10.3.3.80/api/get_assign_projects")
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === "1") {
                    filteredUsers = data.Project_Assigns;
                }
                else if (local.Users.role === "3") {
                    filteredUsers = data.Project_Assigns.filter((user) => user.company_id === local.Users.company_id);
                }
                else if (local.Users.role === "5") {
                    filteredUsers = data.Project_Assigns.filter((user) => user.assign_projects_user_id === local.Users.user_id);
                }
                setAssigns(filteredUsers);
            })
            .catch((error) => console.log(error));
    };


    useEffect(() => {
        getAssigns()
    }, []);

    return (
        <>
            <div className='row'>
                <div className='col-md 6'>
                    <h3>Assigned Project</h3>
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* Users table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Project Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Users</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Stream Name</CTableHeaderCell>
                    </CTableRow>

                    {/* Get API Users */}
                    {assigns.map((assign, index) => (
                        <CTableRow key={assign.id}>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{assign.project_name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{assign.name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{assign.stream_name}</CTableHeaderCell>
                        </CTableRow>
                    ))}

                </CTableHead>
                <CTableBody>

                </CTableBody>
            </CTable>
        </>
    )
}

export default AssignedProjects