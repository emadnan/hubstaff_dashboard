import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React from 'react';
import { Button } from 'antd';

const Expenses = () => {

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
    width: "120px",
    backgroundColor: "#0070ff",
    fontWeight: "bold",
    color: "white",
  };

  return (
    <>
    <div className='row'>
        <div className='col-md 6'>
          <h3>Expenses</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Project Button */}
          <Button className="btn btn-primary" style={buttonStyle}>Add Expense</Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Member</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Date</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Amount</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Category</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Status</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>

        </CTableBody>
      </CTable>
    </>
  );
}

export default Expenses;
