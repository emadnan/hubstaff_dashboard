import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button, Modal, Divider } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
const BASE_URL = process.env.REACT_APP_BASE_URL

const Subscriptions = () => {
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

  const [showSubscriptionsAddedAlert, setShowSubscriptionsAddedAlert] = useState(false)
  const [showFailedToAddAlert, setShowFailedToAddAlert] = useState(false)
  const [showSubscriptionsDeletedAlert, seShowSubscriptionsDeletedAlert] = useState(false)
  const [showFailedToDeleteAlert, setShowFailedToDeleteAlert] = useState(false)
  const [showSubscriptionsUpdatedAlert, setShowSubscriptionsUpdatedAlert] = useState(false)
  const [showFailedToUpdateAlert, setShowFailedToUpdateAlert] = useState(false)

  const showModalCreateNew = () => {}
  const showModalUpdated = () => {}
  const showModalDeleted = () => {}

  const [isModalOpenAddSubscription, setIsModalOpenAddSubscription] = useState(false)
  const [isModalOpenUpdateSubscription, setIsModalOpenUpdateSubscription] = useState(false)
  const [isModalOpenDeleted, setIsModalOpenDeleted] = useState(false)

  const handleAddedSubscriptionOk = () => {}
  const handleAddedSubscriptionCancel = () => {}

  const handleUpdateSubscriptionOk = () => {}
  const handleUpdateSubscriptionCancel = () => {}

  const handleDeletedOk = () => {}
  const handleDeletedCancel = () => {}

  const handleCloseSubscriptionsAddedAlert = () => {}
  const handleCloseFailedToAddAlert = () => {}
  const handleCloseSubscriptionsDeletedAlert = () => {}
  const handleCloseFailedToDeleteAlert = () => {}
  const handleCloseSubscriptionsUpdatedAlert = () => {}
  const handleCloseFailedToUpdateAlert = () => {}
  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3></h3>
        </div>
        <div className="col-md 6">
          {/* Add Subscriptionss Button */}

          <Button className="btn btn-primary" style={buttonStyle} onClick={showModalCreateNew}>
            Add New Subscriptions Plan
          </Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Subscriptionss table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Subscriptions Name
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
              <IconButton aria-label="Update Subscription Plan" onClick={() => showModalUpdated()}>
                <EditIcon htmlColor="#28B463" />
              </IconButton>
              <IconButton aria-label="Delete Subscription Plan" onClick={() => showModalDeleted()}>
                <DeleteIcon htmlColor="#FF0000" />
              </IconButton>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {/* Modal for Add Subscriptions */}
          <Modal
            title="Add a Subscriptions"
            open={isModalOpenAddSubscription}
            onOk={handleAddedSubscriptionOk}
            onCancel={handleAddedSubscriptionCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br />

            <div className="form-outline mb-3">
              <label>Subscriptions Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter Subscriptions Name"
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
          </Modal>

          {/* Modal for Update Subscriptions */}
          <Modal
            title="Update a Subscriptions"
            open={isModalOpenUpdateSubscription}
            onOk={handleUpdateSubscriptionOk}
            onCancel={handleUpdateSubscriptionCancel}
            okButtonProps={{ style: { background: 'blue' } }}
            style={modalStyle}
            maskClosable={false}
          >
            <br />

            <div>
              <div className="form-outline mb-3">
                <label>Subscriptions Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter Subscriptions Name"
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

          {/* Alert for Add Subscriptions Success*/}
          {showSubscriptionsAddedAlert && (
            <Alert onClose={handleCloseSubscriptionsAddedAlert} severity="success">
              Subscriptions Added Successfully
            </Alert>
          )}

          {/* Alert for Add Subscriptions Failure*/}
          {showFailedToAddAlert && (
            <Alert onClose={handleCloseFailedToAddAlert} severity="error">
              Failed to Add Subscriptions
            </Alert>
          )}

          {/* Alert for Delete Subscriptions Success*/}
          {showSubscriptionsDeletedAlert && (
            <Alert onClose={handleCloseSubscriptionsDeletedAlert} severity="success">
              Subscriptions Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Subscriptions Failure*/}
          {showFailedToDeleteAlert && (
            <Alert onClose={handleCloseFailedToDeleteAlert} severity="error">
              Failed to Delete Subscriptions
            </Alert>
          )}

          {/* Alert for Update Subscriptions Success*/}
          {showSubscriptionsUpdatedAlert && (
            <Alert onClose={handleCloseSubscriptionsUpdatedAlert} severity="success">
              Subscriptions Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Subscriptions Failure*/}
          {showFailedToUpdateAlert && (
            <Alert onClose={handleCloseFailedToUpdateAlert} severity="error">
              Failed to Update Subscriptions
            </Alert>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Subscriptions
