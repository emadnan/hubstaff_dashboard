import { React } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function AllFSF() {

    const navigate = useNavigate();

    //CSS Stylings
    const buttonStyle = {
        float: "right",
        padding: "2px",
        width: "120px",
        backgroundColor: "white",
        fontWeight: "bold",
        color: "#0070ff",
    };

    const mystyle = {
        color: "white",
        backgroundColor: "#0070FF ",
        padding: "15px",
        fontFamily: "Arial",
        textAlign: 'center',
        alignSelf: 'flex-end',
    };
    return (
        <>
            <div className='row'>
                <div className='col-md 6'>
                    <h3>Functional Specification Form</h3>
                </div>
                <div className='col-md 6'>
                    {/* Add FSF Button */}
                    <Button className="btn btn-primary" style={buttonStyle} onClick={async () => {
                        await navigate("/fsfform");
                    }}>Add FSF</Button>
                </div>
            </div>
            <br></br>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >

                    {/* FSF table heading */}
                    <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>FSF Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>FSF Report</CTableHeaderCell>
                    </CTableRow>
                    
                </CTableHead>

                <CTableBody>
                </CTableBody>
            </CTable>
        </>
    )
}

export default AllFSF