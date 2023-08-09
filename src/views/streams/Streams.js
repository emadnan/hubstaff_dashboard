import { React, useState, useEffect } from 'react'
import { Modal, Button, Form, Select } from 'antd'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
const BASE_URL = process.env.REACT_APP_BASE_URL

function Streams() {
  // Variable declarations
  const [stream_name, setStreamName] = useState('')

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Stream')
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_Stream')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_Stream')

  // CSS Stylings
  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
  }

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const [getstreams, setStreams] = useState([])
  const [bystream, setStreamById] = useState([])
  var filteredUsers = []
  let [form] = Form.useForm()

  //Initial rendering through useEffect
  useEffect(() => {
    getStreams()
  }, [])

  // Get API call
  function getStreams() {
    fetch(`${BASE_URL}/api/get-streams`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Streams
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Streams.filter((user) => user.company_id === local.Users.company_id)
        }
        setStreams(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getStreamById(id) {
    fetch(`${BASE_URL}/api/getStreamById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setStreamById(data.streams)
        setStreamName(data.streams[0].stream_name)
      })
      .catch((error) => console.log(error))
  }

  // Functions for Add Stream Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    addStream()
    setIsModalOpen(false)
    setStreamName('')
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    setStreamName('')
  }

  // Functions for Update Stream Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    getStreamById(id)
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    updateStream(isModalOpen2)
    setIsModalOpen2(false)
    setStreamName('')
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
    setStreamName('')
  }

  // Functions for Delete Stream Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    deleteStream(isModalOpen3)
    setIsModalOpen3(false)
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
  }

  // Functions for Add Stream Success
  const [showAlert1, setShowAlert1] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleCloseAlert1() {
    setShowAlert1(false)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  // Functions for Add Stream Failure
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  function handleCloseAlert2() {
    setShowAlert2(false)
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert2])

  // Functions for Delete Stream Success
  const [showAlert3, setShowAlert3] = useState(false)

  function handleButtonClick3() {
    setShowAlert3(true)
  }

  function handleCloseAlert3() {
    setShowAlert3(false)
  }

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert3])

  // Functions for Delete Stream Failure
  const [showAlert4, setShowAlert4] = useState(false)

  function handleButtonClick4() {
    setShowAlert4(true)
  }

  function handleCloseAlert4() {
    setShowAlert4(false)
  }

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert4])

  // Functions for Update Stream Success
  const [showAlert5, setShowAlert5] = useState(false)

  function handleButtonClick5() {
    setShowAlert5(true)
  }

  function handleCloseAlert5() {
    setShowAlert5(false)
  }

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert5])

  // Functions for Update Stream Failure
  const [showAlert6, setShowAlert6] = useState(false)

  function handleButtonClick6() {
    setShowAlert6(true)
  }

  function handleCloseAlert6() {
    setShowAlert6(false)
  }

  useEffect(() => {
    if (showAlert6) {
      const timer = setTimeout(() => {
        setShowAlert6(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert6])

  // Add API call
  async function addStream() {
    let addstream = { stream_name, company_id: local.Users.company_id }

    await fetch(`${BASE_URL}/api/addStreams`, {
      method: 'POST',
      body: JSON.stringify(addstream),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getStreams()
          handleButtonClick1()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete API call
  async function deleteStream(newid) {
    await fetch(`${BASE_URL}/api/deleteStream`, {
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
          getStreams()
          handleButtonClick3()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update API call
  async function updateStream(newid) {
    await fetch(`${BASE_URL}/api/updateStream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        company_id: local.Users.company_id,
        stream_name: stream_name,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getStreams()
          handleButtonClick5()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const [searchedStream, setSearchedStream] = useState('')

  const handleStreamSearch = (value) => {
    setSearchedStream(value)
  }

  const clearFilter = () => {
    form.resetFields()
    setSearchedStream('')
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Streams</h3>
        </div>
        <div className="col-md 6">
          {/* Add Roles Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add Stream
            </Button>
          ) : null
          }
        </div>
      </div>
      <div className="row mt-2 mb-2 justify-content-between">
        <div className="col-md-4">
          {perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data') ? (
            <div className="d-flex">
              <Form form={form} style={{ width: '100%' }}>
                <Form.Item name="select" hasFeedback>
                  <Select
                    placeholder="Enter Stream Name"
                    onChange={handleStreamSearch}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: '100%' }}
                  >
                    {getstreams.map((stream) => (
                      <Select.Option value={stream.id} key={stream.id}>
                        {stream.stream_name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
              <Button type="default" onClick={clearFilter} className="ml-2">
                Clear Filter
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Users table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Stream Name
            </CTableHeaderCell>
            {isEditButtonEnabled || isDeleteButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Actions
              </CTableHeaderCell>
            ) : null
            }
          </CTableRow>

          {/* Get API Stream */}
          {getstreams
            .filter((stream) => {
              // Apply Stream filter
              if (searchedStream !== '') {
                return stream.id === searchedStream
              }
              return true
            })
            .map((stream, index) => (
              <CTableRow key={index}>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {index + 1}
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {stream.stream_name}
                </CTableHeaderCell>
                {isEditButtonEnabled || isDeleteButtonEnabled ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    {isEditButtonEnabled ? (
                      <IconButton aria-label="update" onClick={() => showModal2(stream.id)}>
                        <EditIcon htmlColor="#28B463" />
                      </IconButton>
                    ) : null
                    }
                    {isDeleteButtonEnabled ? (
                      <IconButton aria-label="delete" onClick={() => showModal3(stream.id)}>
                        <DeleteIcon htmlColor="#FF0000" />
                      </IconButton>
                    ) : null
                    }
                  </CTableHeaderCell>
                ) : null
                }
              </CTableRow>
            ))}
        </CTableHead>
        <CTableBody></CTableBody>
      </CTable>

      {/* Modal for Add Role */}
      <Modal
        title="Add a Stream"
        open={isModalOpen}
        onOk={handleOk}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <br></br>

        <div className="form-outline mb-3">
          <label>Stream</label>
          <input
            type="text"
            value={stream_name}
            onChange={(e) => setStreamName(e.target.value)}
            className="form-control form-control-lg"
            placeholder="Enter Stream Name"
          />
        </div>
      </Modal>

      {/* Modal for Update Role */}
      <Modal
        title="Update a Role"
        open={isModalOpen2}
        onOk={handleOk2}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel2}
        maskClosable={false}
      >
        <br></br>

        {bystream.map((str) => (
          <div key={str.id}>
            <div className="form-outline mb-3">
              <input
                type="text"
                defaultValue={str.stream_name}
                onChange={(e) => setStreamName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Stream Name"
              />
            </div>
          </div>
        ))}
      </Modal>

      {/* Modal for Deletion Confirmation */}
      <Modal
        title="Are you sure you want to delete?"
        open={isModalOpen3}
        onOk={handleOk3}
        okButtonProps={{ style: { background: 'blue' } }}
        onCancel={handleCancel3}
        style={modalStyle}
      ></Modal>

      {/* Alert for Add Stream Success*/}
      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
          Stream Added Successfully
        </Alert>
      )}

      {/* Alert for Add Stream Failure*/}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
          Failed to Add Stream
        </Alert>
      )}

      {/* Alert for Delete Stream Success*/}
      {showAlert3 && (
        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
          Stream Deleted Successfully
        </Alert>
      )}

      {/* Alert for Delete Stream Failure*/}
      {showAlert4 && (
        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
          Failed to Delete Stream
        </Alert>
      )}

      {/* Alert for Update Stream Success*/}
      {showAlert5 && (
        <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
          Stream Updated Successfully
        </Alert>
      )}

      {/* Alert for Update Stream Failure*/}
      {showAlert6 && (
        <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
          Failed to Update Stream
        </Alert>
      )}
    </>
  )
}

export default Streams
