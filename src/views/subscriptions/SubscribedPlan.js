import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Modal, Divider } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
const BASE_URL = process.env.REACT_APP_BASE_URL

const SubscribedPlan = () => {
  //CSS Styling
  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '240px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
  }

  const [showSubscribedPlanDeletedAlert, seShowSubscribedPlanDeletedAlert] = useState(false)
  const [showFailedToDeleteAlert, setShowFailedToDeleteAlert] = useState(false)
  const [showSubscribedPlanUpdatedAlert, setShowSubscribedPlanUpdatedAlert] = useState(false)
  const [showFailedToUpdateAlert, setShowFailedToUpdateAlert] = useState(false)

  const showModalUpdated = () => {}
  const showModalDeleted = () => {}

  const [isModalOpenUpdateSubscribedPlan, setIsModalOpenUpdateSubscribedPlan] = useState(false)
  const [isModalOpenDeleted, setIsModalOpenDeleted] = useState(false)

  const handleUpdateSubscribedPlanOk = () => {}
  const handleUpdateSubscribedPlanCancel = () => {}

  const handleDeletedOk = () => {}
  const handleDeletedCancel = () => {}

  const handleCloseSubscribedPlanDeletedAlert = () => {}
  const handleCloseFailedToDeleteAlert = () => {}
  const handleCloseSubscribedPlanUpdatedAlert = () => {}
  const handleCloseFailedToUpdateAlert = () => {}

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3></h3>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Subscribed Plans table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Subscribed Plan Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}

          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              01
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              PRO PLAN
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              <IconButton
                aria-label="Update SubscribedPlan Plan"
                onClick={() => showModalUpdated()}
              >
                <EditIcon htmlColor="#28B463" />
              </IconButton>
              <IconButton
                aria-label="Delete SubscribedPlan Plan"
                onClick={() => showModalDeleted()}
              >
                <DeleteIcon htmlColor="#FF0000" />
              </IconButton>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {/* Modal for Update SubscribedPlan */}
          <Modal
            title="Update a SubscribedPlan"
            open={isModalOpenUpdateSubscribedPlan}
            onOk={handleUpdateSubscribedPlanOk}
            onCancel={handleUpdateSubscribedPlanCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br />

            <div>
              <div className="form-outline mb-3">
                <label>Subscribed Plan Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter SubscribedPlan Name"
                />
              </div>

              <div className="form-outline mb-3">
                <label>Description</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter Description"
                />
              </div>
            </div>
          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal
            title="Are you sure you want to delete?"
            open={isModalOpenDeleted}
            onOk={handleDeletedOk}
            onCancel={handleDeletedCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
          ></Modal>

          {/* Alert for Delete SubscribedPlan Success*/}
          {showSubscribedPlanDeletedAlert && (
            <Alert onClose={handleCloseSubscribedPlanDeletedAlert} severity="success">
              SubscribedPlan Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete SubscribedPlan Failure*/}
          {showFailedToDeleteAlert && (
            <Alert onClose={handleCloseFailedToDeleteAlert} severity="error">
              Failed to Delete SubscribedPlan
            </Alert>
          )}

          {/* Alert for Update SubscribedPlan Success*/}
          {showSubscribedPlanUpdatedAlert && (
            <Alert onClose={handleCloseSubscribedPlanUpdatedAlert} severity="success">
              Your Subscribed Plan is Updated Successfully
            </Alert>
          )}

          {/* Alert for Update SubscribedPlan Failure*/}
          {showFailedToUpdateAlert && (
            <Alert onClose={handleCloseFailedToUpdateAlert} severity="error">
              Failed to Update Your Subscribed Plan
            </Alert>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default SubscribedPlan