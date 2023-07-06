import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Modal, Divider } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
const BASE_URL = process.env.REACT_APP_BASE_URL

const SubscribedPlan = () => {
  const local = JSON.parse(localStorage.getItem('user-info'))

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

  useEffect(() => {
    getSubscribedPlan()
  }, [])

  const [subscribed_plan, setSubscribedPlan] = useState()
  const [subscribed_plan_amount, setSubscribedPlanAmount] = useState()
  const [subscribed_plan_endDate, setSubscribedPlanEndDate] = useState()
  const [subscribed_plan_startDate, setSubscribedPlanStartDate] = useState()

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

  //APIs
  function getSubscribedPlan() {
    fetch(`${BASE_URL}/api/getAllSubscriptionInvoice`)
      .then((response) => response.json())
      .then((data) => {
        const filteredSubscribedPlan = data.subscriptions.filter(
          (plan) => plan.company_id === local.Users.company_id,
        )
        if (filteredSubscribedPlan[0].subscription_id === 2) {
          setSubscribedPlan('WorkLog Annual Plan')
        } else if (filteredSubscribedPlan[0].subscription_id === 1) {
          setSubscribedPlan('WorkLog Monthly Plan')
        } else {
          setSubscribedPlan('WorkLog Demo')
        }
        setSubscribedPlanAmount(filteredSubscribedPlan[0].amount)
        setSubscribedPlanStartDate(filteredSubscribedPlan[0].start_date)
        setSubscribedPlanEndDate(filteredSubscribedPlan[0].end_date)
      })
      .catch((error) => console.log(error))
  }

  function updateSubscribedPlan(subscriptionId) {
    //code //3
    let formData = new FormData()
    formData.append('')

    fetch(`${BASE_URL}/api/updateSubscriptionInvoice/${subscriptionId}`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        getSubscribedPlan()
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  function cancelAndRefundOfSubscribedPlan() {
    //code
  }

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
              Subscribed Plan
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Plan Fees
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Plan Subscription Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Plan Expiry Date
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}

          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              {subscribed_plan}
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              $ {subscribed_plan_amount !== 0 ? subscribed_plan_amount / 100 : 0}
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              {new Date(subscribed_plan_startDate)
                .toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
                .replace(/\//g, '-')}
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle2}>
              {new Date(subscribed_plan_endDate)
                .toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })
                .replace(/\//g, '-')}
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
