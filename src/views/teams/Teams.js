import { CTable , CTableBody , CTableHead , CTableHeaderCell , CTableRow } from '@coreui/react'
import { React } from 'react';
import { Button } from 'antd';

const Team = () => {

  //CSS Styling
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
          <h3>Teams</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Team Button */}
          <Button className="btn btn-primary" style={buttonStyle}>Add Team</Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '10px' }}>
        <CTableHead color="light" >

          {/* Teams table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Members</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Projects</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>

        </CTableBody>
      </CTable>
    </>
  );
}

export default Team;
