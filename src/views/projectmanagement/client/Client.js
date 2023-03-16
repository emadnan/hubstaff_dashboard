import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button } from 'antd';
import React from 'react';

const Client = () => {

  //CSS Styling
  const buttonStyle = {
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "#0070ff",
    fontWeight: "bold",
    color: "white",
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
          <h3>Clients</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Client Button */}
          <Button className="btn btn-primary" style={buttonStyle}>Add Client</Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >

          {/* Clients table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Client List</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Invoicing</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>

        </CTableBody>
      </CTable>
    </>
  );
}

export default Client;
