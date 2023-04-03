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

    const [assigns, setAssigns] = useState([]);

    // Get API call
    function getAssigns() {
        fetch("http://10.3.3.80/api/get_assign_projects")
            .then((response) => response.json())
            .then((data) => setAssigns(data.Project_Assigns))
            .catch((error) => console.log(error));
    }

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
                            <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">{assign.project_name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">{assign.name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">{assign.stream_name}</CTableHeaderCell>
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