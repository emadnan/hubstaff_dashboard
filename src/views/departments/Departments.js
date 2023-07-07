import { React, useState, useEffect } from 'react'
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'
import { Modal, Button, Form, Select } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'

const BASE_URL = process.env.REACT_APP_BASE_URL

const Departments = () => {
  // Variable declarations
  const [company_id, setCompanyId] = useState('')
  const [department_name, setDepartmentName] = useState('')
  const [description, setDescription] = useState('')
  const [formErrors, setFormErrors] = useState({
    company_id,
    department_name,
    description,
  })

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Department')
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_Department')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_Department')

  // CSS Stylings
  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
  }

  // const perStyle = {
  //     fontSize: 14,
  // };

  // const headStyle = {
  //     color: "#0070ff",
  //     fontWeight: "bold",
  // };

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

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '150px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  // Functions for Add Department Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    console.log(perm)
    setIsModalOpen(true)
  }
  const handleOk = () => {
    if (company_id && department_name && description) {
      addDepartment()
      setIsModalOpen(false)
      setCompanyId('')
      setDepartmentName('')
      setDescription('')
    } else {
      callErrors(company_id, department_name, description)
    }
  }

  const callErrors = (company_id, department_name, description) => {
    const errors = {}
    if (!company_id) {
      errors.company_id = 'Select a Company'
    }
    if (!department_name) {
      errors.department_name = 'Select a department'
    }
    if (!description) {
      errors.description = 'Enter the Description'
    }
    setFormErrors(errors)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setCompanyId('')
    setDepartmentName('')
    setDescription('')
  }

  // Functions for Delete Department Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    deleteDepartment(isModalOpen2)
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Update Department Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getDepartmentById(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    if (company_id && department_name && description) {
      updateDepartment(isModalOpen3)
      setIsModalOpen3(false)
      setCompanyId('')
      setDepartmentName('')
      setDescription('')
    } else {
      callErrors(company_id, department_name, description)
    }
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
    setCompanyId('')
    setDepartmentName('')
    setDescription('')
  }

  // Functions for Add Department Success
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

  // Functions for Add Department Failure
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

  // Functions for Delete Department Success
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

  // Functions for Delete Department Failure
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

  // Functions for Update Department Success
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

  // Functions for Update Department Failure
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

  //Get calls handling
  const handleCompanyChange = (value) => {
    setCompanyId(value)
  }

  // Array declarations for API calls
  const [department, setDepartment] = useState([])
  const [company, setCompanies] = useState([])
  const [bydepartment, setByDepartment] = useState([])
  var filteredUsers = []

  //Initial rendering through useEffect
  useEffect(() => {
    getList()
    getCompany()
  }, [])

  //GET API calls
  function getList() {
    fetch(`${BASE_URL}/api/getdepartment`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.Departments
        } else if (local.Users.role === 3) {
          filteredUsers = data.Departments.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        } else {
          return null
        }
        setDepartment(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getCompany() {
    fetch(`${BASE_URL}/api/getcompany`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.companies
        } else if (local.Users.role === 3) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        }
        setCompanies(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getDepartmentById(id) {
    fetch(`${BASE_URL}/api/getdepartment-by-id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setByDepartment(data.Departments)
        setDepartmentName(data.Departments[0].department_name)
        setDescription(data.Departments[0].description)
        setCompanyId(data.Departments[0].company_id)
      })
      .catch((error) => console.log(error))
  }

  // Add API call
  async function addDepartment() {
    let item = { company_id, department_name, description }

    console.log(item)

    await fetch(`${BASE_URL}/api/add_department`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick1()
          getList()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete API call
  async function deleteDepartment(newid) {
    await fetch(`${BASE_URL}/api/delete-department`, {
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
          handleButtonClick3()
          getList()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update API call
  async function updateDepartment(newid) {
    await fetch(`${BASE_URL}/api/update-department`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        company_id: company_id,
        department_name: department_name,
        description: description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick5()
          getList()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Departments</h3>
        </div>
        <div className="col-md 6">
          {/* Add Department Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add Department
            </Button>
          ) : null}
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Users table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Company Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Department Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Description
            </CTableHeaderCell>
            {isEditButtonEnabled || isDeleteButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Action
              </CTableHeaderCell>
            ) : null}
          </CTableRow>

          {/* Get API Users */}
          {department.map((dept, index) => (
            <CTableRow key={dept.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {index + 1}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {dept.company_name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {dept.department_name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {dept.description}
              </CTableHeaderCell>
              {isEditButtonEnabled || isDeleteButtonEnabled ? (
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {isEditButtonEnabled ? (
                    <IconButton aria-label="update" onClick={() => showModal3(dept.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                  ) : null}
                  {isDeleteButtonEnabled ? (
                    <IconButton aria-label="delete" onClick={() => showModal2(dept.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  ) : null}
                </CTableHeaderCell>
              ) : null}
            </CTableRow>
          ))}
        </CTableHead>
        <CTableBody>
          {/* Modal for Add Department */}
          <Modal
            title="Add a Department"
            open={isModalOpen}
            onOk={handleOk}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel}
            maskClosable={false}
          >
            <br></br>

            <div className="form-outline mt-3">
              <label>Company</label>
              <Form.Item
                name="company_name"
                validateStatus={formErrors.company_id ? 'error' : ''}
                help={formErrors.company_id}
              >
                <Select
                  name="company_name"
                  placeholder="Select Company"
                  onChange={handleCompanyChange}
                  onFocus={handleFocus}
                  value={company_id}
                >
                  {company.map((count) => (
                    <Select.Option value={count.name} key={count.id}>
                      {count.company_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-outline mt-3">
              <label>Department</label>
              <input
                name="department_name"
                type="text"
                value={department_name}
                onFocus={handleFocus}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Department Name"
              />
            </div>
            {formErrors.department_name && (
              <div className="text-danger">{formErrors.department_name}</div>
            )}

            <div className="form-outline mt-3">
              <label>Description</label>
              <input
                type="text"
                value={description}
                name="description"
                onFocus={handleFocus}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Description"
              />
            </div>
            {formErrors.description && <div className="text-danger">{formErrors.description}</div>}
          </Modal>

          {/* Modal for Update Department */}
          <Modal
            title="Update a Department"
            open={isModalOpen3}
            onOk={handleOk3}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel3}
            maskClosable={false}
          >
            <br></br>

            {bydepartment.map((dept) => (
              <div key={dept.id}>
                <div className="form-outline mt-3">
                  <label>Company</label>
                  <Form.Item
                    name="company_name"
                    validateStatus={formErrors.company_name ? 'error' : ''}
                    help={formErrors.company_name}
                  >
                    <Select
                      name="company_name"
                      placeholder="Select Company"
                      onChange={handleCompanyChange}
                      onFocus={handleFocus}
                      defaultValue={dept.company_name}
                    >
                      {company.map((count) => (
                        <Select.Option value={count.name} key={count.id}>
                          {count.company_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mt-3">
                  <label>Department</label>
                  <input
                    name="department_name"
                    type="text"
                    defaultValue={dept.department_name}
                    onFocus={handleFocus}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Department Name"
                  />
                </div>
                {formErrors.department_name && (
                  <div className="text-danger">{formErrors.department_name}</div>
                )}

                <div className="form-outline mt-3">
                  <label>Description</label>
                  <input
                    name="descrition"
                    type="text"
                    defaultValue={dept.description}
                    onFocus={handleFocus}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Description"
                  />
                </div>
                {formErrors.description && (
                  <div className="text-danger">{formErrors.description}</div>
                )}
              </div>
            ))}
          </Modal>

          {/* Modal for deletion confirmation */}
          <Modal
            title="Are you sure you want to delete?"
            open={isModalOpen2}
            onOk={handleOk2}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel2}
            style={modalStyle}
          ></Modal>

          {/* Alert for Add Department Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Department Added Successfully
            </Alert>
          )}

          {/* Alert for Add Department Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Department
            </Alert>
          )}

          {/* Alert for Delete Department Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Department Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Department Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Department
            </Alert>
          )}

          {/* Alert for Update Department Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Department Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Department Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Department
            </Alert>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Departments
