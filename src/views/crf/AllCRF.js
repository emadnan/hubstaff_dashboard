import { React, useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

const BASE_URL = process.env.REACT_APP_BASE_URL

function AllCRF() {

  //Local Storage access
  const local = JSON.parse(localStorage.getItem('user-info'))
  const navigate = useNavigate()

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

  // Functions for Delete FSF Input Parameter Modal
  const [isModalOpen1, setIsModalOpen1] = useState(false)
  const showModal1 = (id) => {
    setIsModalOpen1(id)
  }

  const handleOk1 = () => {
    deleteCrf(isModalOpen1)
    setIsModalOpen1(false)
  }

  const handleCancel1 = () => {
    setIsModalOpen1(false)
  }

  //Initial rendering through useEffect
  useEffect(() => {
    getCrf()
  }, [])

  const [crf, setCrf] = useState([])
  var filteredUsers = [];

  //GET API calls
  async function getCrf() {
    await fetch(`${BASE_URL}/api/getChangeRequestForm`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.CRForm.filter((user) => user.company_id === local.Users.company_id)
        }
        setCrf(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  // API Calls through Fetch
  async function deleteCrf(newid) {
    await fetch(`${BASE_URL}/api/deleteChangeRequestForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getCrf()
          // handleButtonClick1()
        } else {
          // handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

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
              Document Reference No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Issuance Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}
          {crf.map((crf, index) => (
            <CTableRow key={crf.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {index + 1}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {crf.doc_ref_no}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
              {new Date(crf.issuance_date).toLocaleDateString()}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {/* <IconButton aria-label="update" onClick={() => showModal2(stream.id)}>
                  <EditIcon htmlColor="#28B463" />
                </IconButton> */}
                <IconButton aria-label="delete" onClick={() => showModal1(crf.id)}>
                  <DeleteIcon htmlColor="#FF0000" />
                </IconButton>
              </CTableHeaderCell>
            </CTableRow>
          ))}

        </CTableHead>

        <CTableBody></CTableBody>
      </CTable>

      {/* Modal for Deletion Confirmation */}
      <Modal
            title="Are you sure you want to delete?"
            open={isModalOpen1}
            onOk={handleOk1}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel1}
            style={modalStyle}
          ></Modal>
    </>
  )
}

export default AllCRF