import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react'
import { Modal, Button, Form, Select } from 'antd'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LoadingSpinner from 'src/components/Loader/Loader'
const BASE_URL = process.env.REACT_APP_BASE_URL

const Users = () => {
  // Variable declarations
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [team_id, setTeamId] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [formErrors, setFormErrors] = useState({
    name,
    email,
    password,
    role,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_User')
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_User')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_User')

  let [form] = Form.useForm()

  // CSS Stylings
  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
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

  // Functions for Add User Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (name && email && password && role) {
      addUser()
      setIsModalOpen(false)
      form.resetFields()
      setName('')
      setEmail('')
      setPassword('')
      setRole('')
      setTeamId('')
      setFormErrors({
        name: '',
        email: '',
        password: '',
        role: '',
      })
    } else {
      callErrors(name, email, password, role)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
    setName('')
    setEmail('')
    setPassword('')
    setRole('')
    setTeamId('')
    setFormErrors({
      name: '',
      email: '',
      password: '',
      role: '',
    })
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const callErrors = (name, email, password, role) => {
    const errors = {}
    if (!name) {
      errors.name = 'Enter the User Name'
    }
    if (!email) {
      errors.email = 'Enter the User Email'
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid Email'
    }
    if (!password) {
      errors.password = 'Enter the User Password'
    }
    if (!role) {
      errors.role = 'Select the User Role'
    }

    setFormErrors(errors)
  }

  // Functions for Delete User Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    deleteUser(isModalOpen2)
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Update User Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getUserById(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    if (name && role) {
      updateUser(isModalOpen3)
      setIsModalOpen3(false)
      form.resetFields()
      setName('')
      setEmail('')
      setPassword('')
      setRole('')
      setTeamId('')
      setFormErrors({
        name: '',
        email: '',
        password: '',
        role: '',
      })
    } else {
      callErrors(name, email, password, role)
    }
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
    form.resetFields()
    setName('')
    setEmail('')
    setPassword('')
    setRole('')
    setTeamId('')
    setFormErrors({
      name: '',
      email: '',
      password: '',
      role: '',
    })
  }

  // Functions for Add User Success
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

  // Functions for Add User Failure
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

  // Functions for Delete User Success
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

  // Functions for Delete User Failure
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

  // Functions for Update User Success
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

  // Functions for Update User Failure
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

  //Array declarations for API calls
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [byuser, setUserById] = useState([])
  const [team, setTeam] = useState([])
  let filteredUsers = []

  //Initial rendering through useEffect
  useEffect(() => {
    getList()
    getRoles()
    getTeams()
  }, [])

  //Get calls handling
  const handleRoleChange = (value) => {
    setRole(value)
  }

  const handleTeamChange = (value) => {
    setTeamId(value)
  }

  // Get API call
  const getList = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/get_users`)
      const data = await response.json()

      let filteredUsers = []

      if (perm.some((item) => item.name === 'All_Data')) {  
        filteredUsers = data.Users
      } else if (perm.some((item) => item.name === 'Company_Data')) {
        filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && user.email !== local.Users.email)
      } else if (perm.some((item) => item.name === 'User_Data')) {
        filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id)
      }

      setUsers(filteredUsers)
    } catch (error) {
      console.log(error)
    }
  }

  function getRoles() {
    fetch(`${BASE_URL}/api/getroles`)
      .then((response) => response.json())
      .then((data) => setRoles(data.roles))
      .catch((error) => console.log(error))
  }

  function getRoles() {
    fetch(`${BASE_URL}/api/getroles`)
      .then((response) => response.json())
      .then((data) => {
        const filteredRoles = data.roles.filter((role) => role.id !== 1)
        setRoles(filteredRoles)
      })
      .catch((error) => console.log(error))
  }

  function getTeams() {
    fetch(`${BASE_URL}/api/get-teams`)
      .then((response) => response.json())
      .then((data) => {
        if (perm.some((item) => item.name === 'All_Data')) {
          filteredUsers = data.Teams
        } else if (perm.some((item) => item.name === 'Company_Data')) {
          filteredUsers = data.Teams.filter((tem) => tem.company_id === local.Users.company_id)
        }
        setTeam(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getUserById(id) {
    fetch(`${BASE_URL}/api/get_user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUserById(data.User)
        setName(data.User[0].name)
        setEmail(data.User[0].email)
        setRole(data.User[0].role)
      })
      .catch((error) => console.log(error))
  }

  // Add API call
  async function addUser() {
    let adduser = {
      name: name,
      email: email,
      password: password,
      role: role,
      company_id: local.Users.company_id,
      team_id: team_id,
    }
    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/add_user`, {
        method: 'POST',
        body: JSON.stringify(adduser),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        await getList()
        handleButtonClick1()
      } else {
        handleButtonClick2()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false) // Hide loader
    }
  }

  // Delete API call
  async function deleteUser(newid) {
    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/delete_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newid,
        }),
      })

      if (response.ok) {
        await getList()
        handleButtonClick3()
      } else {
        handleButtonClick4()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false) // Hide loader
    }
  }

  // Update API call
  async function updateUser(newid) {
    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/update_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newid,
          name: name,
          email: email,
          role: role,
          company_id: local.Users.company_id,
          team_id: team_id,
        }),
      })

      if (response.ok) {
        await getList()
        handleButtonClick5()
      } else {
        handleButtonClick6()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false) // Hide loader
    }
  }

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  const [searchedUser, setSearchedUser] = useState('')

  const handleUserSearch = (value) => {
    setSearchedUser(value)
  }

  const clearFilter = () => {
    form.resetFields()
    setSearchedUser('')
  }
  return (
    <>
      {/* BUTTON (for company to create a user) */}
      <div className="row">
        <div className="col-md 6">
          <h3>Users</h3>
        </div>
        <div className="col-md 6">
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add User
            </Button>
          ) : null}
        </div>
      </div>

      {isCreateButtonEnabled ? (
        <div className="row mt-2 mb-2 justify-content-between">
          <div className="col-md-4">
            {perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data') ? (
              <div className="d-flex">
                <Form form={form} style={{ width: '100%' }}>
                  <Form.Item name="select" hasFeedback>
                    <Select
                      showSearch
                      placeholder="Enter User Name"
                      onChange={handleUserSearch}
                      value={name}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: '100%' }}
                    >
                      {users.map((user) => (
                        <Select.Option value={user.id} key={user.id}>
                          {user.name}
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
      ) : null}

      <br />
      {/* TABLE (where company employee are previewed) */}
      <div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <CTable
            align="middle"
            className="mb-0 border"
            hover
            responsive
            style={{ marginTop: '20px' }}
          >
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Sr/No
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  User Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Email
                </CTableHeaderCell>
                {perm.some((item) => item.name === 'All_Data') ? (
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Role
                  </CTableHeaderCell>
                ) : null}
                {isEditButtonEnabled || isDeleteButtonEnabled ? (
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Action
                  </CTableHeaderCell>
                ) : null}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users
                .filter((user) => {
                  // Apply Department filter
                  if (searchedUser !== '') {
                    return user.id === searchedUser
                  }
                  return true
                })
                .map((user, index) => (
                  <CTableRow key={user.id}>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {index + 1}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {user.name}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {user.email}
                    </CTableHeaderCell>
                    {perm.some((item) => item.name === 'All_Data') ? (
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {user.role}
                      </CTableHeaderCell>
                    ) : null}
                    {isEditButtonEnabled || isDeleteButtonEnabled ? (
                      <CTableHeaderCell className="text-center" style={mystyle2}>
                        {isEditButtonEnabled ? (
                          <IconButton aria-label="update" onClick={() => showModal3(user.id)}>
                            <EditIcon htmlColor="#28B463" />
                          </IconButton>
                        ) : null}
                        {isDeleteButtonEnabled ? (
                          <IconButton aria-label="delete" onClick={() => showModal2(user.id)}>
                            <DeleteIcon htmlColor="#FF0000" />
                          </IconButton>
                        ) : null}
                      </CTableHeaderCell>
                    ) : null}
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        )}
      </div>
      {/* MODALS */}
      <div>
        {/* Modal for Add User */}
        <Modal
          title="Add a User"
          open={isModalOpen}
          okButtonProps={{ style: { background: 'blue' } }}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
        >
          <br></br>

          <div className="form-outline mt-3">
            <label>Username</label>
            <input
              type="text"
              value={name}
              name="name"
              onFocus={handleFocus}
              onChange={(e) => setName(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter User Name"
            />
          </div>
          {formErrors.name && <div className="text-danger">{formErrors.name}</div>}

          <div className="form-outline mt-3">
            <label>Email</label>
            <input
              type="email"
              value={email}
              name="email"
              onFocus={handleFocus}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control form-control-lg"
              placeholder="Enter Email"
            />
          </div>
          {formErrors.email && <div className="text-danger">{formErrors.email}</div>}

          <div className="form-outline mt-3">
            <label>Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                name="password"
                onFocus={handleFocus}
                onChange={handlePasswordChange}
                className="form-control form-control-lg"
                placeholder="Enter Password"
              />
              <IconButton
                onClick={toggleShowPassword}
                edge="end"
                className="visibility-icon"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </div>
          </div>
          {formErrors.password && <div className="text-danger">{formErrors.password}</div>}

          <Form form={form}>
            <div className="form-outline mt-3">
              <label>Role</label>
              <Form.Item
                name="role"
                validateStatus={formErrors.role ? 'error' : ''}
                help={formErrors.role}
              >
                <Select
                  placeholder="Select Role Id"
                  onChange={handleRoleChange}
                  onFocus={handleFocus}
                  name="role"
                  value={role}
                >
                  {roles.map((user) => (
                    <Select.Option value={user.id} key={user.id}>
                      {user.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form>
        </Modal>

        {/* Modal for Update User */}
        <Modal
          title="Update a User"
          open={isModalOpen3}
          onOk={handleOk3}
          okButtonProps={{ style: { background: 'blue' } }}
          onCancel={handleCancel3}
          maskClosable={false}
        >
          <br></br>

          {byuser.map((user) => (
            <div key={user.id}>
              <div className="form-outline mt-3">
                <label>Username</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user.name}
                  onFocus={handleFocus}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter User Name"
                />
              </div>
              {formErrors.name && <div className="text-danger">{formErrors.name}</div>}

              <Form form={form}>
                <div className="form-outline mt-3">
                  <label>Role</label>
                  <Form.Item
                    name="role"
                    validateStatus={formErrors.role ? 'error' : ''}
                    help={formErrors.role}
                  >
                    <Select
                      placeholder="Select Role"
                      onFocus={handleFocus}
                      onChange={handleRoleChange}
                      defaultValue={user.role}
                      name="role"
                    >
                      {roles.map((user) => (
                        <Select.Option value={user.id} key={user.id}>
                          {user.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Form>
            </div>
          ))}
        </Modal>

        {/* Modal for Deletion Confirmation */}
        <Modal
          title="Are you sure you want to delete?"
          open={isModalOpen2}
          onOk={handleOk2}
          okButtonProps={{ style: { background: 'blue' } }}
          onCancel={handleCancel2}
          style={modalStyle}
        ></Modal>

        {/* Alert for Add User Success*/}
        {showAlert1 && (
          <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
            User Added Successfully
          </Alert>
        )}

        {/* Alert for Add User Failure*/}
        {showAlert2 && (
          <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
            Failed to Add User
          </Alert>
        )}

        {/* Alert for Delete User Success*/}
        {showAlert3 && (
          <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
            User Deleted Successfully
          </Alert>
        )}

        {/* Alert for Delete User Failure*/}
        {showAlert4 && (
          <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
            Failed to Delete User
          </Alert>
        )}

        {/* Alert for Update User Success*/}
        {showAlert5 && (
          <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
            User Updated Successfully
          </Alert>
        )}

        {/* Alert for Update User Failure*/}
        {showAlert6 && (
          <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
            Failed to Update User
          </Alert>
        )}
      </div>
    </>
  )
}

export default Users
