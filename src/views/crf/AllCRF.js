import { React, useState, useEffect } from 'react'
import { Button, Divider, Modal } from 'antd'
import { useNavigate } from 'react-router-dom'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Alert from '@mui/material/Alert';

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
    fontSize: 16,
    fontWeight: 'bold',
  }

  const perStyle2 = {
    fontSize: 18,
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

  // Functions for Delete CRF Modal
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

  // Functions for View CRF Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    getCrfById(id)
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  //Initial rendering through useEffect
  useEffect(() => {
    getCrf()
  }, [])


  const [showAlert1, setShowAlert1] = useState(false)
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showAlert2])

  //Array declarations for GET methods
  const [crf, setCrf] = useState([])
  const [bycrf, setCrfById] = useState([])
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

  async function getCrfById(id) {
    await fetch(`${BASE_URL}/api/getChangeRequestFormById/${id}`)
      .then((response) => response.json())
      .then((data) => setCrfById(data.CRForm))
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
          handleButtonClick1()
        } else {
          handleButtonClick2()
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
                {crf.doc_ref_no}-{crf.crf_version}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {new Date(crf.issuance_date).toLocaleDateString()}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                <IconButton aria-label="view" title="View CRF" onClick={() => showModal2(crf.id)}>
                  <VisibilityIcon htmlColor="#28B463" />
                </IconButton>
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

      {/* Modal for View FSF Details */}
      <Modal
        title={<div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 26 }}>Change Request Form</div>}
        open={isModalOpen2}
        onOk={handleOk2}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel2}
        width={800}
      >
        {bycrf.map((crf) => {
          return (
            <div key={crf.id}>
              <Divider></Divider>
              <h6 style={perStyle}>Customer</h6>
              <p>{crf.project_details.project_name}</p>
              <h6 style={perStyle}>Implementation Partner</h6>
              <p>{crf.implementation_partner}</p>
              <h6 style={perStyle}>Document Reference No</h6>
              <p>{crf.doc_ref_no}-{crf.crf_version}</p>
              <h6 style={perStyle}>Issuance Date</h6>
              <p>{new Date(crf.issuance_date).toLocaleDateString()}</p>
              <h6 style={perStyle}>Author</h6>
              <p>{crf.author}</p>
              <Divider></Divider>
              <h6 style={perStyle2}>Change Request Summary</h6>
              <br></br>
              <h6 style={perStyle}>Change Request Number</h6>
              <p>{crf.doc_ref_no}-{crf.crf_version}</p>
              <h6 style={perStyle}>New Requirements</h6>
              <p>{crf.crs_details.requirement}</p>
              <h6 style={perStyle}>Required Time</h6>
              <p>{crf.crs_details.required_time_no} {crf.crs_details.required_time_type}</p>
              <h6 style={perStyle}>Functional Resource Requirement</h6>
              <p>{crf.crs_details.functional_resource}</p>
              <h6 style={perStyle}>Technical Resource Requirement</h6>
              <p>{crf.crs_details.Technical_resource}</p>
            </div>
          )
        })}
      </Modal>

      {/* Alert for Delete CRF Success*/}
      {showAlert1 && (
        <Alert severity="success" style={modalStyle2}>CRF Deleted Successfully</Alert>
      )}

      {/* Alert for Delete CRF Failure*/}
      {showAlert2 && (
        <Alert severity="error" style={modalStyle2}>CRF Deleted Successfully</Alert>
      )}
    </>
  )
}

export default AllCRF