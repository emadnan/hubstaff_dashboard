import React from 'react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'

function AllCRF() {

  //CSS Stylings
  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }

  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    minWidth: '100%',
    marginTop: '50px',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const perStyle = {
    fontSize: 14,
  }

  const perStyle2 = {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  }

  const headStyle = {
    color: '#0070ff',
    fontWeight: 'bold',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '80%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const navigate = useNavigate()

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Change Request Form</h3>
        </div>
        <div className="col-md 6">
          {/* Add CRF Button */}
          <Button
            className="btn btn-primary"
            style={buttonStyle}
            onClick={async () => {
              await navigate('/crfform')
            }}
          >
            Add CRF
          </Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Reference ID
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody></CTableBody>
      </CTable>
    </>
  )
}

export default AllCRF